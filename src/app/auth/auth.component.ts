import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isRegister = true;
  imageSrc = '';

  private urlSub!: Subscription;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.urlSub = this.route.url
      .pipe(map(urlSegment => urlSegment[0].path))
      .subscribe(url => {
        this.isRegister = url === 'register'
        if (this.isRegister) {
          this.imageSrc = '/assets/images/flying_doge.png';
        } else {
          this.imageSrc = '/assets/images/kawai_doge.jpg';
        }
      });
  }

  ngOnDestroy(): void {
    this.urlSub?.unsubscribe();
  }

  getIllustrationBackground(): string {
    if (!this.isRegister) {
      return '#F9B64B';
    }

    return '#2B2935';
  }
}
