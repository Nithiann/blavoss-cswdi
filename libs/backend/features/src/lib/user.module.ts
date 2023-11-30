import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { DataAccessModule, Neo4jService, UserSchema } from '@blavoss-cswdi/backend/data-access'; 
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from './jwt.strategy';
import { UserResolver } from './user/user.resolver';


@Module({
  imports: [DataAccessModule, 
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, UserResolver, Neo4jService],
  exports: [],
})
export class BackendFeaturesUserModule {}