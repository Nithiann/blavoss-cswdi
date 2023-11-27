import {
  ArtistSchema,
  DataAccessModule,
} from '@blavoss-cswdi/backend/data-access';
import { ArtistController } from './artist/artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ArtistService } from './artist/artist.service';
import { Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { TicketController } from './ticket/ticket.controller';
import { TicketService } from './ticket/ticket.service';

@Module({
  imports: [
    DataAccessModule,
    MongooseModule.forFeature([{ name: 'Artist', schema: ArtistSchema }]),
  ],
  controllers: [ArtistController, TicketController],
  providers: [ArtistService, JwtStrategy, TicketService],
  exports: [],
})
export class BackendFeaturesArtistModule {}
