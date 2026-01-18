import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    level: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
