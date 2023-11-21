/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IArtist } from '@blavoss-cswdi/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

export const httpOptions = {
    observable: 'body',
    responseType: 'json',
};

@Injectable()
export class ArtistService {
    endpoint = `${environment.apiUrl}/artist`;

    constructor(private readonly http: HttpClient) {}

    public list(options?: any): Observable<IArtist[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IArtist[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IArtist[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    public read(id: string | null, options?: any): Observable<IArtist> {
        console.log(`read ${this.endpoint}`);
        return this.http
            .get<ApiResponse<IArtist>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IArtist),
                catchError(this.handleError)
            );
    }

    public create(artist: IArtist, options?: any): Observable<IArtist> {
        console.log(`Artist ${artist}`)
        console.log(`create ${this.endpoint}`);

        return this.http
            .post<ApiResponse<IArtist>>(this.endpoint, artist, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IArtist),
                catchError(this.handleError)
            );
    }

    public update(id: string | null, artist: Partial<IArtist>, options?: any): Observable<IArtist> {
        console.log(`update ${this.endpoint}`);
        return this.http
            .put<ApiResponse<IArtist>>(this.endpoint + '/' + id, artist, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IArtist),
                catchError(this.handleError)
            );
    }

    public remove(id: string | null, options?: any): Observable<IArtist> {
        console.log(`remove ${this.endpoint}`);
        return this.http
            .delete<ApiResponse<IArtist>>(this.endpoint + '/' + id, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IArtist),
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