import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {AuthService} from '../../../../../auth/services/auth.service';
import {CreateAssetsDataService} from '../../services/create-assets-data.service';
import {ActivatedRoute} from '@angular/router';
import {EmailService} from '../../services/email.service';
import {IAssets} from '../../../../models/assets.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-thank-you-page-assets',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageAssetsComponent implements OnInit {
  assets: IAssets = {};
  $sub: Subscription;
  completedAnim: AnimationOptions = {
    path: '/assets/animations/completed.json',
  };

  teamAnim: AnimationOptions = {
    path: '/assets/animations/team.json'
  };

  constructor(public authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private createAssetsDataService: CreateAssetsDataService,
              private emailService: EmailService,
              private createSelltokenService: CreateAssetsDataService) {}

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.queryParams.selltokenName);
    this.$sub = this.createAssetsDataService.currentAssetsData.subscribe(res => {
      this.assets = res;
    });
    //this.createSelltokenService.changeState({});
    this.emailService.sendNewAssetEmail();
  }

}
