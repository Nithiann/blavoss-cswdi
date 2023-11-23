import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '@blavoss-cswdi/common';
import { Gender, IUser } from '@blavoss-cswdi/shared/api';

describe('UserService', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should retrieve users', async(() => {
        const mockUsers: IUser[] = [
            { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male },
            { _id: '2', email: 'jane.doe@gmail.com', hash: '123', firstName: 'Jane', lastName: 'Doe', dob: new Date(11, 6, 1987), gender: Gender.Female },
        ];

        userService.list().subscribe((users: IUser[] | null) => {
            expect(users).toEqual(mockUsers);
        });

        const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
        expect(req.request.method).toEqual('GET');

        req.flush({ results: mockUsers });
  }));

  it('should retrieve a user by ID', async(() => {
    const userId = '1';
    const mockUser: IUser = { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };

    userService.read(userId).subscribe((user: IUser) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    expect(req.request.method).toEqual('GET');

    req.flush({ results: mockUser });
  }));

  it('should handle errors when retrieving users', async(() => {
    const errorMessage = 'Http failure response for http://localhost:3000/api/user: 500 Server Error';

    userService.list().subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  }));

  it('should handle errors when retrieving a user by ID', async(() => {
    const userId = '1';
    const errorMessage = 'Http failure response for http://localhost:3000/api/user/1: 404 Not Found';

    userService.read(userId).subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  }));

});