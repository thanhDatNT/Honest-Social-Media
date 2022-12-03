import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

const nameChars = /^[A-Za-z][a-zA-Z\s]+$/;
const userNameChars = /^[A-Za-z][a-zA-Z0-9]+$/;
const emailChars = /^\w[a-zA-Z0-9\.\_\-\+\"]+$/;
const passwordChars = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const specialChars = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
/*
 * Password rule:
 * Minimum eight characters, at least one letter, one uppercase letter and one number
 */

export function nameValidator(fieldName: string): ValidatorFn {
  return (field: AbstractControl): Validators | null => {
    if (!field.value) return { other: `Please enter your ${fieldName}` };
    if (specialChars.test(field.value.charAt(0))) return { other: `${fieldName} is invalid. Please enter another value` };
    if (field.value.length < 2) return { other: `${fieldName} must be at least 2 characters long. Please use another one` };
    if (!nameChars.test(field.value)) return { other: `${fieldName} is invalid. Please enter another value` };
    if (field.value.length > 50) return { other: `${fieldName} is limited on the number of 50 characters. Please use another one` };
    return null;
  };
}

export function userNameValidator(field: AbstractControl): Validators | null {
  if (!field.value) return { other: `Please enter your user name` };
  if (field.value.length < 5) return { other: `The user name must be at least 5 characters long. Please use another one` };
  if (!userNameChars.test(field.value))
    return {
      other: `The user name is invalid. Please use another one which not start with a number and not contain special characters, spaces or symbols`
    };
  if (field.value.length > 32) return { other: `The user name is limited on the number of 32 characters. Please use another one` };
  return null;
}

export function passwordValidator(field: AbstractControl): Validators | null {
  if (!field.value) return { other: `Please enter your password` };
  if (field.value.length < 8) return { other: `The password must be at least 8 characters long. Please use another one` };
  if (!passwordChars.test(field.value)) return { other: `Please enter your password with at least 1 uppercase, 1 lowercase and 1 number ` };
  if (field.value.length > 32) return { other: `The password is limited on the number of 32 characters. Please use another one` };
  return null;
}

export function emailValidator(field: AbstractControl): Validators | null {
  if (!field.value) return { other: `Please enter a valid email address` };
  if (!emailChars.test(field.value)) return { other: `The email you entered is not a valid email address` };
  if (field.value.length > 256) {
    return { other: `Your email must be lest than 256 characters` };
  }
  if (field.value.includes('..') || field.value.endsWith('.')) {
    return { other: `Trailing dots in address` };
  }
  return null;
}

export function phoneValidator(field: AbstractControl): Validators | null {
  if (!field.value) return null;
  if (field.value.length < 12) return { other: `Invalid phone number` };
  return null;
}
