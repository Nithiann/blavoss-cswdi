import { DataAccessModule, FestivalSchema } from '@blavoss-cswdi/backend/data-access';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FestivalController } from './festival/festival.controller';
import { FestivalService } from './festival/festival.service';
import { ArtistService } from './artist/artist.service';

@Module({
    imports: [DataAccessModule, MongooseModule.forFeature([{name: 'Festival', schema: FestivalSchema}])],
    controllers: [FestivalController],
    providers: [FestivalService, ArtistService],
    exports: [],
})

export class BackendFeaturesFestivalModule {}