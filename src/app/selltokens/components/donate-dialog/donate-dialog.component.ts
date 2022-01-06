import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SelltokenService} from '../../services/selltoken.service';
import {AppStateService} from '../../../shared/services/app-state.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MoneyButtonComponent} from '../../../shared/components/money-button/money-button.component';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {UserService} from '../../../user/services/user.service';
import {AngularFireFunctions} from '@angular/fire/functions';
import {ISelltoken} from '../../models/selltoken.model';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

declare var Stripe;


@Component({
  selector: 'app-donate-dialog',
  templateUrl: './donate-dialog.component.html',
  styleUrls: ['./donate-dialog.component.scss']
})
export class DonateDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('moneyButton') moneyButton: MoneyButtonComponent;
  @ViewChild('cardElement') cardElement: ElementRef;
  title = 'app';
  submitted = false;
  totalAmount = 1;
  comment: string;
  selltoken: ISelltoken;
  selltokenAddress: string;
  selltokenId: string;
  selltokenImageUrl: string;
  selltokenTitle: string;
  selltokenUrl: string;
  currentselltokenDonation: number;
  currentselltokenDonationInSatoshis: number;
  selltokenOwnerUserEmail: string;
  targetInEur: number;
  userEmail: string;
  userAddress: string;
  userLinkAddress: string;
  userId: string;
  outputs: {
    to?: string,
    amount?: string,
    currency?: string,
    userId?: string,
  }[] = [];

  subs: Subscription[] = [];

  // Stripe
    stripe;
    card;
    cardErrors;
    loading = false;
    confirmation;


  constructor(private SelltokenService: SelltokenService,
              private stateService: AppStateService,
              private config: DynamicDialogConfig,
              private route: ActivatedRoute,
              private functions: AngularFireFunctions,
              private toastrService: ToastrService,
              private userService: UserService,
              private ref: DynamicDialogRef,
              private translateService: TranslateService) {
    this.userLinkAddress = this.route.snapshot.queryParams.address;
    this.userId = this.route.snapshot.queryParams.userId;
  }

  ngOnInit(): void {

    this.selltoken = this.config.data.selltoken;
    this.selltokenAddress = this.config.data.selltokenAddress;
    this.selltokenId = this.config.data.selltokenId;
    this.selltokenImageUrl = this.config.data.selltokenImageUrl;
    this.selltokenTitle = this.config.data.selltokenTitle;
    this.userEmail = this.config.data.userEmail;
    this.selltokenOwnerUserEmail = this.config.data.selltokenOwnerUserEmail;
    this.targetInEur = this.config.data.targetInEur;
    this.currentselltokenDonation = this.config.data.currentselltokenDonation;
    this.currentselltokenDonationInSatoshis = this.config.data.currentselltokenDonationInSatoshis;
    this.selltokenUrl = this.config.data.selltokenUrl;
    this.userAddress = this.config.data.userAddress;
    this.userLinkAddress = this.config.data.userLinkAddress;

    //console.log('FOUND ADDRESS', this.route.snapshot.queryParams.address);
    //console.log('USER FOUND ADDRESS', this.userLinkAddress);

    if (this.route.snapshot.queryParams.address) {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 4).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: this.route.snapshot.queryParams.address,
          amount: Number((this.totalAmount / 100)).toFixed(8).toString(),
          currency: 'USD'
        },
      ];
    } else {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 5).toFixed(8).toString(),
          currency: 'USD'
        }
      ];
    }

  }



  onErrorFromMoneyButton(event): void {
    console.log('ERROR', event);
    if (event.message) {
      this.toastrService.error(event.message, 'Error');
    } else {
      this.toastrService.error(this.translateService.instant('selltokens.donate-dialog.unexpected-error-occurred'));
    }
  }

  async handlePaymentForm(e): Promise<any> {
    e.preventDefault();

    const { source, error } = await this.stripe.createSource(this.card);

    if (error) {
      const cardErrors = error.message;
    } else {
      this.stateService.changeState('loading');
      const fun = this.functions.httpsCallable('createCheckoutSession');
      this.confirmation = await fun({source: source.id, unit_amount: this.totalAmount, selltokenName: this.selltoken.title}).toPromise();
      this.stateService.changeState('normal');
    }
  }

  async onPaymentFromMoneyButton(event): Promise<void> {
    const paymentOutputs = await event.paymentOutputs?.sort((a, b) => Number(a.satoshis) < Number(b.satoshis) ? 1 : -1);
    this.currentselltokenDonation += +event.amount;
    this.currentselltokenDonationInSatoshis += +paymentOutputs[0].satoshis;
    this.toastrService.success(this.translateService.instant('selltokens.donate-dialog.thank-you-for-contributing'));

    if (paymentOutputs[2]) {
      this.userService.sendWithdrawTransactionToTxt(
        paymentOutputs[2].satoshis,
        this.route.snapshot.queryParams.userEmail,
        event.txid,
        this.route.snapshot.queryParams.userId,
        false
      ).subscribe(res => console.log(res),
      (err) => this.toastrService.error(this.translateService.instant('donate-dialog.on-payment.moneybutton-error')));
    }

    this.SelltokenService.getCurrentBsvPriceInUsd()
      .then((res: any) => {
        console.log('CURRENT selltoken DONATION IN SATOSHIS TO USD', (this.currentselltokenDonationInSatoshis / 100000000) * res.rate);
        console.log('TARGET IN USD', this.targetInEur);
        if (Number(((this.currentselltokenDonationInSatoshis / 100000000) * res.rate).toFixed(2)) >= this.targetInEur) {
          //this.toastrService.success(this.translateService.instant('selltokens.donate-dialog.selltoken-target-reached'));
          //this.SelltokenService.sendReachedEmail(this.selltokenOwnerUserEmail, window.location.href);
          this.SelltokenService
            .createOrUpdateselltoken(
              {
                currentDonation: this.currentselltokenDonation,
                totalSatoshisDonated: this.currentselltokenDonationInSatoshis,
                isselltokenFullyDonated: true
              }, true, this.selltokenId)
            .then(() => {
              this.stateService.changeState('normal');
            });
        } else {
          this.SelltokenService
            .createOrUpdateselltoken(
              {
                currentDonation: this.currentselltokenDonation,
                totalSatoshisDonated: this.currentselltokenDonationInSatoshis
              }, true, this.selltokenId)
            .then(() => {
              this.stateService.changeState('normal');
            });
        }
      });

    this.SelltokenService
      .sendDonationDataToTxT(
        event.spendAmountSatoshis,
        this.selltokenId,
        this.selltokenImageUrl,
        this.selltokenTitle,
        event.senderPaymail,
        event.txid,
        event.rawtx,
        this.comment ? this.comment : '',
        this.selltokenUrl,
        paymentOutputs[0] ? paymentOutputs[0].satoshis : '',
        paymentOutputs[1] ? paymentOutputs[1].satoshis : '',
        event.feeAmountSatoshis,
        paymentOutputs[2] ? paymentOutputs[2].satoshis : '',
      )
      .then((res) => {
        console.log(res);
        this.comment = '';
      })
      .catch((err) => console.log(err));
  }

  onAmountChange(event): void {
    this.totalAmount = event;
    if (this.route.snapshot.queryParams.address) {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 4).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: this.route.snapshot.queryParams.address,
          amount: Number((this.totalAmount / 100)).toFixed(8).toString(),
          currency: 'USD'
        },
      ];
    } else {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 5).toFixed(8).toString(),
          currency: 'USD'
        }
      ];
    }
    setTimeout(() => {
      console.log('OUTPUTS', this.outputs);
      this.moneyButton.refreshMoneyButton();
    }, 1500);
  }

  onCommentChange(): void {
    if (this.route.snapshot.queryParams.address) {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 4).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: this.route.snapshot.queryParams.address,
          amount: Number((this.totalAmount / 100)).toFixed(8).toString(),
          currency: 'USD'
        },
      ];
    } else {
      this.outputs = [
        {
          to: this.selltokenAddress,
          amount: Number((this.totalAmount / 100) * 95).toFixed(8).toString(),
          currency: 'USD'
        },
        {
          to: 'tokenpow@moneybutton.com',
          amount: Number((this.totalAmount / 100) * 5).toFixed(8).toString(),
          currency: 'USD'
        }
      ];
    }
    setTimeout(() => {
      console.log('onCommentChange - OUTPUTS', this.outputs);
      this.moneyButton.refreshMoneyButton();
    }, 1500);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(environment.stripe_public);
    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          iconColor: 'black',
          color: 'black',
          fontWeight: 500,
          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          ':-webkit-autofill': {
            color: '#fce883',
          },
          '::placeholder': {
            color: '#87BBFD',
          },
        },
        invalid: {
          iconColor: '#FFC7EE',
          color: '#FFC7EE',
        },
      },
    });
    this.card.mount(this.cardElement.nativeElement);

    this.card.addEventListener('change', ({error}) => {
      this.cardErrors = error && error.message;
    });
  }
}
