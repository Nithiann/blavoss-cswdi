import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { Gender, Genre, ITicket, PersonalizationStatus, TicketStatus } from '@blavoss-cswdi/shared/api';
import { Types } from 'mongoose';
import { UserService } from '../user/user.service';
import { FestivalService } from '../festival/festival.service';
import { NotFoundException } from '@nestjs/common';
import { CreateTicketDTO } from '@blavoss-cswdi/backend/dto';

describe('TicketController', () => {
  let app: TestingModule;
  let tController: TicketController;
  let tService: TicketService;
  let uService: UserService;
  let fService: FestivalService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: UserService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            addTicketToUser: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: FestivalService,
          useValue: {
            getAll: jest.fn(),
            getOne: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
            addTicketToFestival: jest.fn(),
            update: jest.fn(),
          }
        }
      ],
    }).compile();

    tController = app.get<TicketController>(TicketController);
    tService = app.get<TicketService>(TicketService);
    uService = app.get<UserService>(UserService);
    fService = app.get<FestivalService>(FestivalService);
  })

  describe('GetAll', () => {
    it('should call getAll on the service', async () => {
      // arrange
      const mockTicket: ITicket = {
        _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8'),
        festivalId: { _id: '123123123', name: 'test'},
        userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male},
        ticketAmount: 2,
        purchaseDate: new Date(),
        status: TicketStatus.Purchased,
        PersonalizationStatus: PersonalizationStatus.NotPersonalized,
      };

      //act
      const getAll = jest.spyOn(tService, 'getAll').mockImplementation(async () => [mockTicket]);
      const results = await tController.getAll();

      // assert
      expect(getAll).toHaveBeenCalled();
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(mockTicket);
    })
  })

  describe('GetOne', () => {
    it('should call getOne on the service', async () => {
      // arrange
      const mockTicket: ITicket = {
        _id: new Types.ObjectId('5e9c8d19ed1d9c001783b6f8'),
        festivalId: { _id: '123123123', name: 'test'},
        userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male},
        ticketAmount: 2,
        purchaseDate: new Date(),
        status: TicketStatus.Purchased,
        PersonalizationStatus: PersonalizationStatus.NotPersonalized,
      };

      //act
      const getOne = jest.spyOn(tService, 'getOne').mockImplementation(async () => mockTicket);
      const result = await tController.getOne('5e9c8d19ed1d9c001783b6f8');

      // assert
      expect(getOne).toHaveBeenCalled();
      expect(result).toEqual(mockTicket);
    })

    it('Should throw NotFoundException when getting non-existing ticket', async () => {
      // arrange
      const ticketId = new Types.ObjectId('5e9c8d19ed1d9c001734b6f8').toString();

      // act
      const getOne = jest.spyOn(tService, 'getOne').mockImplementation(async () => {
        throw new NotFoundException();
      });

      //assert
      await expect(tController.getOne(ticketId)).rejects.toThrow(NotFoundException);
      expect(getOne).toHaveBeenCalled();
    })
  })

  describe('Create', () => {
    it('should call create on the service and related methods', async () => {
      // arrange
      const createData: CreateTicketDTO = {
        userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male },
        festivalId: { _id: '123123123', name: 'test', location: 'test', startDate: new Date(), endDate: new Date(), description: 'test', image: 'test', genre: Genre.Dubstep, ticketPrice: 5 },
        ticketAmount: 2,
        purchaseDate: new Date(),
        status: TicketStatus.Purchased,
        PersonalizationStatus: PersonalizationStatus.NotPersonalized,
      };
      const mockTicket: ITicket = {
        _id: new Types.ObjectId(),
        ...createData,
      };
  
      // act
      const create = jest.spyOn(tService, 'create').mockImplementation(async () => mockTicket);
      const addTicketToUser = jest.spyOn(uService, 'addTicketToUser').mockImplementation();
      const addTicketToFestival = jest.spyOn(fService, 'addTicketToFestival').mockImplementation();
      const result = await tController.create(createData);
  
      // assert
      expect(create).toHaveBeenCalledWith(createData);
      expect(addTicketToUser).toHaveBeenCalledWith(mockTicket);
      expect(addTicketToFestival).toHaveBeenCalledWith(mockTicket);
      expect(result).toEqual(mockTicket);
    });
  });

  describe('Update', () => {
    it('should call update on the service', async () => {
      // arrange
      const ticketId = new Types.ObjectId('5e9c8d19ed1d9c001783b6f8');
      const updateData = { 
        ticketAmount: 3, 
        userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male },
        festivalId: { _id: '123123123', name: 'test', location: 'test', startDate: new Date(), endDate: new Date(), description: 'test', image: 'test', genre: Genre.Dubstep, ticketPrice: 5 },
        purchaseDate: new Date(),
        status: TicketStatus.Purchased,
        PersonalizationStatus: PersonalizationStatus.NotPersonalized, 
      };
  
      // act
      const update = jest.spyOn(tService, 'update').mockImplementation(async () => ({
        _id: ticketId,
        ...updateData,
      }));
      const result = await tController.update(ticketId.toString(), updateData);
  
      // assert
      expect(update).toHaveBeenCalledWith(ticketId.toString(), updateData);
      expect(result).toEqual({ _id: ticketId, ...updateData });
    });
  
    it('should throw NotFoundException when updating a non-existing ticket', async () => {
      // arrange
      const nonExistingTicketId = 'nonExistingTicketId';
      const updateData = { ticketAmount: 3 };
  
      // act
      const update = jest.spyOn(tService, 'update').mockImplementation(async () => {
        throw new NotFoundException();
      });
  
      // assert
      await expect(tController.update(nonExistingTicketId, updateData)).rejects.toThrow(NotFoundException);
      expect(update).toHaveBeenCalledWith(nonExistingTicketId, updateData);
    });
  });

  describe('Delete', () => {
    it('should call delete on the service', async () => {
      // arrange
      const ticketId = new Types.ObjectId('5e9c8d19ed1d9c001783b6f8');
      const mockTicket = {
        _id: ticketId,
        userId: { _id: '123123123', firstName: 'test', lastName: 'test', email: 'test', hash: 'test', dob: new Date(), gender: Gender.Male },
        festivalId: { _id: '123123123', name: 'test', location: 'test', startDate: new Date(), endDate: new Date(), description: 'test', image: 'test', genre: Genre.Dubstep, ticketPrice: 5 },
        ticketAmount: 2,
        purchaseDate: new Date(),
        status: TicketStatus.Purchased,
        PersonalizationStatus: PersonalizationStatus.NotPersonalized, 
      };
  
      // act
      const deleteTicket = jest.spyOn(tService, 'delete').mockImplementation(async () => mockTicket);
      const result = await tController.delete(ticketId.toString());
  
      // assert
      expect(deleteTicket).toHaveBeenCalledWith(ticketId.toString());
      expect(result).toEqual(mockTicket);
    });
  
    it('should throw NotFoundException when deleting a non-existing ticket', async () => {
      // arrange
      const nonExistingTicketId = 'nonExistingTicketId';
  
      // act
      const deleteTicket = jest.spyOn(tService, 'delete').mockImplementation(async () => {
        throw new NotFoundException();
      });
  
      // assert
      await expect(tController.delete(nonExistingTicketId)).rejects.toThrow(NotFoundException);
      expect(deleteTicket).toHaveBeenCalledWith(nonExistingTicketId);
    });
  });
});
