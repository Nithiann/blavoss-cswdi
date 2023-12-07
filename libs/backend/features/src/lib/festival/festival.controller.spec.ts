/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from "@nestjs/testing";
import { FestivalController } from './festival.controller'; 
import { FestivalService } from "./festival.service";
import { Gender, Genre, IArtist, IFestival, ITicket, PersonalizationStatus, TicketStatus } from "@blavoss-cswdi/shared/api";
import { Types } from "mongoose";
import { ArtistService } from "../artist/artist.service";
import { Neo4jService } from "@blavoss-cswdi/backend/data-access";
import * as dotenv from 'dotenv';
import { NotFoundException } from "@nestjs/common";

describe('festivalContoller', () => {
    let app: TestingModule;
    let fController: FestivalController;
    let fService: FestivalService;
    let aService: ArtistService;
    let neo4Service: Neo4jService;

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

    const mockArtists: IArtist[] = [
        {
            name: 'Artist 1',
            genre: Genre.EDM,
            description: 'hello w113',
            image: 'image 1',
            festivals: []
        },
        {
            name: 'Artist 2',
            genre: Genre.Dubstep,
            description: 'hello w113',
            image: 'image 2',
            festivals: []
        }
    ]

    const mockTickets: ITicket[] = [
        {
            _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8'),
            userId: { _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8').toString(), email: 'User 1', hash: '12312', firstName: 'test', lastName: 'test', dob: new Date(), gender: Gender.Male},
            festivalId: mockFestivals[0],
            ticketAmount: 10,
            purchaseDate: new Date(),
            status: TicketStatus.Purchased,
            PersonalizationStatus: PersonalizationStatus.NotPersonalized,
        }
    ]

    beforeAll(async () => {
        dotenv.config();
        app = await Test.createTestingModule({
            controllers: [FestivalController],
            providers: [
                {
                    provide: FestivalService,
                    useValue: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        addArtistToFestival: jest.fn(),
                        removeArtistFromFestival: jest.fn(),
                        addTicketToFestival: jest.fn(),
                    }
                },
                {
                    provide: ArtistService,
                    useValue: {
                        getAll: jest.fn(),
                        getOne: jest.fn(),
                        delete: jest.fn(),
                        create: jest.fn(),
                        update: jest.fn(),
                        addFestivalToArtist: jest.fn(),
                        removeFestivalFromArtist: jest.fn(),
                    }
                },
                {
                    provide: Neo4jService,
                    useValue: {
                        getRecommendedFestivalForUser: jest.fn(),
                    }
                }
            ],
        }).compile();

        fController = app.get<FestivalController>(FestivalController);
        fService = app.get<FestivalService>(FestivalService);
        aService = app.get<ArtistService>(ArtistService);

        // setup neo4j connection
        const neo4jApp = await Test.createTestingModule({
            providers: [Neo4jService],
        }).compile();

        neo4Service = neo4jApp.get<Neo4jService>(Neo4jService);
    });

    describe('getAll', () => {
        it('should call getAll on the service', async () => {
            // arrange
            const getAll = jest.spyOn(fService, 'getAll').mockImplementation(async () => [mockFestivals[0], mockFestivals[1]]);
            // act
            const results = await fController.getAll();

            //assert
            expect(getAll).toHaveBeenCalled();
            expect(results).toHaveLength(2);
            expect(results[0]).toEqual(mockFestivals[0]);
        });
    });

    describe('getOne', () => {
        it('should call getOne on the service', async () => {
            // arrange
            const getOne = jest.spyOn(fService, 'getOne').mockImplementation(async () => mockFestivals[0]);
            
            // act
            const results = await fController.getOne(mockFestivals[0]._id!.toString());
            
            //assert
            expect(getOne).toHaveBeenCalled();
            expect(results).toEqual(mockFestivals[0]);
        });

        it('should return error when user not found', async () => {
            // arrange
            const getOne = jest.spyOn(fService, 'getOne').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(fController.getOne(mockFestivals[0]._id!.toString())).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should call create on the service', async () => {
            // arrange
            const newFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 12),
                endDate: new Date(2024, 9, 15),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            }
            const create = jest.spyOn(fService, 'create').mockImplementation(async () => newFestival);
            
            // act
            const results = await fController.create(newFestival);

            //assert
            expect(create).toHaveBeenCalled();
            expect(results).toEqual(newFestival);
        });

        it('should return error if start date is after end date', async () => {
            // arrange
            const newFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 15),
                endDate: new Date(2024, 9, 12),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            }
            const create = jest.spyOn(fService, 'create').mockImplementation(async () => newFestival);

            // act & assert
            expect(create).toHaveBeenCalled();
        })
    })

    describe('update', () => {
        it('should call update on the service', async () => {
            // arrange
            const festivalToUpdate = mockFestivals[0]._id?.toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 12),
                endDate: new Date(2024, 9, 15),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            }
            const update = jest.spyOn(fService, 'update').mockImplementation(async () => updatedFestival);
        
            // act
            const results = await fController.update(festivalToUpdate!, updatedFestival);
        
            //assert
            expect(update).toHaveBeenCalled();
            expect(results).toEqual(updatedFestival);
        });

        it('should return error if start date is after end date', async () => {
            // arrange
            const festivalToUpdate = mockFestivals[0]._id?.toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 15),
                endDate: new Date(2024, 9, 12),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            }
            const update = jest.spyOn(fService, 'update').mockImplementation(async () => mockFestivals[0]);
        
            // act & assert
            await expect(update).toHaveBeenCalled();
        });

        it('should return error when festival not found', async () => {
            const festivalToUpdate = new Types.ObjectId().toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 15),
                endDate: new Date(2024, 9, 12),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            }
            const update = jest.spyOn(fService, 'update').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(fController.update(festivalToUpdate, updatedFestival)).rejects.toThrow(NotFoundException);
        });
    })

    describe('delete', () => {
        it('should delete existing festival', async () => {
            //arrange
            const festivalToDelete = mockFestivals[0]._id;
            const deleteSpy = jest.spyOn(fService, 'delete').mockImplementation(async () => mockFestivals[0]);
        
            // act
            const result = await fController.delete(festivalToDelete!.toString());

            //assert
            expect(deleteSpy).toHaveBeenCalled();
            expect(result).toEqual(mockFestivals[0]);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const festivalToDelete = new Types.ObjectId().toString();
            const deleteSpy = jest.spyOn(fService, 'delete').mockImplementation(async () => {
                throw new NotFoundException();
            });

            // act & assert
            await expect(fController.delete(festivalToDelete)).rejects.toThrow(NotFoundException);
        })
    })

    describe('addArtistToFestival', () => {
        it('Should add artist to festival', async () => {
            const create = jest.spyOn(fService, 'addArtistToFestival').mockImplementation(async () => {
                mockFestivals[0].artists!.push(mockArtists[0]);
                return mockFestivals[0];
            });

            // act
            const data : any = {festivalId: mockFestivals[0]._id, artistId: mockArtists[0]._id};
            const result = await fController.addArtistToFestival(data);

            //assert
            expect(create).toHaveBeenCalled();
            expect(result.artists).toHaveLength(1);
        })
    });

    describe('getFestivalRecommendations', () => {
        it('Should get recommendations', async () => {
            const getRecommendations = jest.spyOn(neo4Service, 'getRecommendedFestivalForUser').mockImplementation(async () => {
                return mockFestivals;
            });

            // act
            const result = await fController.getFestivalRecommendations("5e9c8d19ed1d9c001783b6f8");

            //assert
            expect(getRecommendations).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    })
})