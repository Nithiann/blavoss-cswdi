import { Genre } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
    @Prop({required: true})
    name!: string;

    @Prop({ type: String, enum: Object.values(Genre), default: Genre.EDM})
    genre!: Genre;

    @Prop({required: true})
    description!: string;

    @Prop({required: true})
    image!: string;

    @Prop({ type: [Types.ObjectId], ref: 'Festival', default: [] })
    festivals!: Types.ObjectId[]; //change to festials once object is created
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);