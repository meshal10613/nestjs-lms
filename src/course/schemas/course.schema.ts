import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Level } from '../course.types';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
    versionKey: false,
})
export class Course {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ enum: Level, required: true, unique: false })
    level: string;

    @Prop({ required: true })
    price: number;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
