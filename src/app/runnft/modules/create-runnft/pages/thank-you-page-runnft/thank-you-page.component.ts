import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {AuthService} from '../../../../../auth/services/auth.service';
import {CreateRunNftDataService} from '../../services/create-runnft-data.service';
import {ActivatedRoute} from '@angular/router';
import {EmailService} from '../../services/email.service';
import {IRunNft} from '../../../../models/runnft.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-thank-you-page-assets',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageAssetsComponent implements OnInit {
  assets: IRunNft = {};
  $sub: Subscription;
  completedAnim: AnimationOptions = {
    path: '/assets/animations/completed.json',
  };

  teamAnim: AnimationOptions = {
    path: '/assets/animations/team.json'
  };

  constructor(public authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private createAssetsDataService: CreateRunNftDataService,
              private emailService: EmailService ) {}

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.queryParams.selltokenName);
    this.$sub = this.createAssetsDataService.currentRunNftData.subscribe(res => {
      if (res?.name)
      this.assets = {...res};
      this.createAssetsDataService.changeState({});    }
    );
    //this.createSelltokenService.changeState({});
    this.emailService.sendNewAssetEmail();
  }

}
