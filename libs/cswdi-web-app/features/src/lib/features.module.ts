import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { UserDetailComponent } from "./user/user-detail/user-detail.component";
import { UserService } from "./user/user.service";
import { UserListComponent } from "./user/user-list/user-list.component";

@NgModule({
    imports: [CommonModule, HttpClientModule],
    declarations: [UserDetailComponent, UserListComponent],
    providers: [UserService],
    exports: [UserDetailComponent, UserListComponent],
})
export class FeaturesModule {}