import { ArtistSchema, DataAccessModule, FestivalSchema, Neo4jService } from '@blavoss-cswdi/backend/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';
import { ArtistService } from './artist/artist.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
    imports: [
        DataAccessModule, 
        MongooseModule.forFeature([{name: 'Festival', schema: FestivalSchema}]), 
        MongooseModule.forFeature([{ name: 'Artist', schema: ArtistSchema }]),
    ],
    controllers: [FestivalController],
    providers: [FestivalService, ArtistService, JwtStrategy, Neo4jService],
    exports: [],
})

export class BackendFeaturesFestivalModule {}