/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

    user: IUser | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private userService: UserService, private route: ActivatedRoute) {}
    
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const userId = params['id'];

        this.subscription = this.userService.read(userId).subscribe((results: any) => {
          console.log(`results: ${results}`);
          this.user = results;
        })
      })
    }

    ngOnDestroy(): void {
     if (this.subscription) this.subscription.unsubscribe();
    }
}
