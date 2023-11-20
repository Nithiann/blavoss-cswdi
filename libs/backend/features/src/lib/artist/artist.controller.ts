import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { IArtist } from '@blavoss-cswdi/shared/api';

@Controller('artist')
export class ArtistController {

    constructor(private artistService: ArtistService) {}

    @Get('')
    async getAll(): Promise<IArtist[]> {
        return await this.artistService.getAll();
    }

    @Get(':id')
    async getOne(@Param('id') id: string): Promise<IArtist> {
        return await this.artistService.getOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUser: Partial<IArtist>): Promise<IArtist> {
        return await this.artistService.update(id, updateUser);
    }

    @Post('')
    async create(@Body() data: IArtist): Promise<IArtist> {
        return await this.artistService.create(data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<IArtist> {
        return await this.artistService.delete(id);
    }
}
