import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArtistService } from './artist.service';
import { environment } from '@blavoss-cswdi/common';
import { Genre, IArtist } from '@blavoss-cswdi/shared/api';

describe('ArtistService', () => {
    let artistService: ArtistService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ArtistService],
        });

        artistService = TestBed.inject(ArtistService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });
    
    it('should be created', inject([ArtistService], (service: ArtistService) => {
        expect(service).toBeTruthy();
    }));

    it('should retrieve artists', async(() => {
        //arrange
        const mockArtists: IArtist[] = [
            { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk },
            { _id: '2', name: 'Artist 2', image: 'image 2', description: 'description 2', genre: Genre.Dubstep },
        ];

        //act
        artistService.list().subscribe((artists: IArtist[] | null) => {
            expect(artists).toEqual(mockArtists);
        });
        
        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist`);
        expect(req.request.method).toEqual('GET');

        req.flush({ results: mockArtists });
    }));

    it('should retrieve an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };
    
        //act
        artistService.read(artistId).subscribe((artist: IArtist) => {
            expect(artist).toEqual(mockArtist);
        });

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        expect(req.request.method).toEqual('GET');

        req.flush({ results: mockArtist });
    }));

    it('should handle errors when retrieving artists', async(() => {
        //arrange
        const errorMessage = 'Http failure response for http://localhost:3000/api/artist: 404 Not Found';

        //act
        artistService.list().subscribe(
            () => fail('Expected an error, but received successful response'),
            (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toBe(errorMessage);
            }
        );

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist`);
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    }));

    it('should handle errors when retrieving an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const errorMessage = 'Http failure response for http://localhost:3000/api/artist/1: 404 Not Found';

        //act
        artistService.read(artistId).subscribe(
            () => fail('Expected an error, but received successful response'),
            (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toBe(errorMessage);
            }
        );

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    }));

    it('should remove an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };

        //act
        artistService.remove(artistId).subscribe((artist: IArtist) => {
            expect(artist).toEqual(mockArtist);
        });

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        expect(req.request.method).toEqual('DELETE');

        req.flush({ results: mockArtist });
    }));

    it('should handle error when removing an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const errorMessage = 'Http failure response for http://localhost:3000/api/artist/1: 404 Not Found';

        //act
        artistService.remove(artistId).subscribe(
            () => fail('Expected an error, but received successful response'),
            (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toBe(errorMessage);
            }
        );

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    }));

    it('should update an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };

        //act
        artistService.update(artistId, mockArtist).subscribe((artist: IArtist) => {
            expect(artist).toEqual(mockArtist);
        });

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        expect(req.request.method).toEqual('PUT');

        req.flush({ results: mockArtist });
    }));

    it('should handle error when updating an artist by ID', async(() => {
        //arrange
        const artistId = '1';
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };
        const errorMessage = 'Http failure response for http://localhost:3000/api/artist/1: 404 Not Found';

        //act
        artistService.update(artistId, mockArtist).subscribe(
            () => fail('Expected an error, but received successful response'),
            (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toBe(errorMessage);
            }
        );

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist/${artistId}`);
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    }));

    it('should create an artist', async(() => {
        //arrange
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };

        //act
        artistService.create(mockArtist).subscribe((artist: IArtist) => {
            expect(artist).toEqual(mockArtist);
        });
        
        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist`);
        expect(req.request.method).toEqual('POST');

        req.flush({ results: mockArtist });
    }));

    it('should handle error when creating an artist', async(() => {
        //arrange
        const mockArtist: IArtist = { _id: '1', name: 'Artist 1', image: 'image 1', description: 'description 1', genre: Genre.ElectroFolk };
        const errorMessage = 'Http failure response for http://localhost:3000/api/artist: 404 Not Found';

        //act
        artistService.create(mockArtist).subscribe(
            () => fail('Expected an error, but received successful response'),
            (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toBe(errorMessage);
            }
        );

        //assert
        const req = httpTestingController.expectOne(`${environment.apiUrl}/artist`);
        req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    }));
})