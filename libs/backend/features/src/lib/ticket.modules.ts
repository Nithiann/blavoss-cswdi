import { DataAccessModule, TicketSchema } from "@blavoss-cswdi/backend/data-access";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TicketController } from "./ticket/ticket.controller";
import { JwtStrategy } from "./jwt.strategy";
import { TicketService } from "./ticket/ticket.service";

@Module({
    imports: [
      DataAccessModule,
      MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    ],
    controllers: [TicketController],
    providers: [JwtStrategy, TicketService],
    exports: [],
  })
  export class BackendFeaturesTicketModule {}