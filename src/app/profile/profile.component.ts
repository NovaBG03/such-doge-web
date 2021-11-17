import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "./user.service";
import {UserInfo} from "./model/userInfo.model";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo!: UserInfo;

  userInfoForm!: FormGroup;
  passwordsForm!: FormGroup;

  constructor(private authService: AuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.initPasswordsFrom();
    this.userService.getUserInfo()
      .subscribe(userInfo => {
        this.userInfo = userInfo;
        this.initUserFrom();
      });
  }

  private initUserFrom(): void {
    this.userInfoForm = new FormGroup({
      username: new FormControl(this.userInfo.username, [
        Validators.required,
        Validators.minLength(environment.minUsernameLength),
        Validators.maxLength(environment.maxUsernameLength)
      ]),
      email: new FormControl(this.userInfo.email, [
        Validators.required,
        Validators.minLength(environment.minEmailLength),
        Validators.maxLength(environment.maxEmailLength),
        Validators.email
      ]),
      // todo add public key validation
      publicKey: new FormControl(this.userInfo.publicKey, [])
    });
  }

  private initPasswordsFrom() {
    this.passwordsForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl('', []),
      confirmPassword: new FormControl('', []),
    });
  }
}
