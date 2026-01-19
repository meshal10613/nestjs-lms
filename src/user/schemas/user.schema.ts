import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
    timestamps: true,
})
export class User {
    @Prop({ required: true })
    fname: string;

    @Prop({ required: true })
    lname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ enum: UserRole, default: UserRole.Student })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
