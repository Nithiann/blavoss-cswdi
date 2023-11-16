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
    }
];
