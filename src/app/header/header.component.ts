import {Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {DogeUser} from "../auth/model/user.model";
import {Event} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: Observable<DogeUser | null>;
  isDropDownOpen = false;
  private innerWidth!: number;

  constructor(private authService: AuthService) {
    this.user = authService.user;
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
}
