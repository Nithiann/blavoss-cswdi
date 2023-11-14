import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'blavoss-cswdi-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
    users: IUser[] | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private userService: UserService) {}

    ngOnInit(): void {
      this.subscription = this.userService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.users = results;
      })
    }
    ngOnDestroy(): void {
      if (this.subscription) this.subscription.unsubscribe();
    }
}
