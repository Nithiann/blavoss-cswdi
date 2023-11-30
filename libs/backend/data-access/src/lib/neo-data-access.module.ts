import { Module } from '@nestjs/common';
import { Neo4jModule } from './nodes/neo4js.module';

@Module({
  imports: [
    Neo4jModule.forRoot()
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class NeoDataAccessModule {}
