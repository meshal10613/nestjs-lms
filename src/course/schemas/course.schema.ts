import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Level } from '../course.types';

export type CourseDocument = HydratedDocument<Course>;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Course {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ enum: Level, required: true })
    level: Level;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
