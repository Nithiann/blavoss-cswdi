import { ITicket } from "./ticket.interface";

export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
    None = "Prefer not to say"
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IUser {
    _id?: string;
    email: string;
    hash: string;
    firstName: string;
    lastName: string;
    dob: Date;
    gender: Gender;
    tickets?: ITicket[];
}

export type ICreateUser = Pick<
    IUser,
    'email' | 'hash' | 'firstName' | 'lastName' | 'dob' | 'gender'
>;

export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;