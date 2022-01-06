import { Component, OnInit } from '@angular/core';
import {AnimationOptions} from 'ngx-lottie';
import {AuthService} from '../../../../../auth/services/auth.service';
import {CreateSelltokenDataService} from '../../services/create-selltoken-data.service';
import {ActivatedRoute} from '@angular/router';
import {EmailService} from '../../services/email.service';

@Component({
  selector: 'app-thank-you-page',
  templateUrl: './thank-you-page.component.html',
  styleUrls: ['./thank-you-page.component.scss']
})
export class ThankYouPageComponent implements OnInit {
  completedAnim: AnimationOptions = {
    path: '/assets/animations/completed.json',
  };

  teamAnim: AnimationOptions = {
    path: '/assets/animations/team.json'
  };

  constructor(public authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private emailService: EmailService,
              private createSelltokenService: CreateSelltokenDataService) {}

  ngOnInit(): void {
    console.log(this.activatedRoute.snapshot.queryParams.selltokenName);
    this.createSelltokenService.changeState({});
    this.emailService.sendNewselltokenEmail();
  }

}
