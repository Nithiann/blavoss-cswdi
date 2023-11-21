import { Component, OnDestroy, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../festival.service';

@Component({
  selector: 'blavoss-cswdi-festival-list',
  templateUrl: './festival-list.component.html',
  styleUrls: ['./festival-list.component.css'],
})
export class FestivalListComponent implements OnInit, OnDestroy {
  festivals: IFestival[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private festivalService: FestivalService) {}

  delete(id: string | undefined) {
    this.subscription = this.festivalService.remove(id!).subscribe((resp)=> {
      console.log(`resp: ${resp}`);
        if (this.festivals)
          this.festivals = this.festivals?.filter(festival => festival._id !== id);
    })
  }

  ngOnInit(): void {
      this.subscription = this.festivalService.list().subscribe((result) => {
        this.festivals = result;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
