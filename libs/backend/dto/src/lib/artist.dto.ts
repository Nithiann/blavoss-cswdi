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
    image!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;
    
    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsEmpty()
    festivals!: string[];
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
    image!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsNotEmpty()
    festivals!: string[];
}

export class UpdateArtistDTO implements IUpdateArtist {  
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    image!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

}