
import { Injectable } from '@nestjs/common';
import * as neo4j from 'neo4j-driver';


@Injectable()
export class Neo4jService {
    private readonly driver: neo4j.Driver;

    constructor() {
        this.driver = neo4j.driver(
            `${process.env['NEO4J_SCHEME']}://${process.env['NEO4J_HOST'] } ` ?? 'bolt://localhost:7687',
            neo4j.auth.basic(
                process.env!['NEO4J_USER'] ?? 'neo4j',
                process.env!['NEO4J_PASSWORD'] ?? 'password'
            ),
        );
    }

    getDriver(): neo4j.Driver {
        return this.driver;
    }
}
