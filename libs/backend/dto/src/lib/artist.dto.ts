import {
    IsNotEmpty,
    IsString,
    IsEmpty
} from 'class-validator';
import {
    ICreateArtist,
    IUpdateArtist,
    IUpsertArtist,
    Genre,
} from '@blavoss-cswdi/shared/api'

export class CreateArtistDTO implements ICreateArtist {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsEmpty()
    Festivals!: string[];
}

export class UpsertArtistDTO implements IUpsertArtist {
    @IsString()
    @IsNotEmpty()
    _id!: string;
    
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsNotEmpty()
    Festivals!: string[];
}

export class UpdateArtistDTO implements IUpdateArtist {  
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

}