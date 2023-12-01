import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FestivalItemComponent } from './festival-item.component';

describe('FestivalItemComponent', () => {
  let component: FestivalItemComponent;
  let fixture: ComponentFixture<FestivalItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestivalItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FestivalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
