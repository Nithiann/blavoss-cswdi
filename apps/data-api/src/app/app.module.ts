import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesUserModule } from '@blavoss-cswdi/backend/features';
import { DataAccessModule } from '@blavoss-cswdi/backend/data-access';

@Module({
  imports: [BackendFeaturesUserModule, DataAccessModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
