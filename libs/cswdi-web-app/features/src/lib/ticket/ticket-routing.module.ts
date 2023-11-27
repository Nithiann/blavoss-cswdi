import { Routes } from "@angular/router";
import { adminGuard, authGuard } from "@blavoss-cswdi/common";
import { TicketPayComponent } from "./ticket-pay/ticket-pay.component";
import { TicketListingComponent } from "./ticket-listing/ticket-listing.component";

export const routes: Routes = [
    {
        path: 'pay',
        pathMatch: 'full',
        canActivate: [authGuard],
        component: TicketPayComponent
    },
    {
        path: 'list',
        pathMatch: 'full',	
    },
    {
        path: ':id',
        pathMatch: 'full',
    }, 
    {
        path: '',
        pathMatch: 'full',
        canActivate: [adminGuard],
        component: TicketListingComponent
    }
]