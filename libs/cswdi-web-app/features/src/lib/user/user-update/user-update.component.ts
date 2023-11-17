/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Gender } from '@blavoss-cswdi/shared/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blavoss-cswdi-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css'],
})
export class UserUpdateComponent implements OnInit, OnDestroy {

  updateForm: FormGroup;
  genderEnum = Object.values(Gender);
  subscription: Subscription | undefined = undefined;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: ActivatedRoute) {
    this.updateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = params['id'];

      this.subscription = this.userService.read(userId).subscribe((results: any) => {
        console.log(`results: ${results}`);
        this.updateForm?.patchValue({
          email: results.email,
          firstName: results.firstName,
          lastName: results.lastName,
          gender: results.gender
        });
      })
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit(): void {
    throw new Error('Method not implemented.');
  }
}
