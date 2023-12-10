/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, authModel } from '@blavoss-cswdi/common';
import { ITicket } from '@blavoss-cswdi/shared/api';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'blavoss-cswdi-ticket-pay',
  templateUrl: './ticket-pay.component.html',
  styleUrls: ['./ticket-pay.component.css'],
})
export class TicketPayComponent implements OnInit, OnDestroy {

  paymentForm: FormGroup;
  festival: any | null = null;
  user: authModel | null = null;
  subscription: Subscription | undefined = undefined;
  ticket: ITicket | null = null;
  constructor(
    private authService: AuthService,
    private ticketService: TicketService,  
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      name: ['', Validators.required],
      userId: ['', Validators.required],
      festivalId: ['', Validators.required],
      ticketAmount: [null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    })
  }

  ngOnInit(): void {
    this.user = this.authService.getDecodedToken();
    this.subscription = this.route.queryParams.subscribe((params) => {
      this.festival = JSON.parse(params['festival']);

      this.paymentForm?.patchValue({
        name: this.festival.name,
        festivalId: this.festival,
        userId: this.user!.sub
      });

    });
  }

  onSubmit(): void {
    console.log(this.paymentForm.value);
    if (this.paymentForm.invalid) return;
    this.ticketService.create(this.paymentForm.value).subscribe((resp: any) => {
      this.showToast();
      this.router.navigate(['/user', this.user!.sub]);
    })
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private showToast() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'Tickets bought. Please Personalize in profile.'});
  }
}
