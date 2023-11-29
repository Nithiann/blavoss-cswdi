import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../../festival/festival.service';

@Component({
  selector: 'blavoss-cswdi-ticket-listing',
  templateUrl: './ticket-listing.component.html',
  styleUrls: ['./ticket-listing.component.css'],
})
export class TicketListingComponent implements OnInit, OnDestroy{

  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;
  constructor(private festivalService: FestivalService) {}

  ngOnInit(): void {
    this.subscription = this.festivalService.list().subscribe((festivals) => {
      this.festivals = festivals;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
