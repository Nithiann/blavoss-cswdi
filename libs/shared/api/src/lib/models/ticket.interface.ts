import { Types } from "mongoose";

export interface ITicket {
    _id?: string;
    userId: Types.ObjectId;
    festivalId: Types.ObjectId;
    ticketAmount: number;
    purchaseDate: Date;
    status: TicketStatus;
    personalizationStatus: PersonalizationStatus;
}

export type ICreateTicket = Pick<ITicket, 'userId' | 'festivalId' | 'ticketAmount' | 'purchaseDate' | 'status' | 'personalizationStatus'>;
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