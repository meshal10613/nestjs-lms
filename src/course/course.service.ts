import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model, Types } from 'mongoose';
import { UserRole } from 'src/user/user.types';
import { User, UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class CourseService {
    constructor(
        @InjectModel(Course.name) private courseModel: Model<Course>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createCourseDto: CreateCourseDto) {
        const { userId } = createCourseDto;

        // 1️⃣ Validate userId format
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException(
                'Invalid userId: must be a 24-character hexadecimal string',
            );
        }

        // 2️⃣ Check if user exists
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        // 3️⃣ Check if user is an Admin
        if (user.role !== UserRole.Admin) {
            throw new ForbiddenException(
                `User with ID ${userId} is not an admin and cannot create courses`,
            );
        }

        // 4️⃣ Create the course
        const result = await this.courseModel.create(createCourseDto);
        await result.populate('userId', '-password');
        return {
            message: 'Course created successfully',
            data: result,
        };
    }

    findAll() {
        return `This action returns all course`;
    }

    findOne(id: number) {
        return `This action returns a #${id} course`;
    }

    async updateCourseById(id: string, updateCourseDto: UpdateCourseDto) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(
                'Invalid user ID: must be a 24-character hexadecimal string',
            );
        }

        const course = await this.courseModel.findById(id);
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        const result = await this.courseModel
            .findByIdAndUpdate(id, updateCourseDto, { new: true })
            .populate('userId', '-password');
        return {
            message: `${Object.keys(updateCourseDto).join(', ')} updated successfully`,
            data: result,
        };
    }

    async deleteCourseById(id: string) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException(
                'Invalid user ID: must be a 24-character hexadecimal string',
            );
        }

        const course = await this.courseModel.findById(id);
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        await this.courseModel.findByIdAndDelete(id);
        return {
            message: 'Course deleted successfully',
        };
    }
}
