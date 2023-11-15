import { Gender } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop()
    email!: string;

    @Prop()
    hash!: string;

    @Prop()
    firstName!: string;

    @Prop()
    lastName!: string;

    @Prop()
    dob!: Date;

    @Prop({ type: String, enum: Object.values(Gender), default: Gender.None})
    gender!: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);