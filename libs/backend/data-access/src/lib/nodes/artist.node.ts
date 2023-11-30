import { Genre } from '@blavoss-cswdi/shared/api';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class ArtistNode {

  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Genre)
  genre!: Genre;

  @Field()
  description!: string;

  @Field(() => [ID])
  festivals!: string[]; // Assuming festivals are stored as strings (IDs)
}