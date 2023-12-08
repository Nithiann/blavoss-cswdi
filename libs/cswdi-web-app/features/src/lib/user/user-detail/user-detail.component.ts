/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ITicket, IUser, PersonalizationStatus } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../ticket/ticket.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'blavoss-cswdi-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})
export class UserDetailComponent implements OnInit, OnDestroy {

    user: IUser | null = null;
    subscription: Subscription | undefined = undefined;
    filteredTickets: ITicket[] | null = null;
    showPastEventsControl: FormControl = new FormControl(false);
    
    constructor(private userService: UserService, private route: ActivatedRoute, private ticketService: TicketService, private messageService: MessageService) {}
    
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        const userId = params['id'];

        this.subscription = this.userService.read(userId).subscribe((results: any) => {
          console.log(`results: ${results}`);
          this.user = results;
          this.filterTickets();
        })
      })
    }

    personalize(ticket: ITicket) {
      ticket.PersonalizationStatus = PersonalizationStatus.Personalized;
      
      this.subscription = this.ticketService.personalize(ticket)
      .subscribe((res) => this.showToast(res));
    }

    ngOnDestroy(): void {
     if (this.subscription) this.subscription.unsubscribe();
    }

    filterTickets() {
      if (this.user?.tickets) {
        const currentDate = new Date().getTime();
    
        // Filter tickets based on showPastEvents and endDate
        this.filteredTickets = this.user.tickets.filter((ticket: any) => {
          const endDate = new Date(ticket.festivalId.endDate).getTime();
          
          if (this.showPastEventsControl.value) {
            return true; // Show all events
          } else {
            return endDate >= currentDate; // Show only future events
          }
        });
      }
    }

    private showToast(res: any) {
      this.messageService.add({severity: 'success', summary: 'Success', detail: 'Personalization Successful'});
    }
}
