import { TicketDocument } from '@blavoss-cswdi/backend/data-access';
import { ITicket } from '@blavoss-cswdi/shared/api';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class TicketService {

    constructor(@InjectModel('Ticket') private readonly ticketModel: Model<TicketDocument>) {}

    TAG = 'Backend TicketService';
    
    private tickets$ = new BehaviorSubject<ITicket[]>([]);

    async getAll(): Promise<ITicket[]> {
        Logger.log('getAll', this.TAG);

        const tickets = await this.ticketModel.find().exec();

        return tickets.map(ticket => ticket.toObject());
    }

    async getOne(id: string): Promise<ITicket> {
        Logger.log(`getOne(${id})`, this.TAG);
        try {
            const ticket = await this.ticketModel.findById(id).exec();

            if (!ticket) {
                throw new NotFoundException('Ticket could not be found');
            }

            return ticket.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }

    }

    async delete(id: string): Promise<ITicket> {
        Logger.log(`delete(${id})`, this.TAG);
        try {
            const ticket = await this.ticketModel.findByIdAndDelete(id).exec();
            if (!ticket){
                throw new NotFoundException('Ticket could not be found');
            }
            
            return ticket.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }

    async create(ticket: Pick<ITicket, 'userId' | 'festivalId' | 'ticketAmount'>): Promise<ITicket> {
        Logger.log(`create(${JSON.stringify(ticket)})`, this.TAG);

        const newTicket = new this.ticketModel({...ticket});

        const result = await newTicket.save();

        return result.toObject();
    }

    async update(id: string, ticket: Partial<ITicket>): Promise<ITicket> {
        Logger.log(`update(${id}, ${JSON.stringify(ticket)})`, this.TAG);

        try {
            const updateTicket = await this.ticketModel.findByIdAndUpdate(id, ticket, { new: true, runValidators: true }).exec();
            if (!updateTicket) {
                throw new NotFoundException('Ticket could not be found');
            }
            return updateTicket.toObject();
        } catch (err) {
            throw new NotFoundException(err);
        }
    }
}
