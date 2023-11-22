/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ILogin } from '@blavoss-cswdi/shared/api';

@Component({
  selector: 'blavoss-cswdi-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription | undefined = undefined;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }
  
  onSubmit() : void {
    const login: ILogin = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    }

    this.subscription = this.userService.login(login).subscribe((results: any) => {
      const token = results.token;

      localStorage.setItem('Authorization', `Bearer ${token}`);
    })
  }
  
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
