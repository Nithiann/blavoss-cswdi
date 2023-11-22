import { Routes } from '@angular/router';
import { FestivalCreateComponent } from './festival-create/festival-create.component';
import { FestivalDetailComponent } from './festival-detail/festival-detail.component';
import { FestivalListComponent } from './festival-list/festival-list.component';
import { FestivalAddArtistComponent } from './festival-add-artist/festival-add-artist.component';
import { authGuard } from '@blavoss-cswdi/common';

export const routes: Routes = [
    {
        path: 'new',
        pathMatch: 'full',
        component: FestivalCreateComponent
    },
    {
        path: 'artists/:id',
        component: FestivalAddArtistComponent
    },
    {
        path: ':id',
        canActivate: [authGuard],
        component: FestivalDetailComponent
    },
    {
        path: '',
        pathMatch: 'full',
        component: FestivalListComponent
    }
]