/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Retrieve the token from local storage
        const token = this.authService.getToken();
        if (token) {
            const modifiedRequest = request.clone({
            setHeaders: {
                Authorization: `${token}`
            }
            });
            return next.handle(modifiedRequest);
        }

        return next.handle(request);
    }
}