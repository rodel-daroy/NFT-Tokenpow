import {Component, OnDestroy, OnInit} from '@angular/core';
import {IRunNft} from '../../../../models/runnft.model';
import {CreateRunNftDataService} from '../../services/create-runnft-data.service';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunNftServices} from '../../../../services/runnft.service';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-create-preview-runnft',
  templateUrl: './create-preview-runnft.component.html',
  styleUrls: ['./create-preview-runnft.component.scss']
})
export class CreatePreviewRunNftComponent implements OnInit, OnDestroy {

  assets: IRunNft;
  $sub: Subscription;
  outputs: any;
  clientId = environment.moneyButton.client_id;
  paymentFinished: boolean;
  constructor(private createRunNftDataService: CreateRunNftDataService,
              private router: Router,
              private toastrService: ToastrService,
              private assetServices: RunNftServices,
              private stateService: AppStateService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.paymentFinished = false;
    // this.createselltokenDataService.changeState({});
    console.log(history);
    this.$sub = this.createRunNftDataService.currentRunNftData.subscribe(res => {
      this.assets = res;
      console.log("asset get:", res);
    });

    this.outputs = [
      {
        to: 'tokenpow@moneybutton.com',
        amount: "1.00",
        currency: 'USD'
      },
    ];
  }

  nextStep(): void {
    this.createRunNftDataService.changeState(this.assets);
    this.stateService.changeState('loading');
    console.log("test");
    this.assetServices.createRunNft(this.assets).then( res => {
      console.log(res);
      if (res?.success == true)
      {
        this.toastrService.success(this.translateService.instant('assets.create-assets.assets-created'));
        this.router.navigate(['runnft/create/thank-you']);
      }
      else
      {
        if (res?.message)
          this.toastrService.error( res?.name + "\n" + res?.message);
        else
          this.toastrService.error( 'Something went wrong!' );
      }
      this.stateService.changeState('normal');
    }).catch(err => {
      this.toastrService.error(err.message);
      this.assetsNotCreated();
      this.stateService.changeState('normal');
      console.log(err);
    });;

  }

  prevStep(): void {
    // this.selltoken.selltokenFrom = new Date(this.selltoken.selltokenFrom * 1000);
    // this.selltoken.selltokenUntil = new Date(this.selltoken.selltokenUntil * 1000);
    // this.selltoken.shortDescription = this.selltoken.shortDescription.split('/newLineSeparator/').join('\n');
    this.createRunNftDataService.changeState(this.assets);
    this.router.navigate(['runnft/create/create']);
  }

  assetsNotCreated(): void {
    this.toastrService.error(this.translateService.instant('assets.create-assets.assets-not-created'));
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

  onPaymentError(event): void {
    console.log('ERROR', event);
    if (event.message) {
    } else {
    }
  }

  async onPaymentSuccess(event): Promise<void> {
    this.paymentFinished = true;
    this.nextStep();
  }

}
