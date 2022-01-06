import { SharedModule } from './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage'; 
import {CookieModule} from 'ngx-cookie';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {NgcCookieConsentConfig, NgcCookieConsentModule} from 'ngx-cookieconsent';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {CryptoService} from './shared/services/crypto.service';
import {ModifyAssetsDataService} from './moneyassets/modules/create-assets/services/modify-assets-data.service'
import {WithdrawSelltokensCoinsService} from './selltokens/services/withdraw-selltokens-coins.service'
import player from 'lottie-web';
import {LottieModule} from 'ngx-lottie';
import {DialogService} from 'primeng/dynamicdialog';
import {CoreModule} from './core/core.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const cookieConfig = environment.cookieConfig;

cookieConfig.theme = getCurrentDomain();

function getCurrentDomain(): string {
  if (environment.production) {
    return window.location.href.includes('tokenpow') ? 'tokenpow' : 'tokenpow';
  } else {
    return 'localhost';
  }
}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function playerFactory() {
  return player;
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    CoreModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    NgcCookieConsentModule.forRoot(cookieConfig as NgcCookieConsentConfig),
    CookieModule.forRoot(),
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    }),
    FontAwesomeModule,
    LottieModule.forRoot({ player: playerFactory }),
    NgbModule,
  ],
  providers: [CryptoService,
    ModifyAssetsDataService,
    WithdrawSelltokensCoinsService,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true
    // }
    DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
