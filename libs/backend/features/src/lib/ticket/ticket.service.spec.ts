/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model, Types, disconnect } from 'mongoose';
import { Gender, ITicket, PersonalizationStatus, TicketStatus } from '@blavoss-cswdi/shared/api';
import { Festival, FestivalDocument, FestivalSchema, Ticket, TicketDocument, TicketSchema } from '@blavoss-cswdi/backend/data-access';
import { MongoClient } from 'mongodb';
import { FestivalService } from '../festival/festival.service';
import { NotFoundException } from '@nestjs/common';

describe('TicketService', () => {
  let tService: TicketService;
  let mongod: MongoMemoryServer;
  let mongoc: MongoClient;
  let ticketModel: Model<TicketDocument>;

  const mockTickets: ITicket[] = [{
    _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8'),
    festivalId: { _id: '123123123', name: 'test'},
    userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male},
    ticketAmount: 2,
    purchaseDate: new Date(),
    status: TicketStatus.Purchased,
    PersonalizationStatus: PersonalizationStatus.NotPersonalized,
  },
  {
    _id: new Types.ObjectId('5e9c8d19ed1d9c001783b8f2'),
    festivalId: { _id: '123123123', name: 'test'},
    userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male},
    ticketAmount: 5,
    purchaseDate: new Date(),
    status: TicketStatus.Purchased,
    PersonalizationStatus: PersonalizationStatus.NotPersonalized,
  }];

  beforeAll(async () => {
    let uri: string = '';

    const app = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            return { uri };
          },
        }),
        MongooseModule.forFeature([{ name: Ticket.name, schema: TicketSchema }, { name: Festival.name, schema: FestivalSchema }]),
      ],
      providers: [TicketService, FestivalService],
    }).compile();

    tService = app.get<TicketService>(TicketService);
    ticketModel = app.get<Model<TicketDocument>>(getModelToken('Ticket'));

    mongoc = new MongoClient(uri);
    await mongoc.connect();
  });

  beforeEach(async () => {
    await mongoc.db('test').collection('tickets').deleteMany({});

    const ticket1 = new ticketModel(mockTickets[0]);
    const ticket2 = new ticketModel(mockTickets[1]);

    await Promise.all([ticket1.save(), ticket2.save()]);
  });

  afterAll(async () => {
    await mongoc.close();
    await disconnect();
    await mongod.stop();
  });

  it('should be defined', () => {
    expect(tService).toBeDefined();
  });

  it('Should retrieve all tickets', async () => {
    // arrange

    //act
    const results = await tService.getAll();

    //assert
    expect(results).toHaveLength(2);
    expect(results.map(r => r.ticketAmount)).toContain(2);
    expect(results.map(r => r.PersonalizationStatus)).toContain(PersonalizationStatus.NotPersonalized);
  });

  it('Should retrieve user in ticket', async () => {
    // arrange

    //act
    const results = await tService.getAll();

    //assert
    expect(results[0]).toHaveProperty('userId.firstName');
    expect(results[1]).toHaveProperty('userId.firstName');
  });

  it('Should retrieve one ticket', async () => {
    // arrange

    //act
    const results = await tService.getOne(mockTickets[0]._id!.toString());

    //assert
    expect(results).toHaveProperty('ticketAmount');
    expect(results).toHaveProperty('userId.firstName');
    expect(results).toHaveProperty('festivalId.name');
  });

  it('Should retrieve no ticket', async () => {
    // arrange

    //act & assert
    await expect(async () => {
      await tService.getOne(new Types.ObjectId('5e9c8d19ed1d9c001783b5f2').toString());
    }).rejects.toThrow(NotFoundException);
  });

  it('should delete existing ticket', async () => {
    //arrange
    const ticketToDelete = mockTickets[0]._id!.toString();

    // act
    const result = await tService.delete(ticketToDelete);

    // assert
    expect(result).toHaveProperty('ticketAmount');
    expect(result).toHaveProperty('userId.firstName');
  });

  it('Should throw NotFoundException when deleting non-existing ticket', async () => {
    // arrange
    const ticketToDelete = new Types.ObjectId().toString();

    // act & assert
    await expect(async () => {
      await tService.delete(ticketToDelete);
    }).rejects.toThrow(NotFoundException);
  });

  it('Should create new ticket', async () => {
    // arrange
    const newTicket: ITicket = {
      _id: new Types.ObjectId(),
      festivalId: { _id: '123123123', name: 'test'},
      userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male},
      ticketAmount: 5,
      purchaseDate: new Date(),
      status: TicketStatus.Purchased,
      PersonalizationStatus: PersonalizationStatus.NotPersonalized,
    };

    // act
    const createdTicket = await tService.create(newTicket);

    // assert
    expect(createdTicket).toHaveProperty('ticketAmount', newTicket.ticketAmount);
    expect(createdTicket.userId).toEqual(expect.objectContaining(newTicket.userId));
    expect(createdTicket.festivalId).toEqual(expect.objectContaining(newTicket.festivalId));
  });

  it('Should update an existing ticket', async () => {
    // arrange
    const ticketToUpdateId = mockTickets[0]._id!.toString();
    const updateData = { ticketAmount: 3 };

    // act
    const updatedTicket = await tService.update(ticketToUpdateId, updateData);

    // assert
    expect(updatedTicket).toHaveProperty('ticketAmount', updateData.ticketAmount);
    // Ensure other properties are not affected by the update, adjust as needed
    expect(updatedTicket.userId).toEqual(expect.objectContaining(mockTickets[0].userId));
    expect(updatedTicket.festivalId).toEqual(expect.objectContaining(mockTickets[0].festivalId));
  });

  it('Should throw NotFoundException when updating a non-existing ticket', async () => {
    // arrange
    const nonExistingTicketId = new Types.ObjectId().toString();
    const updateData = { ticketAmount: 3 };

    // act & assert
    await expect(async () => {
      await tService.update(nonExistingTicketId, updateData);
    }).rejects.toThrow(NotFoundException);
  });
});
