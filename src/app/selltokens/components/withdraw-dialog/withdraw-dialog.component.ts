import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../auth/models/user.model';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import { MoneyButtonComponent } from '../../../shared/components/money-button/money-button.component';
import { ISelltoken } from '../../models/selltoken.model';
import {SelltokenService} from '../../services/selltoken.service';
import { BidHistory } from '../../models/bid-history.model';
import { AppStateService } from '../../../shared/services/app-state.service';
import { CryptoService } from '../../../shared/services/crypto.service';
import {UserService} from '../../../user/services/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-withdraw-dialog',
  templateUrl: './withdraw-dialog.component.html',
  styleUrls: ['./withdraw-dialog.component.scss']
})
export class WithDrawDialogComponent implements OnInit, OnDestroy {
  @ViewChild('moneyButton') moneyButton: MoneyButtonComponent;
  user: User;
  subs: Subscription[] = [];
  
  selltoken: ISelltoken;
  address: any;
  satoshi: number;
  withdrawAddress: string;
  historyId: string;
  sellTokenId: string; 
  bidHistory: any;
  paymail: string;
  selectedMethod: string;
  userWalletAddress: string;
  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private stateService: AppStateService,
              private authService: AuthService,
              private cryptoService: CryptoService,
              private userService: UserService,
              private SelltokenService: SelltokenService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.withdrawAddress = this.config.data.preferredAddress;
    this.satoshi = this.config.data.satoshi;
    this.address = this.config.data.address;
    this.historyId = this.config.data.bidHistoryID;
    this.sellTokenId = this.config.data.sellTokenID;
    this.bidHistory = this.config.data.bidHistory;
    this.paymail = this.config.data.paymail;
    this.userWalletAddress = this.config.data.userWalletAddress;
    console.log("test-------------------------------------");
    this.SelltokenService.getPaymailAddress( this.paymail).subscribe(
      (arg) => {
         this.withdrawAddress = arg['address']['hash'];
      });

    //this.authService.generateAddressForUser().toPromise().then(res1 => {
   //   console.log(res1);
    //})

    
  }

  withdraw(): void {
   
    if ( this.selectedMethod == 'm1')
      this.withdrawAddress = this.userWalletAddress;
    //if ( this.selectedMethod == 'm2')
    this.userService.withdrawEscrowCoins(
      this.address.privateKey,
      this.withdrawAddress,
      this.satoshi
    )/*.pipe(
      switchMap((res) => {
        return this.userService.sendWithdrawTransactionToTxt(
          this.userWithdraw,
          this.user.email,
          res.tx,
          this.user.uid,
          true,
          '',
          this.user.bsvAddress.address,
          this.user.withdrawalBsvAddress,
          res.fee,
          false);
      })
    )*/
    .pipe(
      switchMap( (withOb) => {
        return this.SelltokenService.removeHistoryAddress(this.sellTokenId, this.historyId, this.bidHistory);
      })
    )
    .subscribe(res => {
      console.log(res);
      this.stateService.changeState('normal');
      this.toastrService.success(' Successfully sent to adddress');
      this.ref.close(true);
    }, (err) => this.toastrService.error(' Error occurs while withdrawn '));
    this.ref.close();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
