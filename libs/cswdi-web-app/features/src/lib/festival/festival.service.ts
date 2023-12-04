/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IFestival } from '@blavoss-cswdi/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@blavoss-cswdi/common';

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

    public addArtistToFestival(festivalId: string, artistId: string, options?: any): Observable<IFestival> {
        console.log(`addArtistToFestival ${this.endpoint}/${festivalId}/artist`);
        return this.http
            .post<ApiResponse<IFestival>>(this.endpoint + '/addArtistToFestival' , {festivalId, artistId},{
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IFestival),
                catchError(this.handleError)
            )
    }

    public removeArtistFromFestival(festivalId: string, artistId: string, options?: any): Observable<IFestival> {
        console.log(`addArtistToFestival ${this.endpoint}/${festivalId}/artist`);
        return this.http
            .post<ApiResponse<IFestival>>(this.endpoint + '/removeArtistFromFestival' , {festivalId, artistId},{
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

    public getRecommendations(userId: string, options?: any): Observable<IFestival[]> {
        console.log(`getRecommendations ${this.endpoint}`);
        return this.http.get<ApiResponse<IFestival[]>>(this.endpoint + '/' + userId + '/recommendations',
        {
            ...options,
            ...httpOptions,
        })
        .pipe(
            tap(console.log),
            map((response: any) => response.results as IFestival[]),
            catchError(this.handleError)
        );
    }

    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }

    public convertImageToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
      
          reader.onloadend = () => {
            // `result` is the base64-encoded string
            const base64String = reader.result as string;
            resolve(base64String);
          };
      
          reader.onerror = (error) => {
            reject(error);
          };
      
          // Read the file as a data URL, which results in a base64-encoded string
          reader.readAsDataURL(file);
        });
      }
}