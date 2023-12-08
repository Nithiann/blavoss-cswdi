import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../../festival/festival.service';
import { Router } from '@angular/router';
import { AuthService } from '@blavoss-cswdi/common';

@Component({
  selector: 'blavoss-cswdi-ticket-listing',
  templateUrl: './ticket-listing.component.html',
  styleUrls: ['./ticket-listing.component.css'],
})
export class TicketListingComponent implements OnInit, OnDestroy{

  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;
  searchTerm: string = '';
  recommendations: IFestival[] | null = null;
  activeIndex = 0;
  constructor(private festivalService: FestivalService, private router: Router, private authService: AuthService) {}

  selectFestival(festival: IFestival | null) {
    this.router.navigate( ['/festival', festival!._id]);	
  }

  ngOnInit(): void {
    this.subscription = this.festivalService.list().subscribe((festivals) => {
      this.festivals = this.filterFestivals(festivals!);
    });

    this.subscription = this.authService.currentUserValue.subscribe((user) => {
      if (user) {
        this.subscription = this.festivalService.getRecommendations(user.sub).subscribe((festivals) => {
          this.recommendations = festivals;
          console.log(this.recommendations);
        });
      }
    })
  }

  filterFestivals(festivals: IFestival[]): IFestival[] {
    const currentDate = new Date().getTime();
    
        return festivals.filter((festival: IFestival) => {
          const endDate = new Date(festival.endDate).getTime();
          
           return endDate > currentDate;
        });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
