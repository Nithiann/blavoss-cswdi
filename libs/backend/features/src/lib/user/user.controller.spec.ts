import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';
import { Types } from 'mongoose';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('UserController', () => {
    let app: TestingModule;
    let uController: UserController;
    let uService: UserService;

    const mockUsers: IUser[] = [
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'John.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Male,
            tickets: []
        },
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'Jane.doe@gmail.com',
            hash: 'test',
            dob: new Date(),
            gender: Gender.Female,
            tickets: []
        }
    ]

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        login: jest.fn(),
                        addTicketToUser: jest.fn(),
                        generateAccessToken: jest.fn(),
                    }
                }
            ]
        }).compile();

        uController = app.get<UserController>(UserController);
        uService = app.get<UserService>(UserService);
    });

    describe('getAll', () => {
        it('should get all users', async () => {
            //arrange
            const getAll = jest.spyOn(uService, 'getAll').mockImplementation(async () => mockUsers);

            //act
            const results = await uController.getAll();

            //assert
            expect(getAll).toBeCalledTimes(1);
            expect(results).toHaveLength(2);
            expect(results[0]).toHaveProperty('_id', mockUsers[0]._id);
        })
    })

    describe('getOne', () => {
        it('should retrieve one user', async () => {
            //arrange
            const getOne = jest.spyOn(uService, 'getOne').mockImplementation(async () => mockUsers[0]);

            //act
            const results = await uController.getOne(mockUsers[0]._id!.toString());

            //assert
            expect(getOne).toBeCalledTimes(1);
            expect(results).toHaveProperty('_id', mockUsers[0]._id);
        });

        it('should return error when user not found', async () => {
            //arrange
            const getOne = jest.spyOn(uService, 'getOne').mockImplementation(async () => {
                throw new NotFoundException();
            });

            //act
            await expect(uController.getOne(mockUsers[0]._id!.toString())).rejects.toThrow(NotFoundException);
            expect(getOne).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete existing user', async () => {
            //arrange
            const userToDelete = mockUsers[0]._id;
            const deleteSpy = jest.spyOn(uService, 'delete').mockImplementation(async () => mockUsers[0]);

            //act
            const result = await uController.delete(userToDelete!.toString());

            //assert
            expect(deleteSpy).toHaveBeenCalledWith(userToDelete);
            expect(result).toHaveProperty('_id', mockUsers[0]._id);
        });

        it('should return error when user not found', async () => {
            //arrange
            const userToDelete = new Types.ObjectId().toString();
            const deleteSpy = jest.spyOn(uService, 'delete').mockImplementation(async () => {
                throw new NotFoundException();
            });

            //act
            await expect(uController.delete(userToDelete)).rejects.toThrow(NotFoundException);
            expect(deleteSpy).toHaveBeenCalledWith(userToDelete);
        });
    });

    describe('create', () => {
        it('should create new user', async () => {
            //arrange
            const createData: IUser = {
                _id: new Types.ObjectId().toString(),
                firstName: 'John',
                lastName: 'Doe',
                email: 'John.doe@gmail.com',
                hash: 'test',
                dob: new Date(),
                gender: Gender.Male,
                tickets: []
            };
            const createSpy = jest.spyOn(uService, 'create').mockImplementation(async () => createData);

            //act
            const result = await uController.create(createData);

            //assert
            expect(createSpy).toHaveBeenCalledWith(createData);
            expect(result).toHaveProperty('_id', createData._id);
            expect(result).toHaveProperty('firstName', 'John');
        });

        it('should return error when user already exists', async () => {
            //arrange
            const createData: IUser = {
                _id: new Types.ObjectId().toString(),
                firstName: 'John',
                lastName: 'Doe',
                email: 'John.doe@gmail.com',
                hash: 'test',
                dob: new Date(),
                gender: Gender.Male,
                tickets: []
            };

            const createSpy = jest.spyOn(uService, 'create').mockImplementation(async () => {
                throw new ConflictException();
            });

            //act
            await expect(uController.create(createData)).rejects.toThrow(ConflictException);
            expect(createSpy).toHaveBeenCalledWith(createData);
        });

        it('Should return error when data is incorrect', async () => {
            //arrange
            const createData: IUser = {
                _id: new Types.ObjectId().toString(),
                firstName: 'John',
                lastName: 'Doe',
                email: 'John.doe@gmail.com',
                hash: 'test',
                dob: new Date(),
                gender: Gender.Male,
                tickets: []
            };
            const createSpy = jest.spyOn(uService, 'create').mockImplementation(async () => {
                throw new BadRequestException();
            });

            //act
            await expect(uController.create(createData)).rejects.toThrow(BadRequestException);
            expect(createSpy).toHaveBeenCalledWith(createData);
        });
    });

    describe('update', () => {
        it('should update existing user', async () => {
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
            const updateSpy = jest.spyOn(uService, 'update').mockImplementation(async () => updatedUser);

            //act
            const result = await uController.update(userToUpdate!, updatedUser);

            //assert
            expect(updateSpy).toHaveBeenCalledWith(userToUpdate, updatedUser);
            expect(result).toHaveProperty('firstName', 'Joe');
            expect(result).toHaveProperty('gender', Gender.Other);
        });

        it('should return error when user not found', async () => {
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
            const updateSpy = jest.spyOn(uService, 'update').mockImplementation(async () => {
                throw new NotFoundException();
            });

            //act
            await expect(uController.update(userToUpdate, updatedUser)).rejects.toThrow(NotFoundException);
            expect(updateSpy).toHaveBeenCalledWith(userToUpdate, updatedUser);
        });

        it('Should return error when data is incorrect', async () => {
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
            const updateSpy = jest.spyOn(uService, 'update').mockImplementation(async () => {
                throw new BadRequestException();
            });

            //act
            await expect(uController.update(userToUpdate, updatedUser)).rejects.toThrow(BadRequestException);
            expect(updateSpy).toHaveBeenCalledWith(userToUpdate, updatedUser);
        })
    })

    describe('login', () => {
        it('Should login user', async () => {
            //arrange
            const creds = {
                email: 'Joe.doe@gmail.com',
                password: 'test'
            }
            const loginSpy = jest.spyOn(uService, 'login').mockImplementation(async () => {
                return {
                    user: mockUsers[0],
                    token: 'token'
                }
            })

            //act
            const result = await uController.login(creds);

            //assert
            expect(loginSpy).toHaveBeenCalledWith(creds);
            expect(result).toHaveProperty('user', mockUsers[0]);
            expect(result).toHaveProperty('token', 'token');
        });

        it('should return NotFoundException when details are incorrect', async () => {
            //arrange
            const creds = {
                email: 'Joe.doe@gmail.com',
                password: 'test'
            }
            const loginSpy = jest.spyOn(uService, 'login').mockImplementation(async () => {
                throw new NotFoundException();
            });

            //act
            await expect(uController.login(creds)).rejects.toThrow(NotFoundException);
            expect(loginSpy).toHaveBeenCalledWith(creds);
        })
    });
});