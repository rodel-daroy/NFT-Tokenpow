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

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.scss']
})
export class BidDialogComponent implements OnInit, OnDestroy {
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
  selltoken: ISelltoken;
  address: any;
  lastEscrow: number;
  show: boolean;
  callOnce: boolean;
  donateAddress: string;
  collectionId: any;
  increment: any = 0.5
  countdownTime: any;
  interval: any;
  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private stateService: AppStateService,
              private authService: AuthService,
              private cryptoService: CryptoService,
              private SelltokenService: SelltokenService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    console.log("data: ", this.config.data)
    this.disableAll = false;
    this.paymentFinished = false;
    this.totalBidCount = this.config.data.totalBidCount;
    this.currentTopPrice = this.config.data.tokenPrice;
    this.collectionId = this.config.data.collectionId;
    this.increment = this.config.data.increment;
    this.countdownTime = this.config.data.countdownTime;
    this.donateAddress = this.config.data.donateAddress;

    if (this.totalBidCount != 0) {
      this.interval = setInterval(() => {
        this.countdownTime -= 1
      }, 1000)
    } else {
      this.increment = 0
    }
    this.bidValue = this.currentTopPrice + this.increment;
    console.log("donate address is : ",this.donateAddress);
    this.subs.push(this.SelltokenService.getSingleselltoken(this.config.data.selltokenId).subscribe((selltoken: ISelltoken) => {
      this.currentTopPrice = selltoken.currentTokenPrice;
      this.selltoken = selltoken;
      // check if ;
      if ( this.currentTopPrice > this.bidValue) 
        this.show = false;
    }));
    this.show = true;
    this.lastEscrow = 0;
    this.callOnce = false;
    this.subs.push(this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;

        //create bsv address
        if (this.callOnce == true)
        {
          return;
          this.stateService.changeState('normal');
        }
        this.callOnce = true;
        //this.SelltokenService.getSellTokenBidEscrowAddressAndMoney(this.config.data.selltokenId,this.user.paymail).subscribe(
        //  (res) => {

       //     var myBidHistory:Array<BidHistory> = res;
       //     var lastBidHistory:BidHistory;
       //     if (myBidHistory.length > 0)
       //       lastBidHistory = myBidHistory[0];
       //     if ( lastBidHistory == null || lastBidHistory?.escrowAddress == null)
       //     {
              // crease address;
              this.SelltokenService.generateAddressForselltoken().subscribe(
                (res) => {
                  this.checked = true;
                  this.outputs = [
                    {
                      to: res.address,
                      amount: Number((this.bidValue / 100) * 105).toFixed(8).toString(),
                      currency: 'USD'
                    },
                  ];
                  setTimeout(() => {
                    console.log('onInput - OUTPUTS', this.outputs);
                    this.moneyButton?.refreshMoneyButton();
                  }, 1500);
                  this.address = res;
                  this.address.privateKey = this.cryptoService.set(
                    this.address.privateKey
                  );
                  this.stateService.changeState('normal');
                }
                );

        //     }else
        //     {
        //       // get last escrow money
        //       this.lastEscrow = lastBidHistory.price;
        //       this.address = lastBidHistory.escrowAddress;
        //       this.outputs = [
        //         {
        //           to: this.address.address,
        //           amount: Number(((this.bidValue - this.lastEscrow) / 100) * 105).toFixed(8).toString(),
        //           currency: 'USD'
        //         },
        //       ];
        //       setTimeout(() => {
        //         console.log('onInput - OUTPUTS', this.outputs);
        //         this.moneyButton?.refreshMoneyButton();
        //       }, 1500);
        //     }
        //     this.stateService.changeState('normal');
        //   }

        // );
        this.stateService.changeState('normal');

      }
    }));

  }

  percentageOf(amount, percentage): number {
    return Number((amount / 100) * percentage);
  }


  percentage100(amount): number {
    return this.percentageOf(amount, 100);
  }

  percentage05(amount): number {
    return this.percentageOf(amount, 5);
  }

  confirm() : void {
    if ( this.currentTopPrice >= this.bidValue) {
      this.toastrService.info("please bid higher value");
      this.show = false;
    }else{
      this.show = true;
      if (!this.selltoken) return;
      if (!this.address) return;
        this.outputs = [
          {
            to: this.address.address,
            amount: Number(((this.bidValue - this.lastEscrow) / 100) * 105).toFixed(8).toString(),
            currency: 'USD'
          },
        ];
        this.moneyButton?.refreshMoneyButton();
    }

  }


  onInput(event): void {
    this.bidValue = event;
    if (this.currentTopPrice + this.increment > this.bidValue ) {
      this.toastrService.info(`please bid higher value then ${this.currentTopPrice + this.increment}`);
      this.show = false;
    } else {
      this.show = true;
      if (!this.selltoken) return;
      if (!this.address) return;
        this.outputs = [
          {
            to: this.address.address,
            amount: Number(((this.bidValue - this.lastEscrow) / 100) * 105).toFixed(8).toString(),
            currency: 'USD'
          },
        ];
        setTimeout(() => {
          console.log('onInput - OUTPUTS', this.outputs);
          this.moneyButton?.refreshMoneyButton();
        }, 1500);
    }

    /*
    if (!this.selltoken) return;
    if (!this.address) return;
    this.outputs = [
      {
        to: this.address.address,
        amount: Number(((this.bidValue - this.lastEscrow) / 100) * 105).toFixed(8).toString(),
        currency: 'USD'
      },
    ];
    console.log(this.outputs);

    setTimeout(() => {
      console.log('onInput - OUTPUTS', this.outputs);
      this.moneyButton?.refreshMoneyButton();
    }, 1500);
    */
  }


  updateBid(): void {
    this.disableAll = true;
    this.stateService.changeState('loading');
    // save data
    var sender = this.user.firstName;
    var senderUid = this.user.uid;
    var paymail = this.user.paymail;
    var bidTime = firebase.firestore.FieldValue.serverTimestamp();
    var price = this.bidValue;
    var history: BidHistory;
    history = {
      sender: sender,
      senderUid: senderUid,
      paymail: paymail,
      bidTime: bidTime,
      price: price,
    }

    history.escrowAddress = {};
    history.escrowAddress.address = this.address.address;
    history.escrowAddress.privateKey = this.address.privateKey;
    history.escrowAddress.publicKey = this.address.publicKey;
    if (this.config.data.collection_id) {
      this.SelltokenService.updateNotificationForCollection(this.config.data.collection_id, this.config.data.notifications).then(res => {
        console.log("updateNotiforCollection", res)
      })
    }
    this.SelltokenService.updateNotification(this.config.data.selltokenId, this.config.data.notifications).then(noti => {
      this.SelltokenService.addHistoryToToken(this.config.data.selltokenId,history).then(
        res => {
          if ( this.currentTopPrice < this.bidValue)
          {
            this.SelltokenService.updateSellTokenWithAuction(this.config.data.selltokenId, history.price, history.paymail, res.id, this.totalBidCount,false, this.donateAddress, this.collectionId);
            this.toastrService.info("Bid Successfully Updated!");
          }
          else{
            if (!this.selltoken.selectedAuctionId && this.currentTopPrice == this.bidValue)
            {
              this.SelltokenService.updateSellTokenWithAuction(this.config.data.selltokenId, history.price, history.paymail, res.id, this.totalBidCount,false, this.donateAddress, this.collectionId);
              this.toastrService.info("Bid Successfully Updated!");
            }
            else{
              this.SelltokenService.updateSellTokenWithNoAuction(this.config.data.selltokenId,this.totalBidCount, this.donateAddress);
              this.toastrService.error("To win, bid higher than others !");
            }
          }
  
          this.ref.close(history);
          this.stateService.changeState('normal');
        }
      ).catch( err=>{
        this.toastrService.error(err);
        this.stateService.changeState('normal');
        this.disableAll = false;
      });
    })
  }


  onErrorFromMoneyButton(event): void {
    console.log('ERROR', event);
    if (event.message) {
      console.log(event.message);
      this.toastrService.error(event.message);
    }
  }

  async onPaymentFromMoneyButton(event): Promise<void> {
    //event.senderPaymail;
    //event.spendAmountSatoshis,
    //event.senderPaymail,
    //event.txid,
    //event.rawtx,
    this.paymentFinished = true;
    this.updateBid();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    clearInterval(this.interval)
  }

}
