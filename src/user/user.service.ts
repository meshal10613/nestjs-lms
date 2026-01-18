import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUserDto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from 'src/auth/dto/loginUserDto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(registerUserDto: RegisterDto) {
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

    async getUserByEmail(loginUserDto: LoginDto) {
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
}
