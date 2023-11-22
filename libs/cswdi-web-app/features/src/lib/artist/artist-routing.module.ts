import { Routes } from '@angular/router';
import { ArtistCreateComponent } from './artist-create/artist-create.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtistListComponent } from './artist-list/artist-list.component';
import { ArtistUpdateComponent } from './artist-update/artist-update.component';
import { adminGuard, authGuard } from '@blavoss-cswdi/common';

export const routes: Routes = [
    {
        path: 'new',
        pathMatch: 'full',
        canActivate: [adminGuard],
        component: ArtistCreateComponent
    },
    {
        path: 'update/:id',
        canActivate: [adminGuard],
        component: ArtistUpdateComponent
    },
    {
        path: ':id',
        canActivate: [authGuard],
        component: ArtistDetailComponent	
    },
    {
        path: '',
        pathMatch: 'full',
        canActivate: [adminGuard],
        component: ArtistListComponent
    }
];

export class ArtistRoutingModule {}