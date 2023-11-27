import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketListingComponent } from './ticket-listing.component';

describe('TicketListingComponent', () => {
  let component: TicketListingComponent;
  let fixture: ComponentFixture<TicketListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketListingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
