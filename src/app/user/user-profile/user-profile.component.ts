import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {filter, map, switchMap} from "rxjs/operators";
import {AuthService} from "../../auth/auth.service";
import {of, Subscription} from "rxjs";
import {UserService} from "../user.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  username!: string;

  private isReady = false;
  private errorMessage: string | null = null;
  private usernameSub!: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public authService: AuthService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.usernameSub = this.route.paramMap
      .pipe(
        map(paramMap => paramMap.get('username')),
      ).subscribe({
        next: username => {
          if (!username) {
            this.router.navigate(['/']);
            return;
          }
          this.username = username;
          this.isReady = true;
        }
      });
  }

}
