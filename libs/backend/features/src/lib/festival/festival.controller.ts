/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Logger, Param, Post, Put } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { CreateFestivalDTO } from '@blavoss-cswdi/backend/dto';

@Controller('festival')
export class FestivalController {

    TAG = 'FestivalController'

    constructor(private festivalService: FestivalService) {}

    @Get('')
    async getAll(): Promise<IFestival[]> {
        return await this.festivalService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IFestival> {
        return await this.festivalService.getOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUser: Partial<IFestival>): Promise<IFestival> {
        return await this.festivalService.update(id, updateUser);
    }

    @Post('')
    async create(@Body() data: CreateFestivalDTO): Promise<IFestival> {
        return await this.festivalService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<IFestival> {
        return await this.festivalService.delete(id);
    }

    @Post('addArtistToFestival')
    async addArtistToFestival(@Body() data: any): Promise<IFestival> {
        Logger.log(`addArtistToFestival(${data.festivalId}, ${data.artistId})`, this.TAG);
        return await this.festivalService.addArtistToFestival(data.festivalId, data.artistId);
    }
}
