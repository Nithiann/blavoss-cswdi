import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BackendFeaturesArtistModule, BackendFeaturesFestivalModule, BackendFeaturesUserModule } from '@blavoss-cswdi/backend/features';
import { DataAccessModule } from '@blavoss-cswdi/backend/data-access';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
      BackendFeaturesUserModule,
      DataAccessModule,
      BackendFeaturesArtistModule,
      BackendFeaturesFestivalModule,
      PassportModule.register({ defaultStrategy: 'jwt' }),
      JwtModule.register({
        secret: process.env['JWT_SECRET'],
        signOptions: { expiresIn: '1d' },
      })
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

