import {Component, OnInit} from '@angular/core';
import {CookieConsentService} from './shared/services/cookie-consent.service';
import {VersionCheckService} from './shared/services/version-check.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [VersionCheckService]
})
export class AppComponent implements OnInit{
  environment = environment;
  constructor(private cookieService: CookieConsentService,
              private versionCheckService: VersionCheckService){

  }

  ngOnInit(): void {

  }
}
