import { Genre } from "./genre.enum";

export interface IArtist {
    _id?: string;
    name: string;
    image: string;
    genre: Genre;
    description: string;
    festivals?: string[];
}

export type ICreateArtist = Pick<IArtist, 'name' | 'genre' | 'description' | 'image' | 'festivals'>;

export type IUpdateArtist = Partial<IArtist>;
export type IUpsertArtist = IArtist;