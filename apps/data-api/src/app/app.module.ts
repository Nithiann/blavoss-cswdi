import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesArtistModule, BackendFeaturesUserModule } from '@blavoss-cswdi/backend/features';
import { DataAccessModule } from '@blavoss-cswdi/backend/data-access';

@Module({
  imports: [BackendFeaturesUserModule, DataAccessModule, BackendFeaturesArtistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
