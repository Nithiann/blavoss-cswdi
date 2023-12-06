import { Test } from '@nestjs/testing'; 
import { Model, disconnect } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { Ticket, TicketDocument, TicketSchema } from './ticket.schema';
import { PersonalizationStatus, TicketStatus } from '@blavoss-cswdi/shared/api';

describe('Ticket schema', () => { 
    let mongod: MongoMemoryServer;
    let ticketModel: Model<TicketDocument>;

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
                MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }]),
            ],
        }).compile();

        ticketModel = app.get<Model<TicketDocument>>(getModelToken(Ticket.name));
        await ticketModel.ensureIndexes();
    });

    afterAll(async () => {
        await disconnect();
        await mongod.stop();
    });

    it('has a required userId', () => {
        const model = new ticketModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['userId']).toBeInstanceOf(Error);
      });
    
      it('has a required festivalId', () => {
        const model = new ticketModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['festivalId']).toBeInstanceOf(Error);
      });
    
      it('has a required ticketAmount', () => {
        const model = new ticketModel();
    
        const err = model.validateSync();
    
        expect(err!.errors['ticketAmount']).toBeInstanceOf(Error);
      });
    
      it('has a default purchaseDate', () => {
        const model = new ticketModel();
    
        expect(model.purchaseDate).toBeDefined();
      });
    
      it('has a default status', () => {
        const model = new ticketModel();
    
        expect(model.status).toBe(TicketStatus.Purchased);
      });
    
      it('has a default PersonalizationStatus', () => {
        const model = new ticketModel();
    
        expect(model.PersonalizationStatus).toBe(PersonalizationStatus.NotPersonalized);
      });
    
})