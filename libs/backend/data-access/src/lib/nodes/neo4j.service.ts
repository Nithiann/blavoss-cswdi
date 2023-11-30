/* eslint-disable @typescript-eslint/no-explicit-any */

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

    async purchaseTicket(userId: string, festivalId: string) {
        Logger.log('purchaseTicket', `${userId} ${festivalId}`);
        const session = this.driver.session();
        try {
            // create node for user
            await session.run('MERGE (u:User {userId: $userId})', {userId})

            // create node for festival
            await session.run('MERGE (f:Festival {festivalId: $festivalId})', {festivalId});


            // create buy relationship between user and festival
            await session.run('MATCH (u:User {userId: $userId}), (f:Festival {festivalId: $festivalId}) MERGE (u)-[r:PURCHASED]->(f)', {userId, festivalId});
        } catch (err: any) {
            throw new Error(err.message);
        } finally {
            await session.close();
        }

    }
}
