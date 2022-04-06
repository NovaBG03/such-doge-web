import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {MemePageResponseDto, MemeDto} from "./model/meme.dto";
import {Meme, MemeFilter, MemePage} from "./model/meme.model";
import {DomSanitizer} from "@angular/platform-browser";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getMemes(page: number, size: number, options?: MemeFilter): Observable<MemePage> {
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
    const url = `${environment.suchDogeApi}/meme/reject/${memeId}`;
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


  deleteMeme(memeId: number): Observable<any> {
    const url = `${environment.suchDogeApi}/meme/${memeId}`;
    return this.http.delete(url, {observe: 'response'})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';

          switch (err.error.message) {
            case 'CAN_NOT_DELETE_FOREIGN_MEME':
              message = 'You don\'t have permission to delete this meme';
              break;
            case 'USER_NOT_CONFIRMED':
              message = 'Please, confirm your email before deleting memes';
              break;
          }

          return throwError(message);
        })
      );
  }

  private memeResponseDtoToMeme(dto: MemeDto): Meme {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: this.createImageUrl(dto.imageKey),
      publisherUsername: dto.publisherUsername,
      publishedOn: new Date(dto.publishedOn),
      isApproved: dto.approved
    };
  }

  private createImageUrl(imageKey: string) {
    const objectUrl = `${environment.imageUrlPrefix}/meme/${imageKey}`;
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }
}
