import { Genre } from "./genre.enum";

export interface IArtist {
    _id: string;
    name: string;
    genre: Genre;
    description: string;
    Festivals: string[];
}

export type ICreateArtist = Pick<IArtist, 'name' | 'genre' | 'description' | 'Festivals'>;

export type IUpdateArtist = Partial<IArtist>;
export type IUpsertArtist = IArtist;