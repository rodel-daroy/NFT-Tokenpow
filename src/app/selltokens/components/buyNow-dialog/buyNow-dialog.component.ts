import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AuthService} from '../../../auth/services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import * as firebase from 'firebase';
import {MoneyButtonComponent} from '../../../shared/components/money-button/money-button.component';
import { ISelltoken } from '../../models/selltoken.model';
import {SelltokenService} from '../../services/selltoken.service';
import { BidHistory } from '../../models/bid-history.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import { SelltokenStatus } from '../../enums/selltoken-status.enum';

@Component({
  selector: 'app-buyNow-dialog',
  templateUrl: './buyNow-dialog.component.html',
  styleUrls: ['./buyNow-dialog.component.scss']
})
export class BuyNowDialogComponent implements OnInit, OnDestroy {
  @ViewChild('moneyButton') moneyButton: MoneyButtonComponent;
  disableAll: boolean;
  user: User;
  subs: Subscription[] = [];
  checked: boolean = false;
  outputs: {
    to?: string,
    amount?: string,
    currency?: string,
    userId?: string,
  }[] = [];
  currentTopPrice: number;
  paymentFinished: boolean;
  bidValue: number;
  totalBidCount: number;
  buyNowPrice: number;
  selltoken: ISelltoken;
  donateAddress: string;
  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private stateService: AppStateService,
              private authService: AuthService,
              private SelltokenService: SelltokenService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.disableAll = false;
    this.paymentFinished = false;
    this.totalBidCount = this.config.data.totalBidCount;
    this.buyNowPrice = this.config.data.buyNowPrice + this.config.data.buyNowPrice * 0.05;
    this.currentTopPrice = this.config.data.tokenPrice;
    this.donateAddress = this.config.data.donateAddress;
    this.bidValue = this.currentTopPrice;
    var percentage = this.config.data.percentage;
    const amount =  ((this.buyNowPrice /105) * (100-percentage) )
    const amountToUs = ((this.buyNowPrice  /105) * 5)
    const amountToOwner = ((this.buyNowPrice  /105) * (percentage) )
    if (percentage > 0)
    {
      if (this.donateAddress)
      {
        this.outputs = [
          {
            to: this.config.data.auctionBsvAddress,
            amount: amount.toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
            amount: (amountToUs *0.8).toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: this.donateAddress,
            amount: (amountToUs * 0.2).toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: this.config.data.feeowneraddress,
            amount: amountToOwner.toFixed(8).toString(),
            currency: 'USD'
          },
        ]
      }
      else
      {
        this.outputs = [
          {
            to: this.config.data.auctionBsvAddress,
            amount: amount.toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
            amount: amountToUs.toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: this.config.data.feeowneraddress,
            amount: amountToOwner.toFixed(8).toString(),
            currency: 'USD'
          },
        ];
      }
  
    }
    else{
      if (this.donateAddress)
      {
        this.outputs = [
          {
            to: this.config.data.auctionBsvAddress,
            amount: amount.toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
            amount: (amountToUs * 0.8).toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: this.donateAddress,
            amount: (amountToUs * 0.2).toFixed(8).toString(),
            currency: 'USD'
          },
        ];  
      }
      else
      {
        this.outputs = [
          {
            to: this.config.data.auctionBsvAddress,
            amount: amount.toFixed(8).toString(),
            currency: 'USD'
          },
          {
            to: '1Ajtoa1JxR26u2zQafM4zLsAXTWwkwSSig',
            amount: amountToUs.toFixed(8).toString(),
            currency: 'USD'
          },
        ];  
      }    
    }

    console.log("Buy Now MB outputs", this.outputs);

    this.subs.push(this.SelltokenService.getSingleselltoken(this.config.data.selltokenId).subscribe((selltoken: ISelltoken) => {
      this.currentTopPrice = selltoken.currentTokenPrice;
      this.selltoken = selltoken;
      this.stateService.changeState('normal');
    }));

    this.subs.push(this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;
      }
      this.stateService.changeState('normal');
    }));

  }

  updateOnBuyNow(): void {
    console.log("*** UPDATE updateOnBuyNow() !!!");
    this.disableAll = true;
    this.stateService.changeState('loading');
    // save data
    var sender = this.user.firstName;
    var paymail = this.user.paymail;
    var bidTime = firebase.firestore.FieldValue.serverTimestamp();
    var price = this.currentTopPrice;
    var buyNowPrice = this.buyNowPrice;
    var history: BidHistory;

    history = {
      sender: sender,
      paymail: paymail,
      bidTime: bidTime,
      price: buyNowPrice,
    }

    this.SelltokenService.addHistoryToToken(this.config.data.selltokenId,history).then(
      res => {
          //if (this.selltoken.selectedAuctionId){
            this.SelltokenService.updateSellTokenWithAuction(this.config.data.selltokenId, buyNowPrice, history.paymail, res.id, this.totalBidCount,true, '', '');
          //  this.toastrService.info("Bid Successfully Updated!");
          //}

          this.SelltokenService.updateAuctionAfterBuyNow(this.config.data.selltokenId, buyNowPrice, paymail, this.config.data.selltokenId, SelltokenStatus.APPROVED);

        this.ref.close(history);
        this.stateService.changeState('normal');
        this.toastrService.info("Buy Now Successfull");
      }
    ).catch( err => {
      this.toastrService.error(err);
      this.stateService.changeState('normal');
      this.disableAll = false;
    });
  }

  onErrorFromMoneyButton(event): void {
    console.log('ERROR', event);
    if (event.message) {
      console.log(event.message);
    }
  }

  async onPaymentFromMoneyButton(event): Promise<void> {
    //event.senderPaymail;
    //event.spendAmountSatoshis,
    //event.senderPaymail,
    //event.txid,
    //event.rawtx,
    this.paymentFinished = true;
    this.updateOnBuyNow();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
