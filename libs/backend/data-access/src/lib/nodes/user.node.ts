import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserNode {

    @Field(() => ID)
    _id!: string;
}