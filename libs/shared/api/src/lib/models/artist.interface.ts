export enum Genre {
    Metal = 'metal',
    Pop = 'pop',
    Rock = 'rock',
    EDM = 'edm',
    Techno = 'techno',
    House = 'house',
    Dubstep = 'dubstep',
    Electro = 'electro',
    ElectroHouse = 'electro-house',
    ElectroFolk = 'electro-folk',
    ElectroPop = 'electro-pop',
    ElectroRock = 'electro-rock',
    Trap = 'trap',
    Reggaeton = 'reggaeton',
    Jazz = 'jazz',
    Hardstyle = 'hardstyle',
    Hardcore = 'hardcore',
    Rawstyle = 'rawstyle',
    Uptempo = 'uptempo',
}

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