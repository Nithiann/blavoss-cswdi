import { Test } from '@nestjs/testing'; 
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Artist, ArtistDocument, ArtistSchema } from './artist.schema';

describe('Festival schema', () => { 
    let mongod: MongoMemoryServer;
    let artistModel: Model<ArtistDocument>;

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        mongod = await MongoMemoryServer.create();
                        const uri = mongod.getUri();
                        return { uri };
                    },
                }),
                MongooseModule.forFeature([{ name: Artist.name, schema: ArtistSchema }]),
            ],
        }).compile();

        artistModel = app.get<Model<ArtistDocument>>(getModelToken(Artist.name));
        await artistModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    it('has a required name', () => {
        const model = new artistModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['name']).toBeInstanceOf(Error);
      });
    
      it('has a required description', () => {
        const model = new artistModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['description']).toBeInstanceOf(Error);
      });
    
      it('has a required image', () => {
        const model = new artistModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['image']).toBeInstanceOf(Error);
      });
    
      it('has a default genre', () => {
        const model = new artistModel();
    
        expect(model.genre).toBeDefined();
      });

    
})