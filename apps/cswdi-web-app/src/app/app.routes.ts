import { Route } from '@angular/router';
import { AboutComponent } from '@blavoss-cswdi/common';

export const appRoutes: Route[] = [
    {
        path: 'about',
        pathMatch: 'full',
        component: AboutComponent,
    },
    {
        path: 'user',
        loadChildren: () => import('@blavoss-cswdi/web-app/features').then((m) => m.UserModule),
    },
    {
        path: 'artist',
        loadChildren: () => import('@blavoss-cswdi/web-app/features').then((m) => m.ArtistModule),
    },
    {
        path: 'festival',
        loadChildren: () => import('@blavoss-cswdi/web-app/features').then((m) => m.FestivalsModule),
    },
    {
        path: 'ticket',
        loadChildren: () => import('@blavoss-cswdi/web-app/features').then((m) => m.TicketsModule),
    }
];
