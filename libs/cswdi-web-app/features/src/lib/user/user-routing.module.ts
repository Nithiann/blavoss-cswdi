import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { adminGuard } from '@blavoss-cswdi/common';

export const routes: Routes = [
    {
        path: 'login',
        pathMatch: 'full',
        component: UserLoginComponent
    },
    {
        path: 'new',
        pathMatch: 'full',
        component: UserCreateComponent
    },
    {
        path: 'update/:id',
        canActivate: [adminGuard],
        component: UserUpdateComponent
    },
    {
        path: ':id',
        component: UserDetailComponent
    },
    {
        path: '',
        pathMatch: 'full',
        canActivate: [adminGuard],
        component: UserListComponent
    }
];

export class UserRoutingModule {}