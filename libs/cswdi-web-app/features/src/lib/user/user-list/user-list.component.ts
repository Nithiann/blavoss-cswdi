import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { MessageService, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'blavoss-cswdi-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit, OnDestroy {
    users: IUser[] | null = null;
    subscription: Subscription | undefined = undefined;
    editIcon: PrimeIcons | undefined = PrimeIcons.USER_EDIT;
    addIcon: PrimeIcons | undefined = PrimeIcons.USER_PLUS;
    deleteIcon: PrimeIcons | undefined = PrimeIcons.USER_MINUS;

    constructor(private userService: UserService, private messageService: MessageService) {}

    ngOnInit(): void {
      this.subscription = this.userService.list().subscribe((results) => {
        console.log(`results: ${results}`);
        this.users = results;
      })
    }
    ngOnDestroy(): void {
      if (this.subscription) this.subscription.unsubscribe();
    }

    delete(id: string | undefined): void {
      this.subscription = this.userService.remove(id!).subscribe((resp)=> {
        console.log(`resp: ${resp}`);
        if (this.users)
          this.users = this.users?.filter(user => user._id !== id);

        this.showToast();
      })
    }

    private showToast() {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'User Deleted'});
    }
}
