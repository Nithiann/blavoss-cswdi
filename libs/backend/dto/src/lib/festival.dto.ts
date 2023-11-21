import {
    IsNotEmpty,
    IsString,
    IsDate,
    IsNumber,
    IsEmpty
} from 'class-validator';
import {
    ICreateFestival,
    IUpdateFestival,
    IUpsertFestival,
    Genre,
    IArtist
} from '@blavoss-cswdi/shared/api';

export class CreateFestivalDTO implements ICreateFestival {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsDate()
    @IsNotEmpty()
    startDate!: Date;

    @IsDate()
    @IsNotEmpty()
    endDate!: Date;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    ticketPrice!: number;

    @IsString()
    @IsNotEmpty()
    image!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsEmpty()
    artists!: IArtist[];
}

export class UpsertFestivalDTO implements IUpsertFestival {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsDate()
    @IsNotEmpty()
    startDate!: Date;

    @IsDate()
    @IsNotEmpty()
    endDate!: Date;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    ticketPrice!: number;

    @IsString()
    @IsNotEmpty()
    image!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;

    @IsString({each: true})
    @IsEmpty()
    artists!: IArtist[];
}

export class UpdateFestivalDTO implements IUpdateFestival {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    location!: string;

    @IsDate()
    @IsNotEmpty()
    startDate!: Date;

    @IsDate()
    @IsNotEmpty()
    endDate!: Date;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    ticketPrice!: number;

    @IsString()
    @IsNotEmpty()
    image!: string;

    @IsString()
    @IsNotEmpty()
    genre!: Genre;
}
