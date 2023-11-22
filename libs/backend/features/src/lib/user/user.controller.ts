import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ILogin, IUser } from '@blavoss-cswdi/shared/api';
import { CreateUserDTO } from '@blavoss-cswdi/backend/dto';
import { AdminAuthGuard } from '../admin-auth.guard';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}

    @Post('/login')
    async login(@Body() creds: ILogin): Promise<{user: IUser; token: string}> {
        return await this.userService.login(creds);
    }

    @Get('')
    @UseGuards(AdminAuthGuard)
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IUser> {
        return await this.userService.getOne(id);
    }

    @Put(':id')
    @UseGuards(AdminAuthGuard)
    async update(@Param('id') id: string, @Body() updateUser: Partial<IUser>): Promise<IUser> {
        return await this.userService.update(id, updateUser);
    }

    @Post('')
    async create(@Body() data: CreateUserDTO): Promise<IUser> {
        return await this.userService.create(data);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') id: string): Promise<IUser> {
        return await this.userService.delete(id);
    }
}
