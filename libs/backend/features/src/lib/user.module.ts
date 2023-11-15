import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DataAccessModule, UserSchema } from '@blavoss-cswdi/backend/data-access'; 
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [DataAccessModule, MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class BackendFeaturesUserModule {}