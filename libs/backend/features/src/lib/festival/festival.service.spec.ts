/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoMemoryServer } from "mongodb-memory-server";
import { FestivalService } from "./festival.service"
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { Artist, ArtistDocument, ArtistSchema, Festival, FestivalDocument, FestivalSchema, Ticket, TicketSchema } from "@blavoss-cswdi/backend/data-access";
import { Gender, Genre, IArtist, IFestival, ITicket, PersonalizationStatus, TicketStatus } from "@blavoss-cswdi/shared/api";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import { ValidationError } from "class-validator";

describe('FestivalService', () => {
    let fService: FestivalService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let festivalModel: Model<FestivalDocument>;
    let artistModel: Model<ArtistDocument>;

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
        let uri: string = '';
        
        const app = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        uri = mongod.getUri();
                        return { uri };
                    }
                }),
                MongooseModule.forFeature([
                    { name: Festival.name, schema: FestivalSchema },
                    { name: Artist.name, schema: ArtistSchema },
                    { name: Ticket.name, schema: TicketSchema }
                ])
            ],
            providers: [FestivalService]
        }).compile();

        fService = app.get<FestivalService>(FestivalService);
        festivalModel = app.get<Model<FestivalDocument>>(getModelToken(Festival.name));
        artistModel = app.get<Model<ArtistDocument>>(getModelToken(Artist.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('festivals').deleteMany({});
        await mongoc.db('test').collection('artists').deleteMany({});

        const festival1 = new festivalModel(mockFestivals[0]);
        const festival2 = new festivalModel(mockFestivals[1]);

        await Promise.all([festival1.save(), festival2.save()]);
    });

    afterAll(async () => {
        await mongoc.close();
        await disconnect();
        await mongod.stop();
    });

    describe('getAll', () => {
        it('should return all festivals', async () => {
            //arrange

            //act
            const results = await fService.getAll();

            //assert
            expect(results).toHaveLength(2);
        });

        it('should return empty artists', async () => {
            //arrange

            //act
            const results = await fService.getAll();

            //assert
            expect(results).toHaveLength(2);
            expect(results[0].artists).toHaveLength(0);
        });
    });

    describe('getOne', () => {
        it('should retrieve one festival', async () => {
            //arrange

            //act
            const result = await fService.getOne(mockFestivals[0]._id!.toString());

            //assert
            Logger.error(result);
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name');
        });

        it('should return error when festival not found', async () => {
            //arrange

            //act & assert
            await expect(fService.getOne(new Types.ObjectId().toString())).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new festival', async () => {
            //arrange
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
            };

            //act
            const result = await fService.create(newFestival);

            //assert
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name', newFestival.name);
            expect(result).toHaveProperty('location', newFestival.location);
            expect(result.tickets).toHaveLength(0);
            expect(result.artists).toHaveLength(0);
        });

        it('should return error if start date is after end date', async () => {
            const newFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 11),
                endDate: new Date(2024, 9, 10),
                description: 'Description 3',
                ticketPrice: 30,
                image: 'image 3',
                genre: Genre.EDM,
                artists: [],
                tickets: []
            };

            //act & assert
            await expect(fService.create(newFestival)).rejects.toThrow(Error);
        });
    });

    describe('update', () => {
        it('should update an existing festival', async () => {
            //arrange
            const festivalToUpdate = mockFestivals[0]._id?.toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                description: 'Description 3',
                ticketPrice: 40,
            };

            // act
            const result = await fService.update(festivalToUpdate!, updatedFestival);

            //assert
            expect(result).toHaveProperty('name', updatedFestival.name);
            expect(result).toHaveProperty('ticketPrice', updatedFestival.ticketPrice);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const festivalToUpdate = new Types.ObjectId().toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                description: 'Description 3',
                ticketPrice: 40,
            };

            //act & assert
            await expect(async () => {
                await fService.update(festivalToUpdate, updatedFestival);
            }).rejects.toThrow(NotFoundException);
        });

        it('should return error if start date is after end date', async () => {
            //arrange
            const festivalToUpdate = mockFestivals[0]._id?.toString();
            const updatedFestival = {
                name: 'Festival 3',
                location: 'Location 3',
                startDate: new Date(2024, 9, 11),
                endDate: new Date(2024, 9, 10),
                description: 'Description 3',
                ticketPrice: 40,
            };

            //act & assert
            await expect(async () => {
                await fService.update(festivalToUpdate!, updatedFestival);
            }).rejects.toThrow(Error);
        })
    })

    describe('delete', () => {
        it('should delete an existing festival', async () => {
            //arrange
            const festivalToDelete = mockFestivals[0]._id?.toString();
        
            //act
            const result = await fService.delete(festivalToDelete!);

            //assert
            expect(result).toHaveProperty('name', mockFestivals[0].name);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const festivalToDelete = new Types.ObjectId().toString();

            //act & assert
            await expect(async () => {
                await fService.delete(festivalToDelete);
            }).rejects.toThrow(NotFoundException)
        });
    });

    describe('addArtistToFestival', () => {
        it('Should add artist to festival', async () => {
            //arrange
            const festivalId = mockFestivals[0]._id?.toString();
            const artistId = mockArtists[0]._id?.toString();

            //act
            const result = await fService.addArtistToFestival(festivalId!, artistId!);

            //assert
            expect(result.artists).toHaveLength(1);
        });
    });

    describe('removeArtistFromFestival', () => {
        it('Should remove artist from festival', async () => {
            //arrange
            const festivalId = mockFestivals[0]._id?.toString();
            const artistId = mockArtists[0]._id?.toString();
        
            //act
            const result = await fService.removeArtistFromFestival(festivalId!, artistId!);

            //assert
            expect(result.artists).toHaveLength(0);
        });
    });

    describe('addTicketToFestival', () => {
        it('Should add ticket to festival', async () => {
            //arrange
            const festivalId = mockFestivals[0]._id?.toString();
            const ticketId = mockTickets[0]._id?.toString();
        
            //act
            const result = await fService.addTicketToFestival(mockTickets[0]);

            //assert
            expect(result.tickets).toHaveLength(1);
        });
    })
})