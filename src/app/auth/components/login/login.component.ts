import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {ConfirmationService} from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() signUpClick = new EventEmitter<boolean>();
  form;
  emailSent = false;
  errorMessage: string;
  email: string;
  password: string;
  isPasswordHidden = true;

  constructor(public authService: AuthService,
              public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private confirmationService: ConfirmationService,
              private router: Router) { }

  ngOnInit(): void {
    console.log("debug---------------------------");
    // const url = this.router.url;
    //
    // if (url.includes('signIn')) {
    //   this.authService.confirmSignIn(url)
    //     .catch((err) => {
    //       this.errorMessage = err.message;
    //     });
    // }
  }

  async onLogInButtonClicked(): Promise<void> {
    // this.authService.sendEmailLink(this.email, false)
    //   .then(() => {
    //     this.emailSent = true;
    //   })
    //   .catch((err) => {
    //     this.errorMessage = err.message;
    //   });
    await this.authService.loginUser(this.email, this.password);
  }

  onResetPasswordClicked(): void {
    this.authService.resetPassword();
  }

  onLogInWithGoogleButtonClicked(): void {
    this.authService.googleSignIn().then(() => this.router.navigate(['/selltokens']));
  }

  onLogInWithFacebookButtonClicked(): void {
    this.authService.facebookSignIn();
  }

  onLogInWithMoneyButtonClicked(): void {
    this.authService.moneyButtonSignIn();
  }

  onVerificationEmailExpiredClicked(): void {
    this.authService.sendNewVerificationEmail();
  }
}
