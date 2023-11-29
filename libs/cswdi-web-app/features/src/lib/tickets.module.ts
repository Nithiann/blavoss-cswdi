import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FestivalService } from "./festival/festival.service";
import { AuthService, SearchFilterPipe, TokenInterceptor } from "@blavoss-cswdi/common";
import { TicketService } from "./ticket/ticket.service";
import { routes } from "./ticket/ticket-routing.module";
import { TicketListingComponent } from "./ticket/ticket-listing/ticket-listing.component";
import { TicketPayComponent } from "./ticket/ticket-pay/ticket-pay.component";


@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes), FormsModule],
    declarations: [TicketListingComponent, TicketPayComponent, SearchFilterPipe],
    providers: [TicketService, FestivalService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
    exports: [RouterModule, TicketListingComponent, TicketPayComponent],
})
export class TicketsModule {}