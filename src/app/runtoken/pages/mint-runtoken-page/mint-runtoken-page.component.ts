import {Component, OnDestroy, OnInit,PLATFORM_ID,Inject} from '@angular/core';
import {IRunToken} from '../../models/runtoken.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunTokenService} from '../../services/runtoken.service';
import {ModifyRunTokenDataService} from '../../modules/create-runtoken/services/modify-runtoken-data.service';
import {ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core'
import {loadMoneyButtonJs} from '@moneybutton/javascript-money-button';
import {environment} from '../../../../environments/environment';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'app-mint-runtoken-page',
  templateUrl: './mint-runtoken-page.component.html',
  styleUrls: ['./mint-runtoken-page.component.scss']
})
export class MintRunTokenPageComponent implements OnInit , OnDestroy{
  @ViewChild('moneybuttonrender') elemMintButtonPane:ElementRef;
  promise = null;
  isBrowser;

  $subs: Subscription[] = [];
  assets: IRunToken = {};
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: RunTokenService,
    private stateService: AppStateService,
    private modifyRunTokenDataService: ModifyRunTokenDataService,
    private translateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId
    ) { 
      this.isBrowser = isPlatformBrowser(platformId);
      this.promise = null;
    }

  ngOnInit(): void {
  
    console.log("this call!!")
    window.scrollTo(0, 0);
    this.stateService.changeState('loading');
    this.$subs.push(this.modifyRunTokenDataService.currentRunTokenData.subscribe(res => {
      this.stateService.changeState('normal');
      this.assets = res;
     
    })
    );
  }
  backStep(): void {
    this.router.navigate(['rtasset/myassets']);
  }
  mint(): void {
    this.stateService.changeState('loading');
    this.assetServices.mint(this.assets).then( res => {
      this.stateService.changeState('normal');
      if (res?.success == true)
      {
        this.toastrService.info('Now It is Mint');
      }
      else
      {
        if (res?.error)
          this.toastrService.error( res.console.error()
          );
        else
          this.toastrService.error( 'Something went wrong!' );
      }
      this.stateService.changeState('normal');
    }).catch(err => {
      this.toastrService.error(err.message);
      this.stateService.changeState('normal');
    });
  }
  ngOnDestroy(): void {
    this.$subs.forEach(sub => {
        sub.unsubscribe();
    }); 
  }
}
