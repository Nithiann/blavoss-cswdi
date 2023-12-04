import { Component, OnDestroy, OnInit } from '@angular/core';
import { IArtist } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../artist.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'blavoss-cswdi-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css'],
})
export class ArtistListComponent implements OnInit, OnDestroy {
  artists: IArtist[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private artistService: ArtistService, private messageService: MessageService) {}


  delete(id: string | undefined) {
    this.subscription = this.artistService.remove(id!).subscribe((resp)=> {
      console.log(`resp: ${resp}`);
        if (this.artists)
          this.artists = this.artists?.filter(artist => artist._id !== id);

        this.showToast();
    })
  }
  ngOnInit(): void {
      this.subscription = this.artistService.list().subscribe((result) => {
        this.artists = result;
      })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private showToast() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Artist Deleted'});
  }
}
