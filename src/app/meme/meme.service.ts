import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient) {
  }

  postMeme(meme: File, title: string, description: string): Observable<any> {
    const url = `${environment.suchDogeApi}/meme`;
    const body = {title, description};
    return this.http.post(url, body);
  }
}
