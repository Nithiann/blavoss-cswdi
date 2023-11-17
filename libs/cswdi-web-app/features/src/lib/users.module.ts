import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";
import { UserService } from "./user/user.service";
import { UserListComponent } from "./user/user-list/user-list.component";
import { RouterModule } from "@angular/router";
import { routes } from './user/user-routing.module';
import { UserUpdateComponent } from "./user/user-update/user-update.component";
import { UserCreateComponent } from "./user/user-create/user-create.component";

@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule.forChild(routes)],
    declarations: [UserDetailComponent, UserListComponent, UserUpdateComponent, UserCreateComponent],
    providers: [UserService],
    exports: [UserDetailComponent, UserListComponent, RouterModule, UserUpdateComponent, UserCreateComponent],
})
export class UserModule {}