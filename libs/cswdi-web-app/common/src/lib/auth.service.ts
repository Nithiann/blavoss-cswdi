/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiResponse, ILogin, IUser } from "@blavoss-cswdi/shared/api";
import { BehaviorSubject, Observable, Subject, catchError, map, tap, throwError } from "rxjs";
import * as jwtDecode from "jwt-decode";	
import { environment } from "../../../../shared/environments/environments";
import { Injectable } from "@angular/core";
import { authModel } from "./auth.model";

 
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class AuthService {
    endpoint = `${environment.apiUrl}/user`;
    private currentUser = new BehaviorSubject<authModel | null>(null);
    private isLoggedIn = new BehaviorSubject<boolean>(false);
    private authenticationChanged = new Subject<boolean>();

    constructor(private http: HttpClient) {}

    get currentUserValue() {
        return this.currentUser.asObservable();
    }

    get isLoggedInValue() {
        return this.isLoggedIn.asObservable();
    }

    getAuthenticationChanged(): Observable<boolean> {
        return this.authenticationChanged.asObservable();
    }

    public login(creds: ILogin, options?: any): Observable<any> {
        console.log(`login ${this.endpoint}`);
        return this.http
            .post<ApiResponse<IUser>>(this.endpoint + '/login', creds, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results),
                tap((data) => {
                    this.setToken(data.token);
                    const decodedToken = jwtDecode.jwtDecode(data.token) as authModel;
                    this.currentUser.next(decodedToken);
                    this.isLoggedIn.next(true);
                    this.authenticationChanged.next(true);
                }),
                catchError(this.handleError)
            );
    }

    public setToken(token: string): void {
        localStorage.setItem('Authorization', `bearer ${token}`);
    }

    public getToken(): string | null {
        return localStorage.getItem('Authorization')
    }

    public getDecodedToken(): authModel | null {
        const token = this.getToken();

        if (token) {
            try {
                const decoded = jwtDecode.jwtDecode(token) as authModel;
                this.currentUser.next(decoded);
                this.isLoggedIn.next(true);
                return jwtDecode.jwtDecode(token) as authModel;
            } catch (error) {
                console.log(error);
            }
        }

        return null;
    }

    public isAuthenticatedUser(): boolean {
        // Check if the token exists and is not expired
        const token = this.getToken();
        if (token) this.currentUser.next(jwtDecode.jwtDecode(token));
        return !!token && !this.isTokenExpired(token);
    }

    public signOut() {
        this.isLoggedIn.next(false);
        this.currentUser.next(null);
        localStorage.removeItem('Authorization');
        this.authenticationChanged.next(false)
    }
    
    private isTokenExpired(token: string): boolean {
        const decodedToken: any = jwtDecode.jwtDecode(token);
    
        // Check if the token expiration date is in the past
        return decodedToken.exp < Date.now() / 1000;
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}