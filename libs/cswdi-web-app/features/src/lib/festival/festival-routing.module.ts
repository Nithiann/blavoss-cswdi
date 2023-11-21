import { Routes } from '@angular/router';
import { FestivalCreateComponent } from './festival-create/festival-create.component';
import { FestivalDetailComponent } from './festival-detail/festival-detail.component';
import { FestivalListComponent } from './festival-list/festival-list.component';

export const routes: Routes = [
    {
        path: 'new',
        pathMatch: 'full',
        component: FestivalCreateComponent
    },
    {
        path: ':id',
        component: FestivalDetailComponent
    },
    {
        path: '',
        pathMatch: 'full',
        component: FestivalListComponent
    }
]