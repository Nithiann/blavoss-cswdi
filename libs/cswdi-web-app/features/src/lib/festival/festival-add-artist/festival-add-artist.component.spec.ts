import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FestivalAddArtistComponent } from './festival-add-artist.component';

describe('FestivalAddArtistComponent', () => {
  let component: FestivalAddArtistComponent;
  let fixture: ComponentFixture<FestivalAddArtistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FestivalAddArtistComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FestivalAddArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
