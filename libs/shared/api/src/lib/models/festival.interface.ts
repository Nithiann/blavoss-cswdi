import { IArtist } from './artist.interface';
import { Genre } from './genre.enum';

export interface IFestival {
    _id?: string;
    name: string;
    location: string;
    startDate: Date;
    endDate: Date;
    description: string;
    ticketPrice: number;
    image: string;
    genre: Genre;
    artists?: IArtist[];
}

export type ICreateFestival = Pick<IFestival, 'name' | 'location' | 'startDate' | 'endDate' | 'description' | 'ticketPrice' | 'image' | 'genre'>;
export type IUpdateFestival = Partial<IFestival>;
export type IUpsertFestivl = IFestival;