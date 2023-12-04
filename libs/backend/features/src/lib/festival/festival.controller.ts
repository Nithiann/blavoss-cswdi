/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Delete, Get, Logger, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { CreateFestivalDTO } from '@blavoss-cswdi/backend/dto';
import { ArtistService } from '../artist/artist.service';
import { AdminAuthGuard } from '../admin-auth.guard';
import { GenericAuthGuard } from '../generic-auth.guard';
import { Neo4jService } from '@blavoss-cswdi/backend/data-access';

@Controller('festival')
export class FestivalController {

    TAG = 'FestivalController'

    constructor(private festivalService: FestivalService, private artistService: ArtistService, private neo4Jservice: Neo4jService) {}

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

    @Post('removeArtistFromFestival')
    @UseGuards(AdminAuthGuard)
    async removeArtistFromFestival(@Body() data: any): Promise<IFestival> {
        Logger.log(`addArtistToFestival(${data.festivalId}, ${data.artistId})`, this.TAG);
        await this.artistService.removeFestivalFromArtist(data.artistId, data.festivalId);
        return await this.festivalService.removeArtistFromFestival(data.festivalId, data.artistId);
    }

    @Get(':userId/recommendations')
    @UseGuards(GenericAuthGuard)
    async getFestivalRecommendations(@Param('userId') userId: string): Promise<IFestival[]> {
        Logger.log('getFestivalRecommendations', `${userId}`);
        const festivals = await this.neo4Jservice.getRecommendedFestivalForUser(userId);

        const recommendations: IFestival[] = [];

        for (const festivalNode of festivals) {
            const festival = await this.festivalService.getOne(festivalNode.festivalId);
            recommendations.push(festival);
        }

        return recommendations;
    } 
}
