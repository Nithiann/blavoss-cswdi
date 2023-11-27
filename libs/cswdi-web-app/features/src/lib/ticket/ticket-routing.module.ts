import { Routes } from "@angular/router";
import { adminGuard, authGuard } from "@blavoss-cswdi/common";

export const routes: Routes = [
    {
        path: 'pay',
        pathMatch: 'full',
        canActivate: [authGuard]
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
        canActivate: [adminGuard]
    }
]