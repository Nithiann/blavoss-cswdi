/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, ITicket } from '@blavoss-cswdi/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@blavoss-cswdi/common';

export const httpOptions = {
    observable: 'body',
    responseType: 'json',
};

@Injectable()
export class TicketService {
    endpoint = `${environment.apiUrl}/ticket`;

    constructor(private readonly http: HttpClient) {}

    public list(options?: any): Observable<ITicket[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<ITicket[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as ITicket[]),
                tap(console.log),
                catchError(this.handleError)
            )
    }

    public read(id: string | null, options?: any): Observable<ITicket> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<ITicket>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITicket),
                catchError(this.handleError)
            )
    }

    public create(ticket: ITicket, options?: any): Observable<ITicket> {
        console.log(`Tcket ${ticket}`)
        console.log(`create ${this.endpoint}`);

        return this.http
            .post<ApiResponse<ITicket>>(this.endpoint, ticket, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITicket),
                catchError(this.handleError)
            )
    }

    public remove(id: string | null, options?: any) : Observable<ITicket> {
        console.log(`remove ${this.endpoint}`);
        return this.http
            .delete<ApiResponse<ITicket>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as ITicket),
                catchError(this.handleError)
            )
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}