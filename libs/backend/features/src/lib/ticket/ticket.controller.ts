/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { GenericAuthGuard } from '../generic-auth.guard';
import { TicketService } from './ticket.service';
import { ITicket } from '@blavoss-cswdi/shared/api';
import { CreateTicketDTO } from '@blavoss-cswdi/backend/dto';
import { UserService } from '../user/user.service';
import { FestivalService } from '../festival/festival.service';

@Controller('ticket')
export class TicketController {

    TAG = 'TicketController';

    constructor(private ticketService: TicketService, private userService: UserService, private festivalService: FestivalService) {}

    @Get('')
    @UseGuards(GenericAuthGuard)
    async getAll(): Promise<ITicket[]> {
        return await this.ticketService.getAll();
    }

    @Get(':id')
    @UseGuards(GenericAuthGuard)
    async getOne(@Param('id') id: string): Promise<ITicket> {
        return await this.ticketService.getOne(id);
    }

    @Put(':id')
    @UseGuards(GenericAuthGuard)
    async update(@Param('id') id: string, @Body() updateTicket: Partial<ITicket>): Promise<ITicket> {
        return await this.ticketService.update(id, updateTicket);
    }

    @Post('')
    @UseGuards(GenericAuthGuard)
    async create(@Body() data: CreateTicketDTO): Promise<ITicket> {
        const ticket = await this.ticketService.create(data);
        await this.userService.addTicketToUser(ticket);
        await this.festivalService.addTicketToFestival(ticket);
        return ticket;
    }

    @Delete(':id')
    @UseGuards(GenericAuthGuard)
    async delete(@Param('id') id: string): Promise<ITicket> {
        return await this.ticketService.delete(id);
    }
}
