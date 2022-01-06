import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  required: (error) => 'This field is required',
  email: (error) => 'Not a valid email',
  minlength: ({ requiredLength, actualLength }) => `Minimal length should be ${requiredLength} but got ${actualLength}`,
  pattern: (error) => 'Input is not matching required pattern',
  passwordMatch: (error) => 'Passwords are not matching',
  addressInvalid: (error) => 'Address is invalid'
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});
