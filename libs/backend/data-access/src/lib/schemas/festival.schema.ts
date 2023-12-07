/* eslint-disable @typescript-eslint/no-unused-vars */
import { Genre } from '@blavoss-cswdi/shared/api';
import { Logger } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FestivalDocument = HydratedDocument<Festival>;

@Schema()
export class Festival {
    @Prop({required: true})
    name!: string;

    @Prop({required: true})
    location!: string;

    @Prop({required: true, validate: {validator: startDateBeforeEndDate, message: 'End date must be after start date'}})
    startDate!: Date;

    @Prop({required: true})
    endDate!: Date;

    @Prop({required: true})
    description!: string;

    @Prop({required: true})
    ticketPrice!: number;

    @Prop({required: true})
    image!: string;

    @Prop({ type: String, enum: Object.values(Genre), default: Genre.EDM})
    genre!: Genre;

    @Prop({ type: [Types.ObjectId], ref: 'Artist', default: [] })
    artists!: Types.ObjectId[]; //change to festials once object is created

    @Prop({ type: [Types.ObjectId], ref: 'Ticket', default: [] })
    tickets!: Types.ObjectId[];
}

function startDateBeforeEndDate(this: Festival, endDate: Date): boolean {
    return this.startDate < this.endDate;
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);