import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {AuthService} from '../../../../../auth/services/auth.service';
import {CreateRunTokenDataService} from '../../services/create-runtoken-data.service';
import {ActivatedRoute} from '@angular/router';
import {EmailService} from '../../services/email.service';
import {IRunToken} from '../../../../models/runtoken.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-thank-you-page-assets',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageRunTokenComponent implements OnInit {
  assets: IRunToken = {};
  $sub: Subscription;
  completedAnim: AnimationOptions = {
    path: '/assets/animations/completed.json',
  };

  teamAnim: AnimationOptions = {
    path: '/assets/animations/team.json'
  };

  constructor(public authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private createRunTokenDataService: CreateRunTokenDataService,
              private emailService: EmailService) {}

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.queryParams.selltokenName);
    this.$sub = this.createRunTokenDataService.currentRunTokenData.subscribe(res => {
      if (res?.name)
        this.assets = {...res};
      this.createRunTokenDataService.changeState({});
    });
    this.emailService.sendNewAssetEmail();
  }

}
