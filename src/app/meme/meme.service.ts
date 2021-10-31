import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";
import {MemeListResponseDto, MemeResponseDto} from "./model/memeResponse.dto";
import {Meme} from "./model/meme.model";
import {DomSanitizer} from "@angular/platform-browser";
import {MemeCountDto} from "./model/memeCount.dto";

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
    return this.http.get<MemeListResponseDto>(url, {
      params: {
        approved: isApproved,
        pending: isPending,
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
    const objectUrl = 'data:image/png;base64,' + dto.imageBytes;
    const imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);

    const meme: Meme = {
      id: dto.id,
      title: dto.title,
      description: dto.description,
      imageUrl: imageUrl,
      publisherUsername: dto.publisherUsername,
      publishedOn: new Date(dto.publishedOn)
    };
    return meme;
  }
}
