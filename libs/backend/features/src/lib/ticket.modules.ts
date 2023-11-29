import { DataAccessModule, FestivalSchema, TicketSchema, UserSchema } from "@blavoss-cswdi/backend/data-access";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketController } from "./ticket/ticket.controller";
import { JwtStrategy } from "./jwt.strategy";
import { TicketService } from "./ticket/ticket.service";
import { UserService } from "./user/user.service";
import { FestivalService } from "./festival/festival.service";

@Module({
    imports: [
      DataAccessModule,
      MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }, {name: 'Festival', schema: FestivalSchema}, {name: 'User', schema: UserSchema}]),
    ],
    controllers: [TicketController],
    providers: [JwtStrategy, TicketService, UserService, FestivalService],
    exports: [],
  })
  export class BackendFeaturesTicketModule {}