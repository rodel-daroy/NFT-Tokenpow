import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-oauth-login-callback',
  templateUrl: './oauth-login-callback.component.html',
  styleUrls: ['./oauth-login-callback.component.scss']
})
export class OauthLoginCallbackComponent implements OnInit {

  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      setTimeout(() => {
        this.authService.signOut();
      }, 1000 * 60 * 24);
       this.authService.moneyButtonRetrieveToken(params.code);
    });
  }

}
