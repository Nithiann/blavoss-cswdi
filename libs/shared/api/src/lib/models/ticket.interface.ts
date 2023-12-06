import { Types } from "mongoose";
import { IFestival } from "./festival.interface";
import { IUser } from "./user.interface";

export interface ITicket {
    _id?: Types.ObjectId;
    userId: IUser;
    festivalId: Partial<IFestival>;
    ticketAmount: number;
    purchaseDate: Date;
    status: TicketStatus;
    PersonalizationStatus: PersonalizationStatus;
}

export type ICreateTicket = Pick<ITicket, 'userId' | 'festivalId' | 'ticketAmount' | 'purchaseDate' | 'status' | 'PersonalizationStatus'>;
export type IUpdateTicket = Partial<ITicket>;
export type IUpsertTicket = ITicket;

export enum TicketStatus {
    Purchased = 'purchased',
    Refunded = 'refunded',
}

export enum PersonalizationStatus {
    Personalized = 'personalized',
    NotPersonalized = 'not-personalized',
}