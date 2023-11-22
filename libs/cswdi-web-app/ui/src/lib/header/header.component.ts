/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@blavoss-cswdi/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'blavoss-cswdi-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any;
  subscription: Subscription | undefined = undefined;
  constructor(private AuthService: AuthService, private route: Router) {
    
  }

  signOut(): void {
    this.AuthService.signOut();
    this.currentUser = null;
    this.route.navigate(['/user/login']);
  }

  ngOnInit(): void {
    this.currentUser = this.AuthService.getDecodedToken();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
