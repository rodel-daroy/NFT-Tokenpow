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
import { RunNftServices } from 'src/app/runnft/services/runnft.service';
import { RunTokenService } from 'src/app/runtoken/services/runtoken.service';
import {UserService} from '../../../user/services/user.service';

@Component({
  selector: 'app-selltoken-transfer-dialog',
  templateUrl: './selltoken-transfer-dialog.component.html',
  styleUrls: ['./selltoken-transfer-dialog.component.scss']
})
export class SelltokenTransferDialogComponent implements OnInit {
  @ViewChild('moneybuttonrender') elemMintButtonPane:ElementRef;
  bsvAddress;
  isBrowser;
  promise = null;
  $subs: Subscription[] = [];
  paymentSuccessed: boolean;
  outputs: any;
  clientId = environment.moneyButton.client_id;
  location: string;
  buyerAdress: string;

  address: any;
  ouruserwallet:any;
  satoshi:any;
  withdrawtype: number;
  percentage: number;
  feeowneraddress: string;
  donateAddress: string;
  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private userService: UserService,
              private runnftServices: RunNftServices,
              private runtokenServices: RunTokenService,
              @Inject(PLATFORM_ID) private platformId
              ) {
                this.isBrowser = isPlatformBrowser(platformId);
                this.promise = null;
              }

  ngOnInit(): void {
    console.log("transfer page!!!!!");
    this.address = this.config.data.address;
    this.ouruserwallet = this.config.data.ouruserwallet;
    this.satoshi = this.config.data.satoshi;
    this.withdrawtype = this.config.data.type;
    this.donateAddress = this.config.data.donateAddress;
    if (this.withdrawtype == 1)
    {
      this.percentage = this.config.data.percentage;
      this.feeowneraddress = this.config.data.feeowneraddress;
    }

    if (this.config.data.isMB)
    {
      this.bsvAddress = this.config.data.bsvAddress;
      this.paymentSuccessed = false;
      if (!this.config.data.billinguser)
        this.paymentSuccessed = true;
      this.outputs = [
        {
          to: this.config.data.billinguser,
          asset: this.config.data.asset,
          amount: this.config.data.amount
        }
      ];
    }
    else{
      this.location = this.config.data.location;
      this.buyerAdress = this.config.data.buyerAddress;
      this.paymentSuccessed = false;

      this.outputs = [
        {
          to: 'tokenpow@moneybutton.com',
          amount: 0.01,
          currency: 'USD'
        }
      ];
    }
  }

  onSubmit(answer: boolean): void {
    this.ref.close(answer);
  }

  withdrawmoney()
  {
    if (!this.address?.privateKey)
    {
      this.paymentSuccessed = true;
      this.ref.close(true);
      this.stateService.changeState('normal');
      return;
    }
    if (this.withdrawtype == 0)
    {
      this.userService.withdrawEscrowCoins2(
        this.address.privateKey,
        this.ouruserwallet,
        this.satoshi,
        this.donateAddress
      )
      .subscribe(res => {
          this.paymentSuccessed = true;
          this.ref.close(true);
          this.stateService.changeState('normal');
      }, (err) =>
      {
        this.ref.close(false);
        this.stateService.changeState('normal');
        this.toastrService.error(' Error occurs while withdrawn ')
      }
      );
    }else
    {
      if (this.percentage > 0 && this.feeowneraddress)
      {
        this.userService.withdrawEscrowCoins3(
          this.address.privateKey,
          this.ouruserwallet,
          this.satoshi,
          this.percentage,
          this.feeowneraddress,
          this.donateAddress
        )
        .subscribe(res => {
            this.paymentSuccessed = true;
            this.ref.close(true);
            this.stateService.changeState('normal');
        }, (err) => {
          this.ref.close(false);
          this.stateService.changeState('normal');
          this.toastrService.error(' Error occurs while withdrawn ')
        });
      }else
      {
        this.userService.withdrawEscrowCoins2(
          this.address.privateKey,
          this.ouruserwallet,
          this.satoshi,
          this.donateAddress
        )
        .subscribe(res => {
            this.paymentSuccessed = true;
            this.ref.close(true);
            this.stateService.changeState('normal');
        }, (err) => {
          this.ref.close(false);
          this.stateService.changeState('normal');
          this.toastrService.error(' Error occurs while withdrawn ')
        });
      }
    }
  }
  async onPaymentSuccess(event): Promise<void> {
    if (this.config.data.isMB == true) {
      this.withdrawmoney();
    }
    else if (this.config.data.isArt == true) {
      console.log(event);
      //transfer it directly
      console.log("transfer test-------------");
      this.stateService.changeState('loading');
      this.runnftServices.transferToken(this.location, this.buyerAdress).then(
        res => {
          if (res?.success == true)
          {
            this.withdrawmoney();
          }
          else
          {
            this.toastrService.info( res?.name + "\n" + res?.message);
            this.ref.close(false);
          }
          this.stateService.changeState('normal');
        }

      ).catch( err =>{
        this.stateService.changeState('normal');
        this.ref.close(false);
        this.toastrService.info("Something Went Wrong");
      })
    }else{
      console.log(event);
      //transfer it directly
      console.log("transfer test-------------");
      this.stateService.changeState('loading');
      this.runtokenServices.transferToken(this.location, this.buyerAdress, this.config.data.amount).then(
        res => {
          if (res?.success == true)
          {
            this.withdrawmoney();
          }
          else
          {
            this.toastrService.info( res?.name + "\n" + res?.message);
            this.ref.close(false);
          }
          this.stateService.changeState('normal');
        }

      ).catch( err =>{
        this.stateService.changeState('normal');
        this.ref.close(false);
        this.toastrService.info("Something Went Wrong");
      })
    }
  }

  onPaymentError($event: any): void {
   // if ($event?.message == 'too-long-mempool-chain')
   //   this.paymentSuccessed = true;

    //console.log($event);
  }

}
