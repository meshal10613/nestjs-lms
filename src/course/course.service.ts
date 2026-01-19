import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CourseService {
    constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

    async create(createCourseDto: CreateCourseDto) {
        try {
            return await this.courseModel.create(createCourseDto);
        } catch (error: any) {
            // Mongo duplicate key error
            if (error.code === 11000) {
                throw new BadRequestException(
                    `Course with level "${error.keyValue.level}" already exists`,
                );
            }

            // Mongoose validation error for missing required fields
            if (error.name === 'ValidationError') {
                const missingFields = Object.keys(error.errors);
                throw new BadRequestException(
                    `Missing or invalid required field(s): ${missingFields.join(', ')}`,
                );
            }

            throw new InternalServerErrorException('Failed to create course');
        }
    }

    findAll() {
        return `This action returns all course`;
    }

    findOne(id: number) {
        return `This action returns a #${id} course`;
    }

    update(id: number, updateCourseDto: UpdateCourseDto) {
        console.log(updateCourseDto);
        return `This action updates a #${id} course`;
    }

    remove(id: number) {
        return `This action removes a #${id} course`;
    }
}
