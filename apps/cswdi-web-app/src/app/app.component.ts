/* eslint-disable @nx/enforce-module-boundaries */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ArtistModule, FestivalsModule, TicketsModule, UserModule } from '@blavoss-cswdi/web-app/features';
import { UiModule } from '@blavoss-cswdi/ui';

@Component({
  standalone: true,
  imports: [RouterModule, UiModule, UserModule, ArtistModule, FestivalsModule, TicketsModule],
  selector: 'blavoss-cswdi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cswdi-web-app';
}
