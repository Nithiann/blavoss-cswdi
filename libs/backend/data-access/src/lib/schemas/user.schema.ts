import { Gender, ITicket, IUser } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { IsMongoId } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

const salt = 10;

@Schema()
export class User implements IUser{
    @IsMongoId()
    _id!: string;

    @Prop({required: true, unique: true})
    email!: string;

    @Prop({ select: false, required: true })
    hash!: string;

    @Prop({required: true})
    firstName!: string;

    @Prop({required: true})
    lastName!: string;

    @Prop({required: true})
    dob!: Date;

    @Prop({ type: String, enum: Object.values(Gender), default: Gender.None})
    gender!: Gender;

    @Prop({ type: [Types.ObjectId], ref: 'Ticket', default: [] })
    tickets!: ITicket[];
}
export const UserSchema = SchemaFactory.createForClass(User).set('toObject', { getters: true, virtuals: true });
export const UserModel = model('User', UserSchema);
UserSchema.pre('save', async function (next) {
    if (this.isModified('hash')) {
        this.hash = await bcrypt.hash(this.hash, salt);
    }

    next();
});