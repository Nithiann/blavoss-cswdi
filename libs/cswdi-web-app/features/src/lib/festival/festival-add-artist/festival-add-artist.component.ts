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
  festivalId: string = '';

  constructor(private artistService: ArtistService, private festivalService: FestivalService, private route: ActivatedRoute) {}

  selectArtist(artist: IArtist) {
    console.log(this.festivalId);
    this.subscription = this.festivalService.addArtistToFestival(this.festivalId, artist._id!).subscribe((resp) => {
      console.log(`resp: ${resp}`);

      this.festival!.artists!.push(artist)
      this.artists = this.artists!.filter((a) => a._id !== artist._id);
    })
  }

  deSelectArtist(artist: IArtist) {
    console.log(this.festivalId);
    this.subscription = this.festivalService.removeArtistFromFestival(this.festivalId, artist._id!).subscribe((resp) => {
      console.log(`resp: ${resp}`);
      this.artists!.push(artist);
      this.festival!.artists! = this.festival!.artists!.filter((a) => a._id !== artist._id);
    });
  }

  ngOnInit(): void {
      this.subscription = this.route.params.subscribe(params => {
        this.festivalId = params['id'];

        this.subscription = this.festivalService.read(this.festivalId).subscribe((results: any) => {
          console.log(`results: ${results}`);
          this.festival = results;
        });
      })

      this.subscription = this.artistService.ListNotInFestival(this.festivalId).subscribe((results: any) => {
        console.log(`results: ${results}`);
        this.artists = results;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  
}
