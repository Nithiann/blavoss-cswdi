import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FestivalService } from "./festival/festival.service";
import { AuthService, SearchFilterPipe, TokenInterceptor } from "@blavoss-cswdi/common";
import { TicketService } from "./ticket/ticket.service";
import { routes } from "./ticket/ticket-routing.module";
import { TicketListingComponent } from "./ticket/ticket-listing/ticket-listing.component";
import { TicketPayComponent } from "./ticket/ticket-pay/ticket-pay.component";
import { UiModule } from "@blavoss-cswdi/ui";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";


@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule.forChild(routes), FormsModule, UiModule, ToastModule],
    declarations: [TicketListingComponent, TicketPayComponent, SearchFilterPipe],    
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    providers: [TicketService, FestivalService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}, MessageService],
    exports: [RouterModule, TicketListingComponent, TicketPayComponent],
})
export class TicketsModule {} 