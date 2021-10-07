import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {concatMap, map} from "rxjs/operators";
import {AuthService} from "../auth.service";
import {throwError} from "rxjs";

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.css']
})
export class ActivationComponent implements OnInit {
  isReady = true;
  errorMessage = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit(): void {
    // this.route.paramMap
    //   .pipe(
    //     map(paramMap => paramMap.get('token')),
    //     concatMap(token => {
    //       if (!token) {
    //         return throwError('Invalid token!')
    //       }
    //       return this.authService.activate(token);
    //     })
    //   ).subscribe(
    //   () => this.isReady = true,
    //   err => {
    //     this.errorMessage = err;
    //     this.isReady = true;
    //   }
    // );
  }

}
