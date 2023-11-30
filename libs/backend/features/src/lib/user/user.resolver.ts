import { Neo4jService, UserNode } from '@blavoss-cswdi/backend/data-access';
import { Resolver, Query } from '@nestjs/graphql';


@Resolver(() => UserNode)
export class UserResolver {
    constructor(private readonly neo4jService: Neo4jService) {}

    @Query(() => [UserNode])
    async users(): Promise<UserNode[]> {
        const session = this.neo4jService.getSession();
        const result = await session.run('MATCH (u:User) RETURN u');

        return result.records.map(record => record.get('u').properties);
    }
}