import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { IArtist } from '@blavoss-cswdi/shared/api';
import { CreateArtistDTO } from '@blavoss-cswdi/backend/dto';
import { AdminAuthGuard } from '../admin-auth.guard';
import { GenericAuthGuard } from '../generic-auth.guard';

@Controller('artist')
export class ArtistController {

    constructor(private artistService: ArtistService) {}

    @Get('')
    @UseGuards(GenericAuthGuard)
    async getAll(): Promise<IArtist[]> {
        return await this.artistService.getAll();
    }

    @Get(':id')
    @UseGuards(GenericAuthGuard)
    async getOne(@Param('id') id: string): Promise<IArtist> {
        return await this.artistService.getOne(id);
    }

    @Put(':id')
    @UseGuards(AdminAuthGuard)
    async update(@Param('id') id: string, @Body() updateUser: Partial<IArtist>): Promise<IArtist> {
        return await this.artistService.update(id, updateUser);
    }

    @Post('')
    @UseGuards(AdminAuthGuard)
    async create(@Body() data: CreateArtistDTO): Promise<IArtist> {
        return await this.artistService.create(data);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') id: string): Promise<IArtist> {
        return await this.artistService.delete(id);
    }

    @Get('planned/:id')
    @UseGuards(GenericAuthGuard)
    async ListNotInFestival(@Param('id') id: string): Promise<IArtist[]> {
        return await this.artistService.ListNotInFestival(id);
    }
}
