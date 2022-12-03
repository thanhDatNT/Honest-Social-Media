import { AbstractControl, Validators } from '@angular/forms';

const userNameChars = /^[A-Za-z][a-zA-Z0-9]+$/;
const passwordChars = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

export function userNameValidator(field: AbstractControl): Validators | null {
  if (!field.value) return { other: `Please enter your user name` };
  return null;
}

export function passwordValidator(field: AbstractControl): Validators | null {
  if (!field.value) return { other: `Please enter your password` };
  return null;
}
