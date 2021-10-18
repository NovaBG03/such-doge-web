import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient) {
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
}
