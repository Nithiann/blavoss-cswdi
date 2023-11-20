import { ArtistSchema, DataAccessModule } from '@blavoss-cswdi/backend/data-access';
import { ArtistController } from './artist/artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistService } from './artist/artist.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [DataAccessModule, MongooseModule.forFeature([{name: 'Artist', schema: ArtistSchema}]),],
    controllers: [ArtistController],
    providers: [ArtistService],
    exports: [],
  })
export class BackendFeaturesArtistModule {}