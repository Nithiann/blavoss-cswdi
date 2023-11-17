/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId: string | null = null;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private route: ActivatedRoute, private router: Router) {
    this.updateForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.subscription = this.userService.read(this.userId).subscribe((results: any) => {
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
    if (!this.updateForm.valid) return;

    const user: Partial<IUser> = {
      email: this.updateForm.value.email,
      firstName: this.updateForm.value.firstName,
      lastName: this.updateForm.value.lastName,
      gender: this.updateForm.value.gender
    }

    this.subscription = this.userService.update(this.userId, user).subscribe((resp: any)=> {
      if (resp) 
        this.router.navigate(['/user', this.userId])
    });
  }
}
