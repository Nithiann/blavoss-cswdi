import { Genre } from '@blavoss-cswdi/shared/api';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class FestivalNode {

  @Field(() => ID)
  _id!: string;

  @Field()
  name!: string;

  @Field(() => Genre)
  genre!: Genre;

}