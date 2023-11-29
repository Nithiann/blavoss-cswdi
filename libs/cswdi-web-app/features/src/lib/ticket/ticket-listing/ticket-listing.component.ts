import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../../festival/festival.service';
import { Router } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-ticket-listing',
  templateUrl: './ticket-listing.component.html',
  styleUrls: ['./ticket-listing.component.css'],
})
export class TicketListingComponent implements OnInit, OnDestroy{

  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;
  searchTerm: string = '';
  constructor(private festivalService: FestivalService, private router: Router) {}

  selectFestival(festival: IFestival | null) {
    this.router.navigate( ['/festival', festival!._id]);	
  }

  ngOnInit(): void {
    this.subscription = this.festivalService.list().subscribe((festivals) => {
      this.festivals = festivals;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
