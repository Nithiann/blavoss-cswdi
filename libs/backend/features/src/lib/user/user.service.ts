import { Gender, ILogin, ITicket, IUser } from "@blavoss-cswdi/shared/api";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BehaviorSubject } from "rxjs";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import { UserDocument } from "@blavoss-cswdi/backend/data-access";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>) {}

    TAG = 'UserService';
    salt = 10;

    private users$ = new BehaviorSubject<IUser[]>([
        {
            _id: `user-${Math.floor(Math.random() * 10000)}`,
            email: 'HkXU3@example.com',
            hash: '123',
            firstName: 'Voss',
            lastName: 'Bos',
            dob: new Date(),
            gender: Gender.Male,
            tickets: [],
        }
    ]);

    async login(creds: ILogin): Promise<{user: IUser; token: string}> {
        Logger.log('login', this.TAG);

        try {
            const user = await this.userModel.findOne({ email: creds.email }).exec();

            if (!user) {
                throw new NotFoundException('User could not be found');
            }

            const match = await bcrypt.compare(creds.password, user.hash);
            if (!match) {
                throw new NotFoundException('Email or password might be incorrect');
            }

            const accessToken = this.generateAccessToken(user.toObject());

            return { ...user.toObject(), token: accessToken }
            
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async getAll(): Promise<IUser[]> {
        Logger.log('getAll', this.TAG);
        
        const users = await this.userModel.find().exec();

        return users.map(user => user.toObject());
    }

    async getOne(id: string): Promise<IUser> {
        Logger.log(`getOne(${id})`, this.TAG);
        try {
            const user = await this.userModel.findById(id)
            .populate('tickets')
            .populate({
                path: 'tickets',
                populate: {
                  path: 'festivalId',
                  model: 'Festival',
                  select: 'name'
                },
              }).exec();
            if (!user) {
                throw new NotFoundException('User could not be found');
            }
            return user.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async update(id: string, updatedUser: Partial<IUser>): Promise<IUser> {
        Logger.log('update', this.TAG);

        try {
            const user = await this.userModel.findByIdAndUpdate(id, updatedUser, { new: true, runValidators: true }).exec();

            if (!user) {
                throw new NotFoundException('User could not be found');
            }

            return user.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async create(user: Pick<IUser, 'email' | 'hash' | 'firstName' | 'lastName' | 'dob' | 'gender'>): Promise<IUser> {
        Logger.log('create', this.TAG);
        
        const newUser = new this.userModel({
            ...user,
        });

        newUser.hash = await bcrypt.hash(newUser.hash, this.salt);
       
        await newUser.save();

        return newUser.toObject();
    }

    async delete(id: string): Promise<IUser> {
        Logger.log('delete', this.TAG);
        try {
            const user = await this.userModel.findByIdAndDelete(id).exec();
            if (!user) {
                throw new NotFoundException('User could not be found');
            }
            return user.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async addTicketToUser(ticket: ITicket): Promise<IUser> {
        Logger.log('addTicketToUser', this.TAG);
        try {
            const user = await this.userModel.findById(ticket.userId).exec();

            if (!user) {
                throw new NotFoundException('User could not be found');
            }

            const ticketObjectId = new Types.ObjectId(ticket._id);

            if (!user.tickets.includes(ticketObjectId)) {
                user.tickets.push(ticketObjectId);
                await user.save();
            }

            return user.toObject();
        } catch(err) {
            throw new NotFoundException(err);
        }
    }

    private generateAccessToken(user: IUser) : string {
        const payload = {
            sub: user._id,
            email: user.email
        };

        const secret = process.env['JWT_SECRET'];
        const options = { expiresIn: '1h' };

        return jwt.sign(payload, secret!, options);
    }
}