import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EnrollmentStatus } from '../enrollment.types';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class Enrollment {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
    courseId: Types.ObjectId;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop()
    transactionId?: string;

    @Prop({
        enum: EnrollmentStatus,
        default: EnrollmentStatus.ACTIVE,
    })
    status: EnrollmentStatus;

    @Prop({ default: 0, min: 0, max: 100 })
    progress: number;

    @Prop()
    completedAt?: Date;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
