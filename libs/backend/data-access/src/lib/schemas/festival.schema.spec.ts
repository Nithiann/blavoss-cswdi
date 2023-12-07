import { Test } from '@nestjs/testing'; 
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Festival, FestivalDocument, FestivalSchema } from './festival.schema';

describe('Festival schema', () => { 
    let mongod: MongoMemoryServer;
    let festivalModel: Model<FestivalDocument>;

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
                MongooseModule.forFeature([{ name: Festival.name, schema: FestivalSchema }]),
            ],
        }).compile();

        festivalModel = app.get<Model<FestivalDocument>>(getModelToken(Festival.name));
        await festivalModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    it('has a required name', () => {
        const model = new festivalModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['name']).toBeInstanceOf(Error);
      });
    
      it('has a required description', () => {
        const model = new festivalModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['description']).toBeInstanceOf(Error);
      });
    
      it('has a required ticketPrice', () => {
        const model = new festivalModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['ticketPrice']).toBeInstanceOf(Error);
      });
    
      it('has a default genre', () => {
        const model = new festivalModel();
    
        expect(model.genre).toBeDefined();
      });

    
})