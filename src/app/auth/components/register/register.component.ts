import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {WindowService} from '../../services/window.service';
import * as firebase from 'firebase';
import {CookieService} from 'ngx-cookie';
import {AnimationOptions} from 'ngx-lottie';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() logInClick = new EventEmitter<boolean>();
  options: AnimationOptions = {
    path: '/assets/animations/email.json',
  };

  form: FormGroup;
  emailSent = false;
  errorMessage: string;
  windowRef: any;
  verificationCode: string;
  captchaVerified = false;
  phone = '';
  smsSend = false;
  isPasswordHidden = true;
  isConfirmPasswordHidden = true;
  isPasswordInvalid = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private cookieService: CookieService,
              private toastrService: ToastrService,
              private windowService: WindowService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [
        Validators.email,
        Validators.required
      ]],
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]]
      // phone: ['', [
      //   Validators.required,
      // ]]
    }, {validators: this.checkPasswords});
    this.form.valueChanges.subscribe(res => {
      console.log(res);
      console.log(this.form.valid && this.captchaVerified);
    });
    this.windowRef = this.windowService.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();
    this.form.get('password').valueChanges.subscribe(change => {
      this.isPasswordInvalid = this.form.get('password').invalid;
    });
  }

  checkPasswords(group: FormGroup): any {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { passwordMatch: false};
  }


  sendLoginCode(): void {
    this.authService.checkIfPhoneAlreadyExists()
      .subscribe(res => {
        if (!res.data().numbers.includes(this.phone)) {
          const appVerifier = this.windowRef.recaptchaVerifier;

          // if(!this.phone.includes("+"))
          //   this.phone ="+1 " + this.phone;

          firebase.auth().signInWithPhoneNumber(this.phone, appVerifier)
            .then(result => {
              this.smsSend = true;
              this.form.updateValueAndValidity();
              this.windowRef.confirmationResult = result;

            })
            .catch( error => console.log(error) );
        } else {
          this.toastrService.error(this.translateService.instant('auth.register.user-already-registered-please-log-in'));
        }
      });

  }

  verifyLoginCode(): void {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then( result => {
        this.cookieService.put('phoneNumber', this.phone);
        this.cookieService.put('firstName', this.getFormValue('firstName'));
        this.cookieService.put('lastName', this.getFormValue('lastName'));
        this.authService.addPhoneNumberToExisting(this.phone);
        // this.authService.sendEmailLink(this.getFormValue('email'), true);
        this.authService.registerUser(this.getFormValue('email'), this.getFormValue('password'));
        this.emailSent = true;

      })
      .catch( error => {
        this.toastrService.error(error, 'Error');
      });
  }

  onLogInWithGoogleButtonClicked(): void {
    this.authService.googleSignIn();
  }

  onLogInWithFacebookButtonClicked(): void {
    this.authService.facebookSignIn();
  }

  getFormValue(key): string {
    return this.form.get(key).value;
  }
}
