/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';

@Component({
  selector: 'blavoss-cswdi-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnInit {

  @Input()
  festivals?: IFestival[] | null = [];
  
  responseiveOptions: any[] | undefined;
  autoplayInterval: number = 3000;

  ngOnInit(): void {

      this.responseiveOptions = [
        {
          breakpoint: '1199px',
          numVisible: 1,
          numScroll: 1
        },
        {
          breakpoint: '991px',
          numVisible: 2,
          numScroll: 1
        },
        {
          breakpoint: '767px',
          numVisible: 1,
          numScroll: 1
        }
      ]
  }
}
