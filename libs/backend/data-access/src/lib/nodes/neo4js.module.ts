import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import * as neo4j from 'neo4j-driver';

@Module({
  providers: [Neo4jService],
  exports: [Neo4jService],
})
export class Neo4jModule {
    static forRoot() {
        return {
          module: Neo4jModule,
          providers: [
            {
              provide: 'NEO4J',
              useFactory: () => {
                return neo4j.driver(
                    `${process.env['NEO4J_SCHEME']}://${process.env['NEO4J_HOST'] } ` ?? 'bolt://localhost:7687',
                    neo4j.auth.basic(
                        process.env!['NEO4J_USER'] ?? 'neo4j',
                        process.env!['NEO4J_PASSWORD'] ?? 'password'
                    ),
                );
              },
            },
          ],
        };
      }
}