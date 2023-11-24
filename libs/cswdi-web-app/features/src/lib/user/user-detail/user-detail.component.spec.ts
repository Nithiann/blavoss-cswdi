import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserDetailComponent } from './user-detail.component';
import { UserService } from '../user.service';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';

const mockUser: IUser = {
    email: 'john.doe@gmail.com',
    hash: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date(12, 8, 1999),
    gender: Gender.Male,
}

jest.mock('../user.service');

describe('UserDetailComponent', () => {
    let component: UserDetailComponent;
    let fixture: ComponentFixture<UserDetailComponent>;
    let userServiceMock: jest.Mocked<UserService>;
    let activatedRouteMock: Partial<ActivatedRoute>;
  
    beforeEach(waitForAsync(() => {
      activatedRouteMock = {
        params: of({ id: '123' }), // Provide a mock ActivatedRoute with a user ID
      };
  
      TestBed.configureTestingModule({
        declarations: [UserDetailComponent],
        providers: [
          UserService,
          { provide: ActivatedRoute, useValue: activatedRouteMock },
        ],
      }).compileComponents();
  
      fixture = TestBed.createComponent(UserDetailComponent);
      component = fixture.componentInstance;
      userServiceMock = TestBed.inject(UserService) as jest.Mocked<UserService>;
      userServiceMock.read.mockReturnValue(of(mockUser));
  
      fixture.detectChanges();
    }));
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('should call UserService.read with the correct user ID', () => {
      expect(userServiceMock.read).toHaveBeenCalledWith('123');
    });
  
    it('should set user data on successful service call', () => {
      expect(component.user).toEqual(mockUser);
    });
  
    afterEach(() => {
      fixture.destroy();
    });
  });