/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserService } from "./user.service";
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { Neo4jService, Ticket, TicketSchema, User, UserDocument, UserSchema } from "@blavoss-cswdi/backend/data-access";
import { Gender, Genre, ITicket, IUser, PersonalizationStatus, TicketStatus } from "@blavoss-cswdi/shared/api";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import * as dotenv from 'dotenv';
import { NotFoundException } from "@nestjs/common";
import * as jwt from 'jsonwebtoken';

describe('UserService', () => {
    let uService: UserService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let userModel: Model<UserDocument>;
    let neo4Service: Neo4jService;

    // create mock users
    const mockUsers: IUser[] = [
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'John.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Male
        },
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'Jane.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Female
        }
    ];

    beforeAll(async () => {
        let uri: string = '';
        dotenv.config(); // make sure env is available
        const app = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        uri = mongod.getUri();
                        return { uri };
                    },
                }),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Ticket.name, schema: TicketSchema }]),
            ],
            providers: [UserService, Neo4jService],
        }).compile();

        // set up services
        uService = app.get<UserService>(UserService);
        userModel = app.get<Model<UserDocument>>(getModelToken('User'));

        // create mongo connection
        mongoc = new MongoClient(uri);
        await mongoc.connect();

        // setup neo4j connection
        const neo4jApp = await Test.createTestingModule({
            providers: [Neo4jService],
        }).compile();

        neo4Service = neo4jApp.get<Neo4jService>(Neo4jService);
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('users').deleteMany({});

        const user1 = new userModel(mockUsers[0]);
        const user2 = new userModel(mockUsers[1]);

        await Promise.all([user1.save(), user2.save()]);
    })

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    it('should be defined', () => {
        expect(uService).toBeDefined();
    });

    it('should get all users', async () => {
        //arrange

        //act
        const users = await uService.getAll();

        //assert
        expect(users).toHaveLength(2);
        expect(users.map(u => u.firstName)).toContain('John');
        expect(users.map(u => u.gender)).toContain(Gender.Male);
    });

    it('should get user by id', async () => {
        //arrange

        //act
        const user = await uService.getOne(mockUsers[0]._id!);

        //assert
        expect(user).toBeDefined();
        expect(user!.firstName).toBe('John');
    });

    it('Should return error when user not found', async () => {
        //arrange

        // act & assert
        await expect(async () => {
            await uService.getOne(new Types.ObjectId().toString());
        }).rejects.toThrow(NotFoundException);
    })

    it('Should delete existing user', async () => {
        //arrange
        const userToDelete = mockUsers[0]._id;
        const deleteSpy = jest.spyOn(uService, 'delete');

        //act 
        const result = await uService.delete(userToDelete!);

        //assert
        expect(deleteSpy).toHaveBeenCalledWith(userToDelete);
        expect(result).toHaveProperty('firstName', 'John');
    });

    it('Should return error when user not found', async () => {
        //arrange
        const userToDelete = new Types.ObjectId().toString();

        //act & assert
        await expect(async () => {
            await uService.delete(userToDelete);
        }).rejects.toThrow(NotFoundException);
    });

    it('Should update existing user', async () => {
        //arrange
        const userToUpdate = mockUsers[0]._id?.toString();
        const updatedUser = {
            firstName: 'Joe',
            lastName: 'Doe',
            email: 'Joe.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Other
        }

        //act
        const result = await uService.update(userToUpdate!, updatedUser);

        //assert
        expect(result).toHaveProperty('firstName', 'Joe');
        expect(result).toHaveProperty('gender', Gender.Other);
    });

    it('Should return error when user not found', async () => {
        //arrange
        const userToUpdate = new Types.ObjectId().toString();
        const updatedUser = {
            firstName: 'Joe',
            lastName: 'Doe',
            email: 'Joe.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Other
        }

        //act & assert
        await expect(async () => {
            await uService.update(userToUpdate, updatedUser);
        }).rejects.toThrow(NotFoundException);
    });

    it('Should create new user', async () => {
        //arrange
        const newUser = {
            firstName: 'Joe',
            lastName: 'Doe',
            email: 'Joe.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Other
        }

        //act
        const result = await uService.create(newUser);

        //assert
        expect(result).toHaveProperty('firstName', 'Joe');
        expect(result.hash).not.toEqual(newUser.hash);
    });

    it('Should return error when data is incorrect', async () => {
        //arrange
        const newUser = {
            firstName: 'Joe',
            lastName: 'Doe',
            email: '',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Other
        }

        //act & assert
        await expect(async () => {
            await uService.create(newUser);
        }).rejects;
    });

    it('should add a ticket to the user and update Neo4j', async () => {
        // arrange
        const mockTicket: ITicket = {
            _id: new Types.ObjectId(),
            userId: mockUsers[0],
            festivalId: { _id: '123123123', name: 'test', genre: Genre.Dubstep},
            ticketAmount: 1,
            purchaseDate: new Date(),
            status: TicketStatus.Purchased,
            PersonalizationStatus: PersonalizationStatus.NotPersonalized,
        };
    
        // act
        const result = await uService.addTicketToUser(mockTicket);
    
        // assert
        expect(result.tickets).toContainEqual(mockTicket._id);
    });

    it('should generate a valid JWT access token', () => {
        // arrange
        const mockUser: IUser = {
            _id: new Types.ObjectId().toString(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Male,
        };

        // act
        const token = uService['generateAccessToken'](mockUser);

        // assert
        const decodedToken = jwt.decode(token) as { sub: string; email: string };
        expect(decodedToken.sub).toBe(mockUser._id);
        expect(decodedToken.email).toBe(mockUser.email);
    });
})