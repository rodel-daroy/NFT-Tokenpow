import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import {LoginComponent} from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OauthLoginCallbackComponent } from './pages/oauth-login-callback/oauth-login-callback.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import {AuthService} from './services/auth.service';
import {CommonInputValidatorModule} from '../shared/modules/common-input-validator/common-input-validator.module';
import {InternationalPhoneNumber2Module} from 'ngx-international-phone-number2';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmationService} from 'primeng/api';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {LottieModule} from 'ngx-lottie';
import {CountdownModule} from 'ngx-countdown';
import { AskForPasswordDialogComponent } from './components/ask-for-password-dialog/ask-for-password-dialog.component';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import { ResetPasswordDialogComponent } from './components/reset-password-dialog/reset-password-dialog.component';

const components = [
  LoginComponent,
  LoginPageComponent,
  RegisterComponent,
  OauthLoginCallbackComponent,
  RegisterPageComponent,
  AskForPasswordDialogComponent
];

const modules = [
  CommonModule,
  SharedModule,
  AuthRoutingModule,
  ReactiveFormsModule,
  FormsModule,
  CommonInputValidatorModule,
  InternationalPhoneNumber2Module,
  TranslateModule,
  ConfirmDialogModule,
  DynamicDialogModule,
  LottieModule,
  CountdownModule,
  InputTextModule,
  ButtonModule
];

@NgModule({
  declarations: [...components, ResetPasswordDialogComponent],
  imports: [...modules],
  providers: [AuthService, ConfirmationService, DialogService]
})
export class AuthModule { }
