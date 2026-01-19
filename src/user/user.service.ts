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
            return user;
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
        return await this.userModel.findById({ _id: id }).select('-password');
    }

    async getAllUser() {
        return await this.userModel.find().select('-password');
    }

    async deleteUserById(currentUser: any, targetUserId: string) {
        // 1️⃣ Validate ID length and format
        if (!Types.ObjectId.isValid(targetUserId)) {
            throw new BadRequestException(
                'Invalid user ID: must be a 24-character hexadecimal string',
            );
        }

        const targetUser = await this.getUserById(targetUserId);

        if (!targetUser) {
            throw new NotFoundException(
                `User with ID ${targetUserId} not found`,
            );
        }

        // 2️⃣ Self-deletion: allowed for everyone
        if (currentUser.sub === targetUserId) {
            return await this._delete(targetUserId);
        }

        // 3️⃣ Admin deleting non-admin: allowed
        if (
            currentUser.role === UserRole.Admin &&
            targetUser.role !== UserRole.Admin
        ) {
            return await this._delete(targetUserId);
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
