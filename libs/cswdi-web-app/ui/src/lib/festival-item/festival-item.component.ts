import { Component, Input } from '@angular/core';
import { IArtist, IFestival } from '@blavoss-cswdi/shared/api';

@Component({
  selector: 'blavoss-cswdi-festival-item',
  templateUrl: './festival-item.component.html',
  styleUrls: ['./festival-item.component.css'],
})
export class FestivalItemComponent {
  @Input()
  festival?: IFestival | null;

  @Input()
  artist?: IArtist | null;
}
