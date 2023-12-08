import { Gender, ILogin, ITicket, IUser, environment, userRole } from "@blavoss-cswdi/shared/api";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BehaviorSubject } from "rxjs";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { Neo4jService, UserDocument } from "@blavoss-cswdi/backend/data-access";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private readonly userModel: Model<UserDocument>, @InjectModel('Ticket') private readonly ticketModel: Model<ITicket>, private neo4jService: Neo4jService) {}

    TAG = 'UserService';
    salt = 10;
    neo = this.neo4jService.getSession();

    private users$ = new BehaviorSubject<IUser[]>([
        {
            _id: `user-${Math.floor(Math.random() * 10000)}`,
            email: 'HkXU3@example.com',
            hash: '123',
            firstName: 'Voss',
            lastName: 'Bos',
            dob: new Date(),
            gender: Gender.Male,
            role: userRole.User,
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
        
        const users = await this.userModel.find().select('-hash').exec();

        return users.map(user => user.toObject());
    }

    async getOne(id: string): Promise<IUser> {
        Logger.log(`getOne(${id})`, this.TAG);
        try {
            const user = await this.userModel.findById(id)
            .select('-hash')
            .populate('tickets')
            .populate({
                path: 'tickets',
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

            await this.ticketModel.deleteMany({userId: id});
            
            return user.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async addTicketToUser(ticket: ITicket): Promise<IUser> {
        Logger.log('addTicketToUser', this.TAG);
        try {
            const user = await this.userModel.findById(ticket.userId);

            if (!user) {
                throw new NotFoundException('User could not be found');
            }

            const updateUser = await this.userModel.findByIdAndUpdate(ticket.userId, {
                $push: {
                    tickets: {
                        $each: [ticket._id],
                    }
                }
            });
            
            
            if (updateUser?.isModified('tickets')) {
                Logger.log('i am here', this.TAG);  
                await updateUser.save();
            }
            await this.neo4jService.purchaseTicket(ticket.userId.toString(), ticket.festivalId);
            return user.toObject();
            // store in neo
            

        } catch(err) {
            throw new NotFoundException(err);
        }
    }

    private generateAccessToken(user: IUser) : string {
        const payload = {
            sub: user._id,
            email: user.email,
            role: user.role
        };

        const secret = environment.jwt_secret;
        const options = { expiresIn: '1h' };

        return jwt.sign(payload, secret!, options);
    }
}