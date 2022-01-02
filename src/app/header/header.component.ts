import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Observable, Subscription} from "rxjs";
import {DogeUser} from "../auth/model/user.model";
import {Event} from "@angular/router";
import {UserService} from "../profile/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user!: DogeUser | null;
  isDropDownOpen = false;
  private userSub!: Subscription;
  private innerWidth!: number;

  constructor(private authService: AuthService, public userService: UserService) {
    this.userSub = authService.user
      .subscribe(user => this.user = user);
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
  }

  isMobile(): boolean {
    return !!this.innerWidth && this.innerWidth <= 768 && this.isDropDownOpen;
  }

  toggleDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  closeDropDown() {
    this.isDropDownOpen = false;
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
  }
}
