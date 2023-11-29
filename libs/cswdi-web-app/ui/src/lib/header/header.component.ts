/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@blavoss-cswdi/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blavoss-cswdi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  isAuthenticated: boolean = false;
  subscription: Subscription | undefined = undefined;
  isDropdownVisible : boolean = false;
  constructor(private authService: AuthService, private route: Router) {
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated = this.authService.isAuthenticatedUser();
        if (this.isAuthenticated) {
          this.currentUser = this.authService.getDecodedToken();
        }
      }
    });
  
    // Subscribe to changes in authentication status
    this.authService.getAuthenticationChanged().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.currentUser = this.authService.getDecodedToken();
      } else {
        this.currentUser = null;
      }
    });
  }

  

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  signOut(): void {
    this.authService.signOut();
    this.isAuthenticated = false;
    this.currentUser = null;
    this.isDropdownVisible = false;
    this.route.navigate(['/user/login']);
  }

  ngOnInit(): void {
    console.log('hello');
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
