import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsNumber,
} from 'class-validator';
import { ICreateTicket, IUpdateTicket, IUpsertTicket, TicketStatus, PersonalizationStatus } from '@blavoss-cswdi/shared/api';
import { Types } from 'mongoose';

export class CreateTicketDTO implements ICreateTicket{
    @IsString()
    @IsNotEmpty()
    userId!: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    festivalId!: Types.ObjectId;

    @IsNumber()
    @IsNotEmpty()
    ticketAmount!: number;

    @IsDate()
    @IsNotEmpty()
    purchaseDate!: Date;

    @IsString()
    @IsNotEmpty()
    status!: TicketStatus;

    @IsString()
    @IsNotEmpty()
    personalizationStatus!: PersonalizationStatus;
}

export class UpsertTicketDTO implements IUpsertTicket{
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    userId!: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    festivalId!: Types.ObjectId;

    @IsNumber()
    @IsNotEmpty()
    ticketAmount!: number;

    @IsDate()
    @IsNotEmpty()
    purchaseDate!: Date;

    @IsString()
    @IsNotEmpty()
    status!: TicketStatus;

    @IsString()
    @IsNotEmpty()
    personalizationStatus!: PersonalizationStatus;
}

export class UpdateTicketDTO implements IUpdateTicket{
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    userId!: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    festivalId!: Types.ObjectId;

    @IsNumber()
    @IsNotEmpty()
    ticketAmount!: number;

    @IsDate()
    @IsNotEmpty()
    purchaseDate!: Date;

    @IsString()
    @IsNotEmpty()
    status!: TicketStatus;

    @IsString()
    @IsNotEmpty()
    personalizationStatus!: PersonalizationStatus;
}