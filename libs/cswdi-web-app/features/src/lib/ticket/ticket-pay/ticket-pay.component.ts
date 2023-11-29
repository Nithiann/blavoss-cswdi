/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, authModel } from '@blavoss-cswdi/common';
import { ITicket } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../../festival/festival.service';

@Component({
  selector: 'blavoss-cswdi-ticket-pay',
  templateUrl: './ticket-pay.component.html',
  styleUrls: ['./ticket-pay.component.css'],
})
export class TicketPayComponent implements OnInit, OnDestroy {

  festival: any | null = null;
  user: authModel | null = null;
  subscription: Subscription | undefined = undefined;
  ticket: ITicket | null = null;
  constructor(private authService: AuthService, private festivalService: FestivalService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = this.authService.getDecodedToken();
    this.subscription = this.route.queryParams.subscribe((params) => {
      this.festival = JSON.parse(params['festival']);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
