import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { UserCreateComponent } from './user-create.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';

const user: IUser = {
    email: 'john.doe@gmail.com',
    hash: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    dob: new Date(12, 8, 1999),
    gender: Gender.Male,
}

jest.mock('../user.service');

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserCreateComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, HttpClientModule],
      providers: [UserService],
    });

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    userServiceMock = TestBed.inject(UserService) as jest.Mocked<UserService>;
    userServiceMock.create.mockReturnValue(of(user));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.createForm.get('email')).toBeTruthy();
  });

  it('should call UserService.create when form is submitted', () => {
    // Set form values
    component.createForm.setValue({
      email: 'john.doe@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01', // Add a valid date
      gender: 'Male', // Add a valid gender
    });

    // Trigger form submission
    component.onSubmit();

    // Expect UserService.create to have been called with the correct user object
    expect(userServiceMock.create).toHaveBeenCalledWith({
      email: 'john.doe@gmail.com',
      hash: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      dob: '1990-01-01',
      gender: 'Male',
    });

  });

  afterEach(() => {
    fixture.destroy();
  });
});