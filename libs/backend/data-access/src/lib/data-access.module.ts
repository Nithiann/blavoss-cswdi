import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(`${process.env['MONGO_SERVER']}://${process.env['MONGO_USER']}:${process.env['MONGO_PASS']}@${process.env['MONGO_HOST']}/${process.env['MONGO_DBNAME']}`),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DataAccessModule {}
