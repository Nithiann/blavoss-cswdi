/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { CreateFestivalDTO } from '@blavoss-cswdi/backend/dto';
import { ArtistService } from '../artist/artist.service';
import { AdminAuthGuard } from '../admin-auth.guard';
import { GenericAuthGuard } from '../generic-auth.guard';

@Controller('festival')
export class FestivalController {

    TAG = 'FestivalController'

    constructor(private festivalService: FestivalService, private artistService: ArtistService) {}

    @Get('')
    @UseGuards(GenericAuthGuard)
    async getAll(): Promise<IFestival[]> {
        return await this.festivalService.getAll();
    }

    @Get(':id')
    @UseGuards(GenericAuthGuard)
    async getOne(@Param('id') id: string): Promise<IFestival> {
        return await this.festivalService.getOne(id);
    }

    @Put(':id')
    @UseGuards(AdminAuthGuard)
    async update(@Param('id') id: string, @Body() updateUser: Partial<IFestival>): Promise<IFestival> {
        return await this.festivalService.update(id, updateUser);
    }

    @Post('')
    @UseGuards(AdminAuthGuard)
    async create(@Body() data: CreateFestivalDTO): Promise<IFestival> {
        return await this.festivalService.create(data);
    }

    @Delete(':id')
    @UseGuards(AdminAuthGuard)
    async delete(@Param('id') id: string): Promise<IFestival> {
        return await this.festivalService.delete(id);
    }

    @Post('addArtistToFestival')
    @UseGuards(AdminAuthGuard)
    async addArtistToFestival(@Body() data: any): Promise<IFestival> {
        Logger.log(`addArtistToFestival(${data.festivalId}, ${data.artistId})`, this.TAG);
        await this.artistService.addFestivalToArtist(data.artistId, data.festivalId);
        return await this.festivalService.addArtistToFestival(data.festivalId, data.artistId);
    }
}
