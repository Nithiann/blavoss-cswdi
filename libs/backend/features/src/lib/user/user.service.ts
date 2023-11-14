import { Gender, IUser } from "@blavoss-cswdi/shared/api";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UserService {
    TAG = 'UserService';

    private users$ = new BehaviorSubject<IUser[]>([
        {
            id: `user-${Math.floor(Math.random() * 10000)}`,
            email: 'HkXU3@example.com',
            hash: '123',
            firstName: 'Voss',
            lastName: 'Bos',
            dob: new Date(),
            gender: Gender.Male,
        }
    ]);

    getAll(): IUser[] {
        Logger.log('getAll', this.TAG);
        return this.users$.value;
    }

    getOne(id: string): IUser {
        Logger.log(`getOne(${id})`, this.TAG);
        const user = this.users$.value.find((td) => td.id === id);
        if (!user) {
            throw new NotFoundException(`User could not be found!`);
        }
        return user;
    }

    create(user: Pick<IUser, 'email' | 'hash' | 'firstName' | 'lastName' | 'dob' | 'gender'>): IUser {
        Logger.log('create', this.TAG);
        const current = this.users$.value;
        // Use the incoming data, a randomized ID, and a default value of `false` to create the new to-do
        const newUser: IUser = {
            ...user,
            id: `user-${Math.floor(Math.random() * 10000)}`,
        };
        this.users$.next([...current, newUser]);
        return newUser;
    }
}