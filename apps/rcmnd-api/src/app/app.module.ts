import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataAccessModule, NeoDataAccessModule } from '@blavoss-cswdi/backend/data-access';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BackendFeaturesFestivalModule } from '@blavoss-cswdi/backend/features';

@Module({
  imports: [
    NeoDataAccessModule,
    DataAccessModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
        secret: process.env['JWT_SECRET'],
        signOptions: { expiresIn: '1d' },
    }),
    BackendFeaturesFestivalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
