/* eslint-disable @typescript-eslint/no-explicit-any */

import { IFestival } from '@blavoss-cswdi/shared/api';
import { FestivalNode } from './festival.node';
import { UserNode } from './user.node';
import { Injectable, Logger } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';


@Injectable()
export class Neo4jService {
    private readonly driver: neo4j.Driver;

    constructor() {
        this.driver = neo4j.driver(
            `${process.env['NEO4J_SCHEME']}://${process.env['NEO4J_HOST'] }`,
            neo4j.auth.basic(
                process.env['NEO4J_USR'] ?? 'neo4j',
                process.env['NEO4J_PASS'] ?? 'password'
            ),
        );

        console.log(`${process.env['NEO4J_SCHEME']}://${process.env['NEO4J_HOST'] } `)
        console.log(`${process.env['NEO4J_USR']} ${process.env['NEO4J_PASS']}`) 
        this.testConnection();
    }

    getSession(): neo4j.Session {
        return this.driver.session();
    }

    async testConnection(): Promise<void> {
        const session = this.getSession();
    
        try {
          // Execute a simple query to check if the connection is working
          const result = await session.run('RETURN 1 as result');
          const value = result.records[0].get('result').toNumber();
    
          if (value === 1) {
            console.log('Neo4j connection is successful!');
          } else {
            console.error('Unexpected result from test query');
          }
        } catch (error) {
          console.error('Error testing Neo4j connection:', error);
        } finally {
          session.close();
        }
    }

    async purchaseTicket(userId: string, festival: Partial<IFestival>) {
        Logger.log('purchaseTicket', `${userId} ${festival}`);
        const session = this.driver.session();
        try {
            // create node for user
            await session.run('MERGE (u:User {_id: $userId})', {userId})

            // create node for festival
            await session.run('MERGE (f:Festival {_id: $festival.id, genre: $festival.genre})', {festival});

            // create buy relationship between user and festival
            await session.run('MATCH (u:User {_id: $userId}), (f:Festival {_id: $festival.id}) MERGE (u)-[r:PURCHASED]->(f)', {userId, festival});
        } catch (err: any) {
            throw new Error(err.message);
        } finally {
            await session.close();
        }
    }

    async getRecommendedFestivalForUser(userId: string) {
      Logger.log('getRecommendedFestivalForUser', `${userId}`);
      const session = this.driver.session();
      try {
          // find users preferred genres
          const genresResult = await session.run(`
          MATCH (u:User {_id: "${userId}"})-[:PURCHASED]->(festival:Festival)
          WITH u, COLLECT(DISTINCT festival.genre) AS userGenres
          RETURN userGenres
        `);

        const userPreferredGenres = genresResult.records[0]?.get('userGenres');

        if (userPreferredGenres && userPreferredGenres.length > 0) {
          const recommendedFestivals = [];

          for (const userPreferredGenre of userPreferredGenres) {
            // return genre based on user's preferred genre
            const result = await session.run(`
            MATCH (user:User {_id: "${userId}"})-[:PURCHASED]->(festival:Festival)<-[:PURCHASED]-(otherUser:User)-[:PURCHASED]->(recommendedFestival:Festival) 
            WHERE NOT (user)-[:PURCHASED]->(recommendedFestival) AND festival.genre = "${userPreferredGenre}"
            RETURN recommendedFestival;
            `);
            const festivalsForGenre = result.records.map(record => record.get('recommendedFestival').properties);
            recommendedFestivals.push(...festivalsForGenre);
          }

          return recommendedFestivals;
        }        
      } catch (err: any) {
        throw new Error(err.message)
      } finally {
        await session.close();
      }
    }
}
