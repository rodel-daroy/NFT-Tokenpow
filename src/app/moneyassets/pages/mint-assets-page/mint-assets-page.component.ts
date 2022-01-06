import {Component, OnDestroy, OnInit,PLATFORM_ID,Inject} from '@angular/core';
import {IAssets} from '../../models/assets.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AssetServices} from '../../services/assets.service';
import {ModifyAssetsDataService} from '../../modules/create-assets/services/modify-assets-data.service';
import {ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core'
import {loadMoneyButtonJs} from '@moneybutton/javascript-money-button';
import {environment} from '../../../../environments/environment';
import {isPlatformBrowser} from '@angular/common';


@Component({
  selector: 'app-mint-assets-page',
  templateUrl: './mint-assets-page.component.html',
  styleUrls: ['./mint-assets-page.component.scss']
})
export class MintAssetsPageComponent implements OnInit , OnDestroy{
  @ViewChild('moneybuttonrender') elemMintButtonPane:ElementRef;
  promise = null;
  isBrowser;

  $subs: Subscription[] = [];
  assets: IAssets = {};
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: AssetServices,
    private stateService: AppStateService,
    private modifyAssetsDataService: ModifyAssetsDataService,
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
    this.$subs.push(this.modifyAssetsDataService.currentAssetsData.subscribe(res => {
      this.assets = res;
      this.renderExternalScript(environment.MONEY_BUTTON_URL).then(mb => {
        mb.render(this.elemMintButtonPane.nativeElement, {
          outputs: [
            {
              asset:  this.assets.paymailAlias + "@moneybutton.com",
              amount: this.assets.initialSupply,
            }
          ]
        });
        this.stateService.changeState('normal');

      }).catch(err => {
        console.log('err', err);
      });
    })
    );
  }
  renderExternalScript(src: string): Promise<any> {
    if (this.isBrowser && !this.promise) {
      window.moneyButton = window.moneyButton || {};
      this.promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        script.defer = true;
        script.addEventListener('load', _ => resolve(window.moneyButton));
        script.addEventListener('error', (error) => {
          console.log('ERROR', error);
          if (error.message) {
            this.toastrService.error(error.message, 'MoneyButton Error');
          } else {
            this.toastrService.error('Unexpected error', 'MoneyButton Error');
          }
          reject(error);
        });
        script.addEventListener('abort', reject);
        document.head.appendChild(script);
      });
    }
    return this.promise;
  }
  backStep(): void {
    this.router.navigate(['mbasset/myassets']);
  }
  ngOnDestroy(): void {
    this.$subs.forEach(sub => {
        sub.unsubscribe();
    }); 
  }
}
