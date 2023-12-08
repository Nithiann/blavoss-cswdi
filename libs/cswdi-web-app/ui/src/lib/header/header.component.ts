/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@blavoss-cswdi/common';
import { userRole } from '@blavoss-cswdi/shared/api';
import { MenuItem, PrimeIcons } from 'primeng/api';
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
  items: MenuItem[] | undefined;
  constructor(private authService: AuthService, private route: Router) {
    
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
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAuthenticated = this.authService.isAuthenticatedUser();
        if (this.isAuthenticated) {
          this.currentUser = this.authService.getDecodedToken();
          this.items = this.createMenu();
        }
      }
    });
  
    // Subscribe to changes in authentication status
    this.authService.getAuthenticationChanged().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.currentUser = this.authService.getDecodedToken();
        this.items = this.createMenu();
      } else {
        this.currentUser = null;
      }
    });
    
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private createMenu() {
    if (this.currentUser?.role === userRole.Admin) {
      return [
        {
          label: 'Profile',
          styleClass: 'mb-4 hover:text-gray-300',
          icon: PrimeIcons.USER,
          routerLink: ['/user', this.currentUser?.sub],
        },
        ...this.createAdminMenu(),
        {
          label: 'Sign out',
          styleClass: 'hover:text-gray-300',
          icon: PrimeIcons.SIGN_OUT,
          command: () => {
            this.signOut();
          },
        },
      ];
    } else {
      return [
        {
          label: 'Profile',
          styleClass: 'mb-4 hover:text-gray-300',
          icon: PrimeIcons.USER,
          routerLink: ['/user', this.currentUser?.sub],
        },
        {
          label: 'Sign out',
          styleClass: 'hover:text-gray-300',
          command: () => {
            this.signOut();
          },
        },
      ];
    }
    
  }

  private createAdminMenu() {
    return [
      {
        label: 'User management',
        styleClass: 'mb-2 hover:text-gray-300',
        routerLink: ['/user'],
      },
      {
        label: 'Artist management',
        styleClass: 'mb-2 hover:text-gray-300',
        routerLink: ['/artist'],
      },
      {
        label: 'Festival management',
        styleClass: 'mb-4 hover:text-gray-300',
        routerLink: ['/festival'],
      }
    ]
  }
}
