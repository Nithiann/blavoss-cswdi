import { Gender } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

const salt = 10;

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

    @Prop({ type: [Types.ObjectId], ref: 'Ticket', default: [] })
    tickets!: Types.ObjectId[];
}
export const UserSchema = SchemaFactory.createForClass(User).set('toObject', { getters: true, virtuals: true });
export const UserModel = model('User', UserSchema);
UserSchema.pre('save', async function (next) {
    if (this.isModified('hash')) {
        this.hash = await bcrypt.hash(this.hash, salt);
    }

    next();
});