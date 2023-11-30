import { Gender } from '@blavoss-cswdi/shared/api';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class UserNode {

    @Field(() => ID)
    id!: string;

    @Field()
    email!: string;

    @Field()
    firstName!: string;

    @Field()
    lastName!: string;

    @Field()
    dob!: Date;

    @Field(() => Gender)
    gender!: Gender;

    @Field(() => [ID])
    tickets!: string[];
}