import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArtist } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../artist.service';

@Component({
  selector: 'blavoss-cswdi-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
})
export class ArtistListComponent implements OnInit, OnDestroy {
  artists: IArtist[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
      this.subscription = this.artistService.list().subscribe((result) => {
        this.artists = result;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
