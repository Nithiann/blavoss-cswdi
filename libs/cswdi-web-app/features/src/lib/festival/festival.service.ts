/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IFestival } from '@blavoss-cswdi/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

export const httpOptions = {
    observable: 'body',
    responseType: 'json',
};

@Injectable()
export class FestivalService {
    endpoint = `${environment.apiUrl}/festival`;

    constructor(private readonly http: HttpClient) {}

    public list(options?: any): Observable<IFestival[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IFestival[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IFestival[]),
                tap(console.log),
                catchError(this.handleError)
            )
    }

    public read(id: string | null, options?: any): Observable<IFestival> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IFestival>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IFestival),
                catchError(this.handleError)
            )
    }

    public create(festival: IFestival, options?: any): Observable<IFestival> {
        console.log(`Festival ${festival}`)
        console.log(`create ${this.endpoint}`);

        return this.http
            .post<ApiResponse<IFestival>>(this.endpoint, festival, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IFestival),
                catchError(this.handleError)
            )
    }

    public remove(id: string | null, options?: any) : Observable<IFestival> {
        console.log(`remove ${this.endpoint}`);
        return this.http
            .delete<ApiResponse<IFestival>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IFestival),
                catchError(this.handleError)
            )
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}