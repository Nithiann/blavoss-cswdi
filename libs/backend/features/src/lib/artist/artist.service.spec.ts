/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoMemoryServer } from "mongodb-memory-server";
import { ArtistService } from "./artist.service"
import { MongoClient } from "mongodb";
import { Model, Types, disconnect } from "mongoose";
import { Artist, ArtistDocument, ArtistSchema, Festival, FestivalSchema } from "@blavoss-cswdi/backend/data-access";
import {  Genre, IArtist, IFestival } from "@blavoss-cswdi/shared/api";
import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Logger, NotFoundException } from "@nestjs/common";
import { ValidationError } from "class-validator";

describe('ArtistService', () => {
    let aService: ArtistService;
    let mongod: MongoMemoryServer;
    let mongoc: MongoClient;
    let artistModel: Model<ArtistDocument>;

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
                ])
            ],
            providers: [ArtistService]
        }).compile();

        aService = app.get<ArtistService>(ArtistService);
        artistModel = app.get<Model<ArtistDocument>>(getModelToken(Artist.name));

        mongoc = new MongoClient(uri);
        await mongoc.connect();
    });

    beforeEach(async () => {
        await mongoc.db('test').collection('artists').deleteMany({});

        const artist1 = new artistModel(mockArtists[0]);
        const artist2 = new artistModel(mockArtists[1]);

        await Promise.all([artist1.save(), artist2.save()]);
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
            const results = await aService.getAll();

            //assert
            expect(results).toHaveLength(2);
        });

        it('should return empty artists', async () => {
            //arrange

            //act
            const results = await aService.getAll();

            //assert
            expect(results).toHaveLength(2);
            expect(results[0].festivals).toHaveLength(0);
        });
    });

    describe('getOne', () => {
        it('should retrieve one festival', async () => {
            //arrange

            //act
            const result = await aService.getOne(mockArtists[0]._id!);

            //assert
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name');
        });

        it('should return error when festival not found', async () => {
            //arrange

            //act & assert
            await expect(aService.getOne(new Types.ObjectId().toString())).rejects.toThrow(NotFoundException);
        });
    });

    describe('create', () => {
        it('should create a new festival', async () => {
            //arrange
            const newArtist = {
                name: 'Artist 3',
                genre: Genre.EDM,
                description: 'Description 3',
                image: 'image 3',
                festivals: []
            };

            //act
            const result = await aService.create(newArtist);

            //assert
            expect(result).toHaveProperty('_id');
            expect(result).toHaveProperty('name', newArtist.name);
            expect(result).toHaveProperty('description', newArtist.description);
            expect(result.festivals).toHaveLength(0);
        });

        it('name is required', async () => {
            const newArtist = {
                name: '',
                genre: Genre.EDM,
                description: 'Description 3',
                image: 'image 3',
                festivals: []
            };

            //act & assert
            await expect(aService.create(newArtist)).rejects.toThrow(Error);
        });
    });

    describe('update', () => {
        it('should update an existing festival', async () => {
            //arrange
            const artistToUpdate = mockArtists[0]._id?.toString();
            const updatedArtist = {
                name: 'johnny',
                description: 'Location 3',
                genre: Genre.EDM
            };

            // act
            const result = await aService.update(artistToUpdate!, updatedArtist);

            //assert
            expect(result).toHaveProperty('name', updatedArtist.name);
            expect(result).toHaveProperty('description', updatedArtist.description);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const artistToUpdate = new Types.ObjectId().toString();
            const updatedArtist = {
                name: 'johnny',
                description: 'Location 3',
                genre: Genre.EDM
            };

            //act & assert
            await expect(async () => {
                await aService.update(artistToUpdate!, updatedArtist);
            }).rejects.toThrow(NotFoundException);
        });

        it('should return error if name is empty', async () => {
            //arrange
            const artistToUpdate = mockArtists[0]._id?.toString();
            const updatedArtist = {
                name: '',
                description: 'Location 3',
                genre: Genre.EDM
            };

            //act & assert
            await expect(async () => {
                await aService.update(artistToUpdate!, updatedArtist);
            }).rejects.toThrow(Error);
        })
    });

    describe('delete', () => {
        it('should delete an existing artist', async () => {
            //arrange
            const artistToDelete = mockArtists[0]._id?.toString();
        
            //act
            const result = await aService.delete(artistToDelete!);

            //assert
            expect(result).toHaveProperty('name', mockArtists[0].name);
        });

        it('should return error when festival not found', async () => {
            //arrange
            const artistToDelete = new Types.ObjectId().toString();

            //act & assert
            await expect(async () => {
                await aService.delete(artistToDelete);
            }).rejects.toThrow(NotFoundException)
        });
    });

    describe('addArtistToFestival', () => {
        it('Should add artist to festival', async () => {
            //arrange
            const festivalId = mockFestivals[0]._id?.toString();
            const artistId = mockArtists[0]._id?.toString();

            //act
            const result = await aService.addFestivalToArtist(artistId!, festivalId!);

            //assert
            expect(result.festivals).toHaveLength(1);
        });
    });

    describe('removeArtistFromFestival', () => {
        it('Should remove artist from festival', async () => {
            //arrange
            const festivalId = mockFestivals[0]._id?.toString();
            const artistId = mockArtists[0]._id?.toString();
        
            //act
            const result = await aService.removeFestivalFromArtist(artistId!, festivalId!);

            //assert
            expect(result.festivals).toHaveLength(0);
        });
    });
});