import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
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

    @Prop({ enum: Role, default: Role.Student })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
