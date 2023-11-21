import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesArtistModule, BackendFeaturesFestivalModule, BackendFeaturesUserModule } from '@blavoss-cswdi/backend/features';
import { DataAccessModule } from '@blavoss-cswdi/backend/data-access';

@Module({
  imports: [BackendFeaturesUserModule, DataAccessModule, BackendFeaturesArtistModule, BackendFeaturesFestivalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
