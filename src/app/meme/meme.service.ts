import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class MemeService {
  constructor(private http: HttpClient) {
  }

  postMeme(image: Blob, title: string, description: string): Observable<any> {
    const url = `${environment.suchDogeApi}/meme/test`;
    const formData = new FormData();
    formData.append('image', image);
    console.log("Sending!")
    console.log(image);
    return this.http.post(url, formData);
  }
}
