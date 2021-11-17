import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function hasDigitsValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasDigits = control.value && /\d/.test(control.value);
    return hasDigits ? null : {hasDigit: {value: control.value}};
  }
}

export function hasAlphabeticCharacters(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasAlphabeticCharacters = control.value && /[a-z]/.test(control.value);
    return hasAlphabeticCharacters ? null : {hasAlphabeticCharacters: {value: control.value}};
  }
}

export function isPasswordConfirmedValidator(passwordPath: string, confirmedPath: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordPath)?.value;
    const confirmPassword = control.get(confirmedPath)?.value;

    const isPasswordConfirmed = password === confirmPassword;
    return isPasswordConfirmed ? null : {isPasswordConfirmed: {value: control.value}};
  }
}
