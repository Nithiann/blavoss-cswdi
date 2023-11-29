import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEmail,
    IsDate,
    IsEmpty
} from 'class-validator';
import {
    ICreateUser,
    IUpdateUser,
    IUpsertUser,
    Gender,
    ITicket,
} from '@blavoss-cswdi/shared/api'

export class CreateUserDTO implements ICreateUser {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    hash!: string;

    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsDate()
    @IsNotEmpty()
    dob!: Date;

    @IsString()
    @IsNotEmpty()
    gender!: Gender;
}

export class UpsertUserDTO implements IUpsertUser {
    @IsString()
    @IsNotEmpty()
    _id!: string;

    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    hash!: string;

    @IsString()
    @IsNotEmpty()
    firstName!: string;

    @IsString()
    @IsNotEmpty()
    lastName!: string;

    @IsDate()
    @IsNotEmpty()
    dob!: Date;

    @IsString()
    @IsNotEmpty()
    gender!: Gender;

    @IsString({each: true})
    @IsEmpty()
    tickets!: ITicket[]
}

export class UpdateUserDTO implements IUpdateUser {
    @IsString()
    @IsOptional()
    email!: string;

    @IsString()
    @IsOptional()
    firstName!: string;

    @IsString()
    @IsOptional()
    lastName!: string;

    @IsString()
    @IsOptional()
    gender!: Gender;
}