import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FestivalService } from "./festival/festival.service";
import { AuthService, TokenInterceptor } from "@blavoss-cswdi/common";


@NgModule({
    imports: [CommonModule, HttpClientModule, ReactiveFormsModule, RouterModule],
    declarations: [],
    providers: [TicketService, FestivalService, AuthService, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}],
    exports: [RouterModule],
})
export class TicketsModule {}