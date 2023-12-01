import { Component, Input, OnInit } from '@angular/core';
import { IFestival } from '@blavoss-cswdi/shared/api';

@Component({
  selector: 'blavoss-cswdi-festival-item',
  templateUrl: './festival-item.component.html',
  styleUrls: ['./festival-item.component.css'],
})
export class FestivalItemComponent implements OnInit {
  @Input()
  festival!: IFestival;

  ngOnInit(): void {
    console.log(this.festival);
  }
}
