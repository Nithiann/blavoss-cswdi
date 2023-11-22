/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { ApiResponse, ILogin, IUser } from "@blavoss-cswdi/shared/api";
import { Observable, catchError, map, throwError } from "rxjs";
import * as jwtDecode from "jwt-decode";	
import { environment } from "../environments/environments";
import { Injectable } from "@angular/core";

export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

@Injectable()
export class AuthService {
    endpoint = `${environment.apiUrl}/user`;
    constructor(private http: HttpClient) {}

    public login(creds: ILogin, options?: any): Observable<any> {
        console.log(`login ${this.endpoint}`);
        return this.http
            .post<ApiResponse<IUser>>(this.endpoint + '/login', creds, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results),
                catchError(this.handleError)
            );
    }

    public setToken(token: string): void {
        localStorage.setItem('Authorization', token);
    }

    public getToken(): string | null {
        return localStorage.getItem('Authorization')
    }

    public getDecodedToken(): any | null {
        const token = this.getToken();

        if (token) {
            try {
                return jwtDecode.jwtDecode(token);
            } catch (error) {
                console.log(error);
            }
        }
    }

    public isAuthenticatedUser(): boolean {
        // Check if the token exists and is not expired
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    public signOut() {
        localStorage.removeItem('Authorization');
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