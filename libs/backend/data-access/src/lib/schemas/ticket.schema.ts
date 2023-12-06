import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, model } from "mongoose";
import { PersonalizationStatus, TicketStatus } from '@blavoss-cswdi/shared/api';

export type TicketDocument = HydratedDocument<Ticket>;

@Schema()
export class Ticket {
    
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Festival', required: true})
    festivalId!: Types.ObjectId;

    @Prop({ required: true })
    ticketAmount!: number;

    @Prop({ required: true, default: Date.now() })
    purchaseDate!: Date;

    @Prop({ type: String, enum: Object.values(TicketStatus), default: TicketStatus.Purchased })
    status!: TicketStatus;

    @Prop({ type: String, enum: Object.values(PersonalizationStatus), default: PersonalizationStatus.NotPersonalized })
    PersonalizationStatus!: PersonalizationStatus;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket).set('toObject', { getters: true, virtuals: true });
export const TicketModel = model('Ticket', TicketSchema);