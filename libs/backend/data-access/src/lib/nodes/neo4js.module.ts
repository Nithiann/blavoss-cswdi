import { Module } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import * as neo4j from 'neo4j-driver';
import { environment } from '@blavoss-cswdi/shared/api';

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
                  `${environment.NEO4J_SCHEME}://${environment.NEO4J_HOST}`,
                  neo4j.auth.basic(
                      environment.NEO4J_USR,
                      environment.NEO4J_PASS
                  ),
                );
              },
            },
          ],
        };
      }
}