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
        //arrange
        const mockUsers: IUser[] = [
            { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male },
            { _id: '2', email: 'jane.doe@gmail.com', hash: '123', firstName: 'Jane', lastName: 'Doe', dob: new Date(11, 6, 1987), gender: Gender.Female },
        ];

        //act
        userService.list().subscribe((users: IUser[] | null) => {
            expect(users).toEqual(mockUsers);
        });

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
        expect(req.request.method).toEqual('GET');

        req.flush({ results: mockUsers });
  }));

  it('should retrieve a user by ID', async(() => {
    //arrange
    const userId = '1';
    const mockUser: IUser = { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };

    //act
    userService.read(userId).subscribe((user: IUser) => {
      expect(user).toEqual(mockUser);
    });

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    expect(req.request.method).toEqual('GET');

    req.flush({ results: mockUser });
  }));

  it('should handle errors when retrieving users', async(() => {
    //arrange
    const errorMessage = 'Http failure response for https://blavoss-cswdi-api.azurewebsites.net/api/user: 500 Server Error';

    //act
    userService.list().subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  }));

  it('should handle errors when retrieving a user by ID', async(() => {
    //arrange
    const userId = '1';
    const errorMessage = 'Http failure response for https://blavoss-cswdi-api.azurewebsites.net/api/user/1: 404 Not Found';

    //act
    userService.read(userId).subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  }));

  it('should remove a user by ID', async(() => {
    //arrange
    const userId = '1';
    const mockUser: IUser = { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };

    //act
    userService.remove(userId).subscribe((user: IUser) => {
      expect(user).toEqual(mockUser);
    });

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    expect(req.request.method).toEqual('DELETE');

    req.flush({ results: mockUser });
  }));

  it('should handle errors when removing a user by ID', async(() => {
    //arrange
    const userId = '1';
    const errorMessage = 'Http failure response for https://blavoss-cswdi-api.azurewebsites.net/api/user/1: 404 Not Found';

    //act
    userService.remove(userId).subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  }));

  it('should update a user by ID', async(() => {
    //arrange
    const userId = '1';
    const updatedUserData: Partial<IUser> = { email: 'john.doe@gmail.com' };
    const mockUpdatedUser: IUser = { _id: userId, email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };

    //act
    userService.update(userId, updatedUserData).subscribe((updatedUser: IUser) => {
      expect(updatedUser).toEqual(mockUpdatedUser);
    });

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedUserData);

    req.flush({ results: mockUpdatedUser });
  }));

  it('should handle errors when updating a user by ID', async(() => {
    //arrange
    const userId = '1';
    const updatedUserData: Partial<IUser> = { email: 'john.doe@gmail.com' };
    const errorMessage = 'Http failure response for https://blavoss-cswdi-api.azurewebsites.net/api/user/1: 404 Not Found';

    //act
    userService.update(userId, updatedUserData).subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    );

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/${userId}`);
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
  }));

  it('should create a new user', async(() => {
    //arrange
    const newUser: IUser = { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };
    const mockCreatedUser: IUser = {...newUser};

    //act
    userService.create(newUser).subscribe((createdUser) => {
        expect(createdUser).toEqual(mockCreatedUser)
    });

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newUser);

    req.flush({results: mockCreatedUser})
  }));


  it('Should handle errors when creating a new user', async(() => {
    //arrange
    const newUser: IUser = { _id: '1', email: 'voss.bas@gmail.com', hash: '123', firstName: 'Bas', lastName: 'Voss', dob: new Date(12, 8, 1999), gender: Gender.Male };
    const errorMessage = 'Http failure response for https://blavoss-cswdi-api.azurewebsites.net/api/user: 500 Server Error';

    //act
    userService.create(newUser).subscribe(
      () => fail('Expected an error, but received successful response'),
      (error) => {
        expect(error).toBeTruthy();
        expect(error.message).toBe(errorMessage);
      }
    )

    //assert
    const req = httpTestingController.expectOne(`${environment.apiUrl}/user`);
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  }));
});