import {Component, OnDestroy, OnInit,PLATFORM_ID,Inject} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {SelltokenStatus} from '../../enums/selltoken-status.enum';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {ElementRef} from '@angular/core';
import { ViewChild } from '@angular/core'
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {AppStateService} from '../../../shared/services/app-state.service';

@Component({
  selector: 'app-selltoken-close-dialog',
  templateUrl: './selltoken-close-dialog.component.html',
  styleUrls: ['./selltoken-close-dialog.component.scss']
})
export class SelltokenCloseDialogComponent implements OnInit {
  @ViewChild('moneybuttonrender') elemMintButtonPane:ElementRef;
  bsvAddress;
  isBrowser;
  promise = null;
  $subs: Subscription[] = [];
  paymentSuccessed: boolean;
  outputs: any;
  status: number;
  clientId = environment.moneyButton.client_id;
  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              @Inject(PLATFORM_ID) private platformId
              ) {
                this.isBrowser = isPlatformBrowser(platformId);
                this.promise = null;
              }

  ngOnInit(): void {
    this.bsvAddress = this.config.data.bsvAddress;
    this.paymentSuccessed = false;
    this.status = this.config.data.status;

    if (!this.config.data.billinguser || this.status == SelltokenStatus.TOKEN_TRANSFERED)
      this.paymentSuccessed = true;
    this.outputs = [
      {
        to: this.config.data.billinguser,
        asset: this.config.data.asset,
        amount: this.config.data.amount,
      },
      {
        to: "tokenpow@moneybutton.com",
        amount: 150
      }
    ];
  }

  onSubmit(answer: boolean): void {
    this.ref.close(answer);
  }

  async onPaymentSuccess(event): Promise<void> {
    console.log(event);
    this.paymentSuccessed = true;
  }

  onPaymentError($event: any): void {
   // if ($event?.message == 'too-long-mempool-chain')
      this.paymentSuccessed = true;

    //console.log($event);
  }

}
