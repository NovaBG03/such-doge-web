import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {AuthService} from "../../../auth/auth.service";
import {map, switchMap} from "rxjs/operators";
import {UserAchievements} from "../../model/user.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile-achievements',
  templateUrl: './profile-achievements.component.html',
  styleUrls: ['./profile-achievements.component.css']
})
export class ProfileAchievementsComponent implements OnInit {
  @Input('username') selectedUsername!: string;
  achievements!: UserAchievements;

  constructor(private userService: UserService,
              private authService: AuthService,
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
      next: achievements => this.achievements = achievements,
      error: () => this.router.navigate(['/'])
    });
  }

}
