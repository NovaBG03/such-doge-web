import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "./user.service";
import {UserInfo} from "./model/userInfo.model";
import {environment} from "../../environments/environment";
import * as CustomValidators from "../util/validation/custom-validator.functions";
import {PopUpModel} from "../util/pop-up/pop-up-model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userInfo!: UserInfo;

  userInfoForm!: FormGroup;
  passwordsForm!: FormGroup;

  errorPopUpModel!: PopUpModel;
  successPopUpModel!: PopUpModel;
  isReady = false;

  get isUserInfoChanged(): boolean {
    return this.isUsernameChanged
      || this.isEmailChanged
      || this.isPublicKeyChanged;
  }

  get isUsernameChanged(): boolean {
    return this.userInfo.username !== this.username.value;
  }

  get isEmailChanged(): boolean {
    return this.userInfo.email !== this.email.value;
  }

  get isPublicKeyChanged(): boolean {
    return (this.userInfo.publicKey ?? '') !== (this.publicKey.value ?? '');
  }

  get username(): AbstractControl {
    return this.userInfoForm.get('username') as AbstractControl;
  }

  get email(): AbstractControl {
    return this.userInfoForm.get('email') as AbstractControl;
  }

  get publicKey(): AbstractControl {
    return this.userInfoForm.get('publicKey') as AbstractControl;
  }

  get currentPass(): AbstractControl {
    return this.passwordsForm.get('current') as AbstractControl;
  }

  get newPass(): AbstractControl {
    return this.passwordsForm.get('new') as AbstractControl;
  }

  get confirmPass(): AbstractControl {
    return this.passwordsForm.get('confirm') as AbstractControl;
  }

  constructor(private authService: AuthService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.initSuccessPopUp();
    this.initErrorPopUp();
    this.initPasswordsFrom();
    this.userService.getUserInfo()
      .subscribe(userInfo => {
        this.userInfo = userInfo;
        this.initUserFrom();
      });
  }

  updateUserInfo(): void {
    if (this.userInfoForm.invalid || !this.isUserInfoChanged) {
      this.errorPopUpModel.description = "Don't try to cheat";
      return;
    }

    this.userService.updateUserInfo({
      email: this.isEmailChanged ? this.email.value : null,
      publicKey: this.isPublicKeyChanged ? this.publicKey.value : null
    }).subscribe(
      userInfo => {
        this.userInfo = userInfo;
        this.resetUserInfoForm();
        this.successPopUpModel.message = 'Your profile info has been <span class="success-colored-text">updated successfully</span>';
        this.isReady = true;
      },
      error => this.errorPopUpModel.description = error
    );
  }

  changePassword(): void {
    if (this.passwordsForm.invalid) {
      this.errorPopUpModel.description = "Don't try to cheat";
      return;
    }

    this.userService.changePassword({
      oldPassword: this.currentPass.value,
      newPassword: this.newPass.value,
      confirmPassword: this.newPass.value
    }).subscribe(
      () => {
        this.resetPasswordsForm();
        this.successPopUpModel.message = 'Your password has been <span class="success-colored-text">changed successfully</span>';
        this.isReady = true;
      },
      error => this.errorPopUpModel.description = error
    );
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

  private resetUserInfoForm() {
    this.userInfoForm.reset({
      username: this.userInfo.username,
      email: this.userInfo.email,
      publicKey: this.userInfo.publicKey
    })
  }

  private initPasswordsFrom() {
    this.passwordsForm = new FormGroup({
        current: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50)
        ]),
        new: new FormControl('', [
          Validators.required,
          Validators.minLength(environment.minPasswordLength),
          Validators.maxLength(environment.maxPasswordLength),
          CustomValidators.hasDigitsValidator(),
          CustomValidators.hasAlphabeticCharacters()
        ]),
        confirm: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          CustomValidators.hasDigitsValidator(),
          CustomValidators.hasAlphabeticCharacters()
        ]),
      },
      [CustomValidators.isPasswordConfirmedValidator('new', 'confirm')]);
  }

  private resetPasswordsForm(): void {
    this.passwordsForm.reset({
      current: '',
      new: '',
      confirm: ''
    });
  }

  private initErrorPopUp(): void {
    this.errorPopUpModel = {
      bannerPath: 'assets/svgs/error-cross.svg',
      message: 'Error',
      description: '',
      buttonText: 'Continue',
      buttonStyle: 'danger'
    }
  }

  private initSuccessPopUp() {
    this.successPopUpModel = {
      bannerPath: 'assets/svgs/success-tick.svg',
      message: '',
      description: 'Click below to continue',
      buttonText: 'Continue',
      buttonStyle: 'success'
    }
  }
}
