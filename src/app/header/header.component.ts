import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Observable} from "rxjs";
import {DogeUser} from "../auth/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: Observable<DogeUser | null>;
  isDropDownOpen = false;

  constructor(private authService: AuthService) {
    this.user = authService.user;
  }

  ngOnInit(): void {
  }

  openDropDown(): void {
    this.isDropDownOpen = true;
  }

  toggleDropDown() {
    this.isDropDownOpen = !this.isDropDownOpen;
  }

  closeDropDown() {
    this.isDropDownOpen = false;
  }
}
