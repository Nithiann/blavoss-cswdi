import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketPayComponent } from './ticket-pay.component';

describe('TicketPayComponent', () => {
  let component: TicketPayComponent;
  let fixture: ComponentFixture<TicketPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketPayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
