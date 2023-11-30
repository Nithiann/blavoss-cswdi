import { Genre } from '@blavoss-cswdi/shared/api';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class FestivalNode {

  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field()
  location!: string;

  @Field()
  startDate!: Date;

  @Field()
  endDate!: Date;

  @Field()
  description!: string;

  @Field()
  ticketPrice!: number;

  @Field(() => Genre)
  genre!: Genre;

  @Field(() => [ID])
  artists!: string[];

  @Field(() => [ID])
  tickets!: string[];
}