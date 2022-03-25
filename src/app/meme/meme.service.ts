import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {MemePageResponseDto, MemeResponseDto} from "./model/memeResponse.dto";
import {Meme, MemePage} from "./model/meme.model";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getMemes(page: number, size: number, options?: { type?: string, publisher?: string }): Observable<MemePage> {
    const url = `${environment.suchDogeApi}/meme`;
    const params = {page, size, ...options};

    return this.http.get<MemePageResponseDto>(url, {params})
      .pipe(
        map(memePageResponseDto => {
          return {
            memes: memePageResponseDto.memes.map(meme => this.memeResponseDtoToMeme(meme)),
            totalCount: memePageResponseDto.totalCount
          };
        })
      );
  }

  postMeme(image: Blob, title: string, description: string): Observable<any> {
    const url = `${environment.suchDogeApi}/meme`;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post(url, formData, {observe: 'response'})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';

          switch (err.error.message) {
            case 'USER_NOT_CONFIRMED':
              message = 'Please, confirm your email before uploading memes';
              break;
          }

          return throwError(message);
        })
      );
  }

  approveMeme(memeId: number): Observable<any> {
    const url = `${environment.suchDogeApi}/meme/approve/${memeId}`
    return this.http.post(url, {}, {observe: 'response'})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';

          switch (err.error.message) {
            case 'MEME_ALREADY_APPROVED':
              message = 'Meme is already approved';
              break;
            case 'USER_NOT_CONFIRMED':
              message = 'Please, confirm your email before approving memes';
              break;
          }

          return throwError(message);
        })
      );
  }

  rejectMeme(memeId: number): Observable<any> {
    const url = `${environment.suchDogeApi}/meme/reject/${memeId}`
    return this.http.delete(url, {observe: 'response'})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';

          switch (err.error.message) {
            case 'MEME_ALREADY_APPROVED':
              message = 'Meme is already approved';
              break;
            case 'USER_NOT_CONFIRMED':
              message = 'Please, confirm your email before approving memes';
              break;
          }

          return throwError(message);
        })
      );
  }

  private memeResponseDtoToMeme(dto: MemeResponseDto): Meme {
    const meme: Meme = {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: this.createImageUrl(dto.imageKey),
      publisherUsername: dto.publisherUsername,
      publishedOn: new Date(dto.publishedOn),
      isApproved: dto.approved
    };
    return meme;
  }

  private createImageUrl(imageKey: string) {
    const objectUrl = `${environment.imageUrlPrefix}/meme/${imageKey}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }
}
