import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genre, IArtist } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../artist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-artist-create',
  templateUrl: './artist-create.component.html',
  styleUrls: ['./artist-create.component.css'],
})
export class ArtistCreateComponent implements OnInit, OnDestroy {

  createForm: FormGroup;
  genreEnum: Genre[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private formBuilder: FormBuilder, private artistService: ArtistService, private router: Router) {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      genre: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required],
    })
  }

  onSubmit(): void {
    if (!this.createForm.valid) return;

    const artist: IArtist = {
      name: this.createForm.value.name,
      genre: this.createForm.value.genre,
      description: this.createForm.value.description,
      image: this.createForm.value.image
    }

    this.subscription = this.artistService.create(artist).subscribe((resp: any) => {
      if (resp) this.router.navigate(['/artist', resp._id])
    })
  }

  ngOnInit(): void {
    this.genreEnum = Object.values(Genre);
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
