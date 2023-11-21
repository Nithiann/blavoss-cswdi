/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArtist, IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../../artist/artist.service';
import { FestivalService } from '../festival.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-festival-add-artist',
  templateUrl: './festival-add-artist.component.html',
  styleUrls: ['./festival-add-artist.component.css'],
})
export class FestivalAddArtistComponent implements OnInit, OnDestroy{
  artists: IArtist[] | null = null;
  festival: IFestival | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private artistService: ArtistService, private festivalService: FestivalService, private route: ActivatedRoute) {}

  selectArtist(artist: IArtist) {
    console.log(artist);
  }

  ngOnInit(): void {
      this.subscription = this.route.params.subscribe(params => {
        const festivalId = params['id'];

        this.subscription = this.festivalService.read(festivalId).subscribe((results: any) => {
          console.log(`results: ${results}`);
          this.festival = results;
        });
      })

      this.subscription = this.artistService.list().subscribe((result) => {
        this.artists = result;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
