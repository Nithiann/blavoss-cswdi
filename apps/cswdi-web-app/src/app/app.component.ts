import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FeaturesModule } from '@blavoss-cswdi/web-app/features';
import { UiModule } from '@blavoss-cswdi/ui';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, FeaturesModule, UiModule],
  selector: 'blavoss-cswdi-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cswdi-web-app';
}
