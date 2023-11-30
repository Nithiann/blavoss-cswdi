import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NeoDataAccessModule } from '@blavoss-cswdi/backend/data-access';

@Module({
  imports: [
    NeoDataAccessModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
