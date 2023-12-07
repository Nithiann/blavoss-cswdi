/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Genre, IFestival } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FestivalService } from '../festival.service';
import { Router } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-festival-create',
  templateUrl: './festival-create.component.html',
  styleUrls: ['./festival-create.component.css'],
})
export class FestivalCreateComponent implements OnInit, OnDestroy {
  createForm: FormGroup;
  genreEnum: Genre[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private fb: FormBuilder, private festivalService: FestivalService, private router: Router) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      description: ['', Validators.required],
      ticketPrice: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      image: [null, Validators.required],
      genre: ['', Validators.required],
    });
  }

  onFileSelected(event: any): void {
    const fileInput = event.target.files[0];
  
    if (fileInput) {
      this.createForm.patchValue({ image: fileInput });
      this.createForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (!this.createForm.valid) {
      console.log(this.createForm.value);
      console.log('form invalid')
      return;
    }

    const file = this.createForm.get('image')!.value as File;

    if (!(file instanceof File)) {
      console.log('File Input Type:', typeof file);
      return; 
    }

    this.festivalService.convertImageToBase64(file).then((base64) => {
      const festival: IFestival = {
        name: this.createForm.value.name,
        location: this.createForm.value.location,
        startDate: this.createForm.value.startDate,
        endDate: this.createForm.value.endDate,
        description: this.createForm.value.description,
        ticketPrice: this.createForm.value.ticketPrice,
        image: base64,
        genre: this.createForm.value.genre,
      };
      this.subscription = this.festivalService.create(festival).subscribe((resp: any) => {
        this.router.navigate(['/ticket'])
      })
    })
  }

  ngOnInit(): void {
    this.genreEnum = Object.values(Genre);
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
