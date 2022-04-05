import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {AuthService} from "../../../auth/auth.service";
import {map, switchMap} from "rxjs/operators";
import {UserAchievements} from "../../model/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-achievements',
  templateUrl: './profile-achievements.component.html',
  styleUrls: ['./profile-achievements.component.css']
})
export class ProfileAchievementsComponent implements OnInit {
  @Input('username') selectedUsername!: string;
  userAchievements!: UserAchievements;

  constructor(private userService: UserService,
              public authService: AuthService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.authService.user.pipe(
      map(authUser => {
        if (this.selectedUsername) {
          return this.selectedUsername;
        }
        return authUser?.username;
      }),
      switchMap(username => this.userService.getUserAchievements(username))
    ).subscribe({
      next: userAchievements => this.userAchievements = userAchievements,
      error: () => this.router.navigate(['/'])
    });
  }

}
