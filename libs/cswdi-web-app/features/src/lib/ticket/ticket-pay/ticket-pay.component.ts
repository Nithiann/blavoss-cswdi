import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@blavoss-cswdi/common';
import { IFestival, ITicket, IUser } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../../festival/festival.service';

@Component({
  selector: 'blavoss-cswdi-ticket-pay',
  templateUrl: './ticket-pay.component.html',
  styleUrls: ['./ticket-pay.component.css'],
})
export class TicketPayComponent implements OnInit, OnDestroy {

  festival: IFestival | null = null;
  user: IUser | null = null;
  subscription: Subscription | undefined = undefined;
  ticket: ITicket | null = null;
  constructor(private authService: AuthService, private festivalService: FestivalService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.authService.getDecodedToken().subscribe((user) => {
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
