import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { ILogin, IUser } from '@blavoss-cswdi/shared/api';
import { CreateUserDTO } from '@blavoss-cswdi/backend/dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/login')
    async login(@Body() creds: ILogin): Promise<IUser> {
        return await this.userService.login(creds);
    }

    @Get('')
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IUser> {
        return await this.userService.getOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUser: Partial<IUser>): Promise<IUser> {
        return await this.userService.update(id, updateUser);
    }

    @Post('')
    async create(@Body() data: CreateUserDTO): Promise<IUser> {
        return await this.userService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<IUser> {
        return await this.userService.delete(id);
    }
}
