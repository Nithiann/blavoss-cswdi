/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArtist } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../artist.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.css'],
})
export class ArtistDetailComponent implements OnInit, OnDestroy {

  artist: IArtist | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private artistService: ArtistService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      const artistId = params['id'];

      this.subscription = this.artistService.read(artistId).subscribe((results: any) => {
        console.log(`results: ${results}`);
        this.artist = results;
      })
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
