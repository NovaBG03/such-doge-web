import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map} from "rxjs/operators";
import {Subscription} from "rxjs";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isRegister = true;
  imageSrc = '';

  authForm!: FormGroup;

  private urlSub!: Subscription;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.urlSub = this.route.url
      .pipe(map(urlSegment => urlSegment[0].path))
      .subscribe(url => {
        this.isRegister = url === 'register'
        if (this.isRegister) {
          this.imageSrc = '/assets/images/flying_doge.png';
        } else {
          this.imageSrc = '/assets/images/kawai_doge.jpg';
        }
        this.initAuthForm();
      });
  }

  ngOnDestroy(): void {
    this.urlSub?.unsubscribe();
  }

  getIllustrationBackground(): string {
    if (!this.isRegister) {
      return '#F9B64B';
    }

    return '#2B2935';
  }

  getControl(controlName: string): FormControl {
    return this.authForm.get(controlName) as FormControl;
  }

  private initAuthForm() {
    this.authForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(36)
      ]),
      passwords: new FormGroup({
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          this.hasDigitsValidator(),
          this.hasAlphabeticCharacters()
        ])
      })
    });

    if (this.isRegister) {
      this.authForm.addControl('email',
        new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(254),
          Validators.email
        ]));

      const passwordsGroup = this.authForm.get('passwords') as FormGroup;

      passwordsGroup.setValidators(this.isPasswordConfirmedValidator());

      passwordsGroup.addControl('confirmed',
        new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          this.hasDigitsValidator(),
          this.hasAlphabeticCharacters()
        ]));
    }
  }

  private hasDigitsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasDigits = control.value && /\d/.test(control.value);
      return hasDigits ? null : {hasDigit: {value: control.value}};
    }
  }

  private hasAlphabeticCharacters(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasAlphabeticCharacters = control.value && /[a-z]/.test(control.value);
      return hasAlphabeticCharacters ? null : {hasAlphabeticCharacters: {value: control.value}};
    }
  }

  private isPasswordConfirmedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmed')?.value;

      const isPasswordConfirmed = password === confirmPassword;
      return isPasswordConfirmed ? null : {isPasswordConfirmed: {value: control.value}};
    }
  }
}
