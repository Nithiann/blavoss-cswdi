/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ITicket, IUser, PersonalizationStatus } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../ticket/ticket.service';

@Component({
  selector: 'blavoss-cswdi-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

    user: IUser | null = null;
    subscription: Subscription | undefined = undefined;

    constructor(private userService: UserService, private route: ActivatedRoute, private ticketService: TicketService) {}
    
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const userId = params['id'];

        this.subscription = this.userService.read(userId).subscribe((results: any) => {
          console.log(`results: ${results}`);
          this.user = results;
        })
      })
    }

    personalize(ticket: ITicket) {
      ticket.PersonalizationStatus = PersonalizationStatus.Personalized;
      
      this.subscription = this.ticketService.personalize(ticket)
      .subscribe((res) => console.log(res));
    }

    ngOnDestroy(): void {
     if (this.subscription) this.subscription.unsubscribe();
    }
}
