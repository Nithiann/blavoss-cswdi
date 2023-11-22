/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from local storage
    const token = localStorage.getItem('Authorization');

    // Clone the request and add the Authorization header
    const modifiedRequest = request.clone({
      setHeaders: {
        Authorization: `${token}`
      }
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }
}