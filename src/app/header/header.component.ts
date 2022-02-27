import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {DogeUser} from "../auth/model/user.model";
import {UserService} from "../profile/user.service";
import {WalletService} from "../wallet/wallet.service";
import {Balance} from "../wallet/wallet.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  user!: DogeUser | null;
  isDropDownOpen = false;
  balance: Balance | null = null;
  private userSub!: Subscription;
  private innerWidth!: number;

  constructor(private authService: AuthService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;

    this.userSub = this.authService.user
      .subscribe(user => this.user = user);
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
