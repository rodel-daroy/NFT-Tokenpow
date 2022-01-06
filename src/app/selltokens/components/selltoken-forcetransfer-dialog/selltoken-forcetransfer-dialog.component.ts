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
import {UserService} from '../../../user/services/user.service';

@Component({
  selector: 'app-selltoken-forcetransfer-dialog',
  templateUrl: './selltoken-forcetransfer-dialog.component.html',
  styleUrls: ['./selltoken-forcetransfer-dialog.component.scss']
})
export class SelltokenForceTransferDialogComponent implements OnInit {
  @ViewChild('moneybuttonrender') elemMintButtonPane:ElementRef;
  bsvAddress;
  isBrowser;
  promise = null;
  $subs: Subscription[] = [];
  paymentSuccessed: boolean;
  outputs: any;
  status: number;
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
              @Inject(PLATFORM_ID) private platformId
              ) {
                this.isBrowser = isPlatformBrowser(platformId);
                this.promise = null;
              }

  ngOnInit(): void {
    this.paymentSuccessed = true;
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
    }
    else{
      this.location = this.config.data.location;
      this.buyerAdress = this.config.data.buyerAddress;
    }
  }

  onSubmit(answer: boolean): void {
    if (answer)
      this.withdrawmoney();
    else{
      this.ref.close(answer);
    }
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

}
