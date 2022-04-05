import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {tap} from "rxjs/operators";
import {environment} from "../../../../environments/environment";
import * as CustomValidators from "../../../util/validation/custom-validator.functions";
import {AuthService} from "../../../auth/auth.service";
import {UserService} from "../../user.service";
import {UserInfo} from "../../model/user.model";
import {AlertService} from "../../../util/alert/alert.service";

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  styleUrls: ['./settings-form.component.css']
})
export class SettingsFormComponent implements OnInit {
  userInfo!: UserInfo;

  userInfoForm!: FormGroup;
  passwordsForm!: FormGroup;

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

  constructor(private authService: AuthService,
              private userService: UserService,
              private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.initPasswordsFrom();

    this.userService.getUserInfo()
      .subscribe(userInfo => {
        this.userInfo = userInfo;
        this.initUserFrom();
      });
  }

  updateUserInfo(): void {
    if (this.userInfoForm.invalid || !this.isUserInfoChanged) {
      this.alertService.showErrorAlert("Don't try to cheat");
      return;
    }

    this.userService.updateUserInfo({
      email: this.isEmailChanged ? this.email.value : null,
      publicKey: this.isPublicKeyChanged ? this.publicKey.value : null
    }).pipe(
      tap(() => {
        if (this.isEmailChanged) {
          this.authService.refresh();
        }
      })
    ).subscribe(
      response => {
        this.userInfo = response.userInfo;
        if (response.errors && response.errors.length > 0) {
          this.alertService.showErrorAlert(response.errors[0]);
          return;
        }
        this.resetUserInfoForm();
        this.alertService.showSuccessAlert(
          'Your profile info has been <span class="success-colored-text">updated successfully</span>',
          'Click below to continue');
      },
      error => this.alertService.showErrorAlert(error)
    );
  }

  changePassword(): void {
    if (this.passwordsForm.invalid) {
      this.alertService.showErrorAlert("Don't try to cheat");
      return;
    }

    this.userService.changePassword({
      oldPassword: this.currentPass.value,
      newPassword: this.newPass.value,
      confirmPassword: this.newPass.value
    }).subscribe(
      () => {
        this.resetPasswordsForm();
        this.alertService.showSuccessAlert(
          'Your password has been <span class="success-colored-text">changed successfully</span>',
          'Click below to continue');
      },
      error => this.alertService.showErrorAlert(error)
    );
  }

  private resetUserInfoForm() {
    this.userInfoForm.reset({
      username: this.userInfo.username,
      email: this.userInfo.email,
      publicKey: this.userInfo.publicKey
    })
  }

  private initUserFrom(): void {
    this.userInfoForm = new FormGroup({
      username: new FormControl(this.userInfo.username, [
        Validators.required,
        Validators.minLength(environment.minUsernameLength),
        Validators.maxLength(environment.maxUsernameLength),
        CustomValidators.notOnlyWhitespaceValidator()
      ]),
      email: new FormControl(this.userInfo.email, [
        Validators.required,
        Validators.minLength(environment.minEmailLength),
        Validators.maxLength(environment.maxEmailLength),
        Validators.email,
      ]),
      publicKey: new FormControl(this.userInfo.publicKey, [
        CustomValidators.notOnlyWhitespaceValidator()
      ])
    });
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
}
