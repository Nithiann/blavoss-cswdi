import { PersonalizationStatus, TicketStatus } from '@blavoss-cswdi/shared/api';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class TicketNode {

  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  festivalId!: string;

  @Field()
  ticketAmount!: number;

  @Field()
  purchaseDate!: Date;

  @Field(() => TicketStatus)
  status!: TicketStatus;

  @Field(() => PersonalizationStatus)
  personalizationStatus!: PersonalizationStatus;
}