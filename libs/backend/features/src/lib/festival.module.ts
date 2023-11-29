import { ArtistSchema, DataAccessModule, FestivalSchema } from '@blavoss-cswdi/backend/data-access';
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
    providers: [FestivalService, ArtistService, JwtStrategy],
    exports: [],
})

export class BackendFeaturesFestivalModule {}