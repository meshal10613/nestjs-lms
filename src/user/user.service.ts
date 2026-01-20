import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/dto/register.user.dto';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { LoginUserDto } from 'src/auth/dto/login.user.dto';
import { UserRole } from './user.types';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(registerUserDto: RegisterUserDto) {
        try {
            return await this.userModel.create({
                fname: registerUserDto.fname,
                lname: registerUserDto.lname,
                email: registerUserDto.email,
                password: registerUserDto.password,
            });
        } catch (error: unknown) {
            console.log(error);
            const e = error as { code?: number };

            const DUPLICATE_KEY_CODE = 11000;
            if (e.code === DUPLICATE_KEY_CODE) {
                throw new ConflictException('Email already exists');
            }

            throw error;
        }
    }

    async getUserByEmail(loginUserDto: LoginUserDto) {
        try {
            const user = await this.userModel
                .findOne({ email: loginUserDto.email })
                .exec();
            if (!user) {
                throw new NotFoundException('User not found');
            }
            return {
                message: `User fetched successfully`,
                data: user,
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }

            throw new InternalServerErrorException(
                'Something went wrong while finding user',
            );
        }
    }

    async getUserById(id: string) {
        const result = await this.userModel
            .findById({ _id: id })
            .select('-password');
        return {
            message: `User fetched successfully`,
            data: result,
        };
    }

    async getAllUser() {
        const result = await this.userModel.find().select('-password');
        return { message: `All users fetched successfully`, data: result };
    }

    async updateUserById(
        targetUserId: string,
        data: any,
        requesterId: string,
        requesterRole: UserRole,
    ) {
        if (!Types.ObjectId.isValid(targetUserId)) {
            throw new BadRequestException('Invalid user ID');
        }

        const targetUser = await this.getUserById(targetUserId);
        if (!targetUser) {
            throw new NotFoundException('User not found');
        }

        const isSelf = requesterId === targetUserId;
        const isAdmin = requesterRole === UserRole.Admin;

        const SELF_FIELDS = ['fname', 'lname', 'email', 'password'];
        const ADMIN_SELF_FIELDS = [...SELF_FIELDS, 'role'];
        const ADMIN_OTHER_FIELDS = ['role'];

        // 🚫 Normal user rules
        if (!isAdmin) {
            if (!isSelf) {
                throw new ForbiddenException(
                    'You can only update your own profile',
                );
            }

            if ('role' in data) {
                throw new ForbiddenException('You cannot update role');
            }
        }

        // 👑 Admin rules
        if (isAdmin && !isSelf) {
            const keys = Object.keys(data);

            // Admin can ONLY update role for others
            if (keys.length !== 1 || !keys.includes('role')) {
                throw new ForbiddenException(
                    'Admin can only update role of other users',
                );
            }
        }

        // 🎯 Allowed fields
        let allowedFields: string[] = [];
        if (isAdmin) {
            // if admin & is self then can update
            if (isSelf) {
                allowedFields = ADMIN_SELF_FIELDS;
            } else {
                // if admin & is not self then can only update role
                allowedFields = ADMIN_OTHER_FIELDS;
            }
        }
        // if not admin then can only update self
        allowedFields = isSelf ? SELF_FIELDS : allowedFields;

        const filteredData = Object.keys(data)
            .filter((key) => allowedFields.includes(key))
            .reduce(
                (obj, key) => {
                    obj[key] = data[key];
                    return obj;
                },
                {} as Record<string, any>,
            );

        if (Object.keys(filteredData).length === 0) {
            throw new BadRequestException('No valid fields to update');
        }

        const updatedUser = await this.userModel.findByIdAndUpdate(
            targetUserId,
            filteredData,
            {
                new: true,
            },
        );

        return {
            message: `${Object.keys(filteredData).join(', ')} updated successfully`,
            data: updatedUser,
        };
    }

    async deleteUserById(currentUser: any, targetUserId: string) {
        // 1️⃣ Validate ID length and format
        if (!Types.ObjectId.isValid(targetUserId)) {
            throw new BadRequestException(
                'Invalid user ID: must be a 24-character hexadecimal string',
            );
        }

        const { data: targetUser } = await this.getUserById(targetUserId);

        if (!targetUser) {
            throw new NotFoundException(
                `User with ID ${targetUserId} not found`,
            );
        }

        // 2️⃣ Self-deletion: allowed for everyone
        if (currentUser.sub === targetUserId) {
            const result = await this._delete(targetUserId);
            return {
                message: `User ${targetUserId} deleted successfully`,
                data: result,
            };
        }

        // 3️⃣ Admin deleting non-admin: allowed
        if (
            currentUser.role === UserRole.Admin &&
            targetUser.role !== UserRole.Admin
        ) {
            const result = await this._delete(targetUserId);
            return {
                message: `User ${targetUserId} deleted successfully`,
                data: result,
            };
        }

        // 4️⃣ Otherwise, forbidden
        throw new ForbiddenException('You cannot delete this user');
    }

    // Private helper to delete user
    private async _delete(id: string) {
        const result = await this.userModel.deleteOne({ _id: id }).exec();

        if (result.deletedCount === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return 'User deleted successfully';
    }
}
