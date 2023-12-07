/* eslint-disable @typescript-eslint/no-explicit-any */
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

  onFileSelected(event: any): void {
    const fileInput = event.target.files[0];
  
    if (fileInput) {
      this.createForm.patchValue({ image: fileInput });
      this.createForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (!this.createForm.valid) return;

    const file = this.createForm.get('image')!.value as File;

    if (!(file instanceof File)) {
      console.log('File Input Type:', typeof file);
      return; 
    }

    this.artistService.convertImageToBase64(file).then((base64) => {
      const artist: IArtist = {
        name: this.createForm.value.name,
        genre: this.createForm.value.genre,
        description: this.createForm.value.description,
        image: base64,
      };
      this.subscription = this.artistService.create(artist).subscribe((resp: any) => {
        this.router.navigate(['/artist', resp._id]);
      })
    })
    .catch((err) => {
      console.log(err.message);
    })
  }

  ngOnInit(): void {
    this.genreEnum = Object.values(Genre);
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
