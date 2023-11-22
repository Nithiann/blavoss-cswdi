/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ILogin } from '@blavoss-cswdi/shared/api';
import { AuthService } from '@blavoss-cswdi/common';
import { Router } from '@angular/router';

@Component({
  selector: 'blavoss-cswdi-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnDestroy {
  loginForm: FormGroup;
  subscription: Subscription | undefined = undefined;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {
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

    this.subscription = this.authService.login(login).subscribe((results: any) => {
      const token = results.token;

      localStorage.setItem('Authorization', `Bearer ${token}`);

      this.route.navigate(['/festival'])
    })
  }
  
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
