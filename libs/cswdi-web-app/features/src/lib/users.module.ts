import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";
import { UserService } from "./user/user.service";
import { UserListComponent } from "./user/user-list/user-list.component";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { routes } from './user/user-routing.module';
import { UserUpdateComponent } from "./user/user-update/user-update.component";
import { UserCreateComponent } from "./user/user-create/user-create.component";
import { UserLoginComponent } from "./user/user-login/user-login.component";
import { AuthService, TokenInterceptor } from "@blavoss-cswdi/common";
import { TicketService } from "./ticket/ticket.service";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";

@NgModule({
    imports: [CommonModule, HttpClientModule, RouterModule.forChild(routes), ReactiveFormsModule, ToastModule, FormsModule],
    declarations: [UserDetailComponent, UserListComponent, UserUpdateComponent, UserCreateComponent, UserLoginComponent],
    providers: [UserService, AuthService, TicketService, MessageService, {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptor,
        multi: true
      }],
    exports: [UserDetailComponent, UserListComponent, RouterModule, UserUpdateComponent, UserCreateComponent, UserLoginComponent],
})
export class UserModule {}