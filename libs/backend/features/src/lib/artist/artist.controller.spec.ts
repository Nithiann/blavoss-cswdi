/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from "@nestjs/testing";
import { ArtistController } from './artist.controller';
import { Genre, IArtist, IFestival, } from "@blavoss-cswdi/shared/api";
import { Types } from "mongoose";
import { ArtistService } from "../artist/artist.service";
import { NotFoundException } from "@nestjs/common";

describe('ArtistController', () => {
    let app: TestingModule;
    let aController: ArtistController;
    let aService: ArtistService;

    const mockArtists: IArtist[] = [
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            name: 'Artist 1',
            genre: Genre.EDM,
            description: 'hello w113',
            image: 'image 1',
            festivals: []
        },
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            name: 'Artist 2',
            genre: Genre.Dubstep,
            description: 'hello w113',
            image: 'image 2',
            festivals: []
        }
    ]

    const mockFestivals: IFestival[] = [
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(),
            name: 'Festival 1',
            location: 'Location 1',
            startDate: new Date(2024, 9, 12),
            endDate: new Date(2024, 9, 15),
            description: 'Description 1',
            ticketPrice: 10,
            image: 'image 1',
            genre: Genre.Dubstep,
            artists: [],
            tickets: []
        },
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f9').toString(),
            name: 'Festival 2',
            location: 'Location 2',
            startDate: new Date(2024, 9, 12),
            endDate: new Date(2024, 9, 15),
            description: 'Description 2',
            ticketPrice: 20,
            image: 'image 2',
            genre: Genre.EDM,
            artists: [],
            tickets: []
        }
    ];

    beforeAll(async () => {
        app = await Test.createTestingModule({
            controllers: [ArtistController],
            providers: [
                {
                    provide: ArtistService,
                    useValue: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        create: jest.fn(),
                        delete: jest.fn(),
                        update: jest.fn(),
                        addFestivalToArtist: jest.fn(),
                        removeFestivalFromArtist: jest.fn()
                    }
                }
            ]
        }).compile();
        aController = app.get<ArtistController>(ArtistController);
        aService = app.get<ArtistService>(ArtistService);
    });

    describe('getAll', () => {
        it('should call getAll on the service', async () => {
            // arrange
            const getAll = jest.spyOn(aService, 'getAll').mockImplementation(async () => [mockArtists[0], mockArtists[1]]);
            // act
            const results = await aController.getAll();

            //assert
            expect(getAll).toHaveBeenCalled();
            expect(results).toHaveLength(2);
            expect(results[0]).toEqual(mockArtists[0]);
        });
    });

    describe('getOne', () => {
        it('should call getOne on the service', async () => {
            // arrange
            const getOne = jest.spyOn(aService, 'getOne').mockImplementation(async () => mockArtists[0]);
            
            // act
            const results = await aController.getOne(mockArtists[0]._id!.toString());
            
            //assert
            expect(getOne).toHaveBeenCalled();
            expect(results).toEqual(mockArtists[0]);
        });

        it('should return error when artist not found', async () => {
            // arrange
            const getOne = jest.spyOn(aService, 'getOne').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(aController.getOne(mockArtists[0]._id!.toString())).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should call create on the service', async () => {
            // arrange
            const newArtist = {
                name: 'Festival 3',
                description: '123123',
                genre: Genre.EDM,
                image: 'image 3',
                festivals: []
            }
            const create = jest.spyOn(aService, 'create').mockImplementation(async () => newArtist);
            
            // act
            const results = await aController.create(newArtist);

            //assert
            expect(create).toHaveBeenCalled();
            expect(results).toEqual(newArtist);
        });

        it('should return error if data is invalid', async () => {
            // arrange
            const newArtist = {
                name: '',
                description: '123123',
                genre: Genre.EDM,
                image: 'image 3',
                festivals: []
            }
            const create = jest.spyOn(aService, 'create').mockImplementation(async () => newArtist);

            // act & assert
            expect(create).toHaveBeenCalled();
        })
    });

    describe('update', () => {
        it('should call update on the service', async () => {
            // arrange
            const artistToUpdate = mockArtists[0]._id?.toString();
            const updatedArtist = {
                name: 'Festival 3',
                description: '123123',
                genre: Genre.EDM,
                image: 'image 3',
                festivals: []
            }
            const update = jest.spyOn(aService, 'update').mockImplementation(async () => updatedArtist);
        
            // act
            const results = await aController.update(artistToUpdate!, updatedArtist);
        
            //assert
            expect(update).toHaveBeenCalled();
            expect(results).toEqual(updatedArtist);
        });

        it('should return error if start date is after end date', async () => {
            // arrange
            const artistToUpdate = mockArtists[0]._id?.toString();
            const updatedArtist = {
                name: 'Festival 3',
                description: '123123',
                genre: Genre.EDM,
                image: 'image 3',
                festivals: []
            }
            const update = jest.spyOn(aService, 'update').mockImplementation(async () => updatedArtist);
        
            // act & assert
            await expect(update).toHaveBeenCalled();
        });

        it('should return error when festival not found', async () => {
            const artistToUpdate = new Types.ObjectId().toString();
            const updatedArtist = {
                name: 'Festival 3',
                description: '123123',
                genre: Genre.EDM,
                image: 'image 3',
                festivals: []
            }
            const update = jest.spyOn(aService, 'update').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(aController.update(artistToUpdate, updatedArtist)).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete existing festival', async () => {
            //arrange
            const artistToDelete = mockArtists[0]._id;
            const deleteSpy = jest.spyOn(aService, 'delete').mockImplementation(async () => mockArtists[0]);
        
            // act
            const result = await aController.delete(artistToDelete!.toString());

            //assert
            expect(deleteSpy).toHaveBeenCalled();
            expect(result).toEqual(mockArtists[0]);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const festivalToDelete = new Types.ObjectId().toString();
            const deleteSpy = jest.spyOn(aService, 'delete').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(aController.delete(festivalToDelete)).rejects.toThrow(NotFoundException);
        })
    })
})