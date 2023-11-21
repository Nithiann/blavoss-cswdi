/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Genre, IArtist } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { ArtistService } from '../artist.service';

@Component({
  selector: 'blavoss-cswdi-artist-update',
  templateUrl: './artist-update.component.html',
  styleUrls: ['./artist-update.component.css'],
})
export class ArtistUpdateComponent implements OnInit, OnDestroy {

  updateForm: FormGroup;
  genreEnum = Object.values(Genre);
  subscription: Subscription | undefined = undefined;
  artistId: string | null = null;

  constructor(private fb: FormBuilder, private artistService: ArtistService, private route: ActivatedRoute, private router: Router) {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      genre: ['', Validators.required],
      image: [null, Validators.required]
    })
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.artistId = params['id'];
      this.subscription = this.artistService.read(this.artistId).subscribe((results: any) => {
        console.log(`results: ${results}`);
        this.updateForm?.patchValue({
          name: results.name,
          description: results.description,
          genre: results.genre
        });
      })
    })
  }

  onFileSelected(event: any): void {
    const fileInput = event.target.files[0];
  
    if (fileInput) {
      this.updateForm.patchValue({ image: fileInput });
      this.updateForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void { 
    if (!this.updateForm.valid) return;
    const file = this.updateForm.get('image')!.value as File;

    if (!(file instanceof File)) {
      console.log('File Input Type:', typeof file);
      return; 
    }

    this.artistService.convertImageToBase64(file).then((base64) => {
      const artist: IArtist = {
        name: this.updateForm.value.name,
        genre: this.updateForm.value.genre,
        description: this.updateForm.value.description,
        image: base64,
      };
      this.subscription = this.artistService.create(artist).subscribe((resp: any) => {
        if (resp) this.router.navigate(['/artist', this.artistId]);
      })
    })
    .catch((err) => {
      console.log(err.message);
    })
  }
}
