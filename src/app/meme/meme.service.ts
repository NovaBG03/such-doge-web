import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {MemeListResponseDto, MemeResponseDto} from "./model/memeResponse.dto";
import {Meme} from "./model/meme.model";
import {DomSanitizer} from "@angular/platform-browser";
import {MemeCountDto} from "./model/memeCount.dto";
import {MemeMyListResponseDto, MemeMyResponseDto} from "./model/memeMyResponse.dto";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
  }

  getMemesCount(): Observable<number> {
    const url = `${environment.suchDogeApi}/meme/public/count`;
    return this.http.get<MemeCountDto>(url)
      .pipe(
        map(memeCountDto => memeCountDto.count)
      );
  }

  getMyMemesCount(isApproved: boolean, isPending: boolean): Observable<number> {
    const url = `${environment.suchDogeApi}/meme/my/count`;
    return this.http.get<MemeCountDto>(url, {
      params: {
        approved: isApproved,
        pending: isPending
      }
    }).pipe(
      map(memeCountDto => memeCountDto.count)
    );
  }

  getPendingMemesCount(): Observable<number> {
    const url = `${environment.suchDogeApi}/meme/pending/count`;
    return this.http.get<MemeCountDto>(url)
      .pipe(
        map(memeCountDto => memeCountDto.count)
      );
  }

  getMemesPage(page: number, size: number): Observable<Meme[]> {
    const url = `${environment.suchDogeApi}/meme/public`;
    return this.http.get<MemeListResponseDto>(url, {
      params: {
        page: page,
        size: size
      }
    }).pipe(
      map(memeListResponseDto =>
        memeListResponseDto.memes.map(memeResponseDto =>
          this.memeResponseDtoToMeme(memeResponseDto)
        )
      ));
  }

  getMyMemesPage(page: number, size: number, isApproved: boolean, isPending: boolean): Observable<Meme[]> {
    const url = `${environment.suchDogeApi}/meme/my`;
    return this.http.get<MemeMyListResponseDto>(url, {
      params: {
        approved: isApproved,
        pending: isPending,
        page: page,
        size: size
      }
    }).pipe(
      map(memeMyListResponseDto =>
        memeMyListResponseDto.memes.map(memeMyResponseDto =>
          this.memeMyResponseDtoToMeme(memeMyResponseDto)
        )
      ));
  }

  getPendingMemesPage(page: number, size: number): Observable<Meme[]> {
    const url = `${environment.suchDogeApi}/meme/pending`;
    return this.http.get<MemeListResponseDto>(url, {
      params: {
        page: page,
        size: size
      }
    }).pipe(
      map(memeListResponseDto =>
        memeListResponseDto.memes.map(memeResponseDto => {
          const meme = this.memeResponseDtoToMeme(memeResponseDto);
          meme.isApproved = false;
          return meme;
        }))
    );
  }

  postMeme(image: Blob, title: string, description: string): Observable<any> {
    const url = `${environment.suchDogeApi}/meme`;
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post(url, formData, {observe: "response"})
      .pipe(
        catchError(err => {
          let message = 'Something went wrong!';

          // switch (err.error.message) {
          //   case 'ERROR':
          //     message = 'mess';
          //     break;
          // }

          return throwError(message);
        })
      );
  }

  private memeResponseDtoToMeme(dto: MemeResponseDto): Meme {
    const meme: Meme = {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: this.createImageUrl(dto.imageBytes),
      publisherUsername: dto.publisherUsername,
      publishedOn: new Date(dto.publishedOn),
    };
    return meme;
  }

  private memeMyResponseDtoToMeme(dto: MemeMyResponseDto): Meme {
    const meme: Meme = {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: this.createImageUrl(dto.imageBytes),
      publisherUsername: dto.publisherUsername,
      publishedOn: new Date(dto.publishedOn),
      isApproved: dto.approved
    };
    return meme;
  }

  private createImageUrl(imageBytes: string) {
    const objectUrl = 'data:image/png;base64,' + imageBytes;
    return this.sanitizer.bypassSecurityTrustUrl(objectUrl);
  }
}
