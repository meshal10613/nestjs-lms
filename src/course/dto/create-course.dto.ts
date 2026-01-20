import {
    IsEnum,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';
import { Level } from '../course.types';

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsEnum(Level, {
        message: 'level must be one of beginner, intermediate, advanced',
    })
    level: Level;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsMongoId()
    userId: string;
}
