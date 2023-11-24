/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit, OnDestroy {

  createForm: FormGroup;
  genderEnum: Gender[] | null = null;
  subscription: Subscription | undefined = undefined;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) {
    this.createForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required]],
      gender: ['', Validators.required],
    })

    this.createForm.setValidators([this.passwordMatchValidator, this.ageValidator]);
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
  
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
  
  ageValidator(control: AbstractControl): ValidationErrors | null {
      const minimumAge = 12;

      const birthDate = new Date(control.get('dateOfBirth')?.value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();

      return age >= minimumAge ? null : { tooYoung: true };
  }
  
  onSubmit(): void {
    if (!this.createForm.valid) return;
    
    const user: IUser = {
      email: this.createForm.value.email,
      hash: this.createForm.value.password,
      firstName: this.createForm.value.firstName,
      lastName: this.createForm.value.lastName,
      dob: this.createForm.value.dateOfBirth,
      gender: this.createForm.value.gender
    }

    this.subscription = this.userService.create(user).subscribe((resp: any)=> {
      if (resp) 
        this.router.navigate(['/user', resp._id])
    })
  }

  ngOnInit(): void {
    this.genderEnum = Object.values(Gender);
  }
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
