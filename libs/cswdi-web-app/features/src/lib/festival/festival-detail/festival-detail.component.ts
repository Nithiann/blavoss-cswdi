/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FestivalService } from '../festival.service';
import { ActivatedRoute } from '@angular/router';
import { IFestival } from '@blavoss-cswdi/shared/api';

@Component({
  selector: 'blavoss-cswdi-festival-detail',
  templateUrl: './festival-detail.component.html',
  styleUrls: ['./festival-detail.component.css'],
})
export class FestivalDetailComponent implements OnInit, OnDestroy {

  festival: IFestival | null = null;
  subscription: Subscription | undefined  = undefined;

  constructor(private festivalService: FestivalService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      const festivalId = params['id'];

      this.subscription = this.festivalService.read(festivalId).subscribe((results: any) => {
        console.log(`results: ${results}`);
        this.festival = results;
      })
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}

