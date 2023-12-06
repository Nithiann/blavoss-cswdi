import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsNumber,
} from 'class-validator';
import { ICreateTicket, IUpdateTicket, IUpsertTicket, TicketStatus, PersonalizationStatus, IUser, IFestival } from '@blavoss-cswdi/shared/api';
import { Types } from 'mongoose';


export class CreateTicketDTO implements ICreateTicket{
    @IsString()
    @IsNotEmpty()
    userId!: IUser;

    @IsString()
    @IsNotEmpty()
    festivalId!: IFestival;

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
    PersonalizationStatus!: PersonalizationStatus;
}

export class UpsertTicketDTO implements IUpsertTicket{
    @IsString()
    @IsNotEmpty()
    _id!: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    userId!: IUser;

    @IsString()
    @IsNotEmpty()
    festivalId!: IFestival;

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
    PersonalizationStatus!: PersonalizationStatus;
}

export class UpdateTicketDTO implements IUpdateTicket{
    @IsString()
    @IsNotEmpty()
    _id!: Types.ObjectId;

    @IsString()
    @IsNotEmpty()
    userId!: IUser;

    @IsString()
    @IsNotEmpty()
    festivalId!: IFestival;

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
    PersonalizationStatus!: PersonalizationStatus;
}