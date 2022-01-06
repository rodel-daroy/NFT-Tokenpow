import {Component, OnDestroy, OnInit, PLATFORM_ID, Inject} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {AppStateService} from '../../../shared/services/app-state.service';
import {RunNftServices} from 'src/app/runnft/services/runnft.service';
import {RunTokenService} from 'src/app/runtoken/services/runtoken.service';
import {ElementRef} from '@angular/core';
import {ViewChild} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {MoneyButtonComponent} from '../../../shared/components/money-button/money-button.component';

@Component({
  selector: 'app-runnft-transfer-dialog',
  templateUrl: './runnft-transfer-dialog.component.html',
  styleUrls: ['./runnft-transfer-dialog.component.scss']
})
export class RunNftTransferDialogComponent implements OnInit {
  bsvAddress;
  isBrowser;
  promise = null;
  $subs: Subscription[] = [];
  paymentSuccessed: boolean;
  outputs: any;
  clientId = environment.moneyButton.client_id;
  location: string;
  ownerAddress: string;
  amount: number;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private runnftServices: RunNftServices,
              private runtokenServices: RunTokenService,
              @Inject(PLATFORM_ID) private platformId) {

    this.isBrowser = isPlatformBrowser(platformId);
    this.promise = null;
  }

  ngOnInit(): void {

    this.location = this.config.data.location;
    this.paymentSuccessed = false;

    this.outputs = [
      {
        to: 'tokenpow@moneybutton.com',
        amount: 0.01,
        currency: 'USD'
      }
    ];
  }

  onSubmit(answer: boolean): void {
    this.ref.close(answer);
  }

  async onPaymentSuccess(event): Promise<void> {
    // transfer it directly
    console.log('transfer test =====>', event);
    this.stateService.changeState('loading');
    if (this.ownerAddress.includes('@relayx.io')) {
      this.runnftServices.getrelayxAddress(this.ownerAddress).then(address => {
        console.log('addressGet =====>', address);
        this.runnftServices.transferDirectly(this.location, address.data)
          .then(res => {
            if (res?.success === true) {
              this.paymentSuccessed = true;
            } else {
              this.toastrService.info(res?.name + '\n' + res?.message);
            }
            this.stateService.changeState('normal');
          })
          .catch(err => {
            this.stateService.changeState('normal');
            this.toastrService.info('Something Went Wrong');
          });
      });
    } else {
      this.runnftServices.transferDirectly(this.location, this.ownerAddress)
        .then(res => {
          if (res?.success === true) {
            this.paymentSuccessed = true;
          } else {
            this.toastrService.info(res?.name + '\n' + res?.message);
          }
          this.stateService.changeState('normal');
        })
        .catch(err => {
          this.stateService.changeState('normal');
          this.toastrService.info('Something Went Wrong');
        });
    }
  }

  onPaymentError($event: any): void {
    // if ($event?.message === 'too-long-mempool-chain')
    //   this.paymentSuccessed = true;
    console.log('onPaymentError =====>', $event);
  }

}
