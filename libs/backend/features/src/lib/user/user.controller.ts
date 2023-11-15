import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser } from '@blavoss-cswdi/shared/api';
import { CreateUserDTO } from '@blavoss-cswdi/backend/dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('')
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    getOne(@Param('id') id: string): IUser {
        return this.userService.getOne(id);
    }

    @Post('')
    async create(@Body() data: CreateUserDTO): Promise<IUser> {
        return await this.userService.create(data);
    }
}
