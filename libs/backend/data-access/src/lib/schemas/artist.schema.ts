import { Genre } from '@blavoss-cswdi/shared/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema()
export class Artist {
    @Prop()
    name!: string;

    @Prop()
    genre!: Genre;

    @Prop()
    description!: string;

    @Prop({ type: [Types.ObjectId], ref: 'Festival', default: [] })
    Festivals!: string[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);