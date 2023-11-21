import { Genre } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FestivalDocument = HydratedDocument<Festival>;

@Schema()
export class Festival {
    @Prop()
    name!: string;

    @Prop()
    location!: string;

    @Prop()
    startDate!: Date;

    @Prop()
    endDate!: Date;

    @Prop()
    description!: string;

    @Prop()
    ticketPrice!: number;

    @Prop()
    image!: string;

    @Prop({ type: String, enum: Object.values(Genre), default: Genre.EDM})
    genre!: Genre;

    @Prop({ type: [Types.ObjectId], ref: 'Artist', default: [] })
    artists!: Types.ObjectId[]; //change to festials once object is created
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);