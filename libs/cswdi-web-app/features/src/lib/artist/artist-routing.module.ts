import { Routes } from '@angular/router';
import { ArtistCreateComponent } from './artist-create/artist-create.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ArtistListComponent } from './artist-list/artist-list.component';

export const routes: Routes = [
    {
        path: 'new',
        pathMatch: 'full',
        component: ArtistCreateComponent
    },
    {
        path: ':id',
        component: ArtistDetailComponent	
    },
    {
        path: '',
        pathMatch: 'full',
        component: ArtistListComponent
    }
];

export class ArtistRoutingModule {}