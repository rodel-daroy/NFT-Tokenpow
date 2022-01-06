import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AppStateService } from '../../../shared/services/app-state.service';
import { MoneyButtonComponent } from '../../../shared/components/money-button/money-button.component';
import { ActivatedRoute } from '@angular/router';
import { SelltokenService } from '../../services/selltoken.service';
import { ISelltoken } from '../../models/selltoken.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../user/services/user.service';
import { PaymentService } from '../../services/payment.service';
import { Location } from '@angular/common';
import {
  faLock,
  faHandHoldingUsd,
  faArrowRight,
  faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { AnimationOptions } from 'ngx-lottie';
import { Subscription } from 'rxjs';
import { DonateService } from '../../services/donate.service';
import { TranslateService } from '@ngx-translate/core';
import { PayprestoComponent } from '../../components/paypresto/paypresto.component';
import { DonateRequest } from '../../models/donate-request.model';
import { DialogService } from 'primeng/dynamicdialog';
import { PerkDialogComponent } from '../../components/perk-dialog/perk-dialog.component';
import { PerkService } from '../../services/perk.service';
import { SelltokenStatus } from '../../enums/selltoken-status.enum';
declare var Stripe;

interface PaymentPresto {
  invoice: {
    created_at: string;
    satoshis: number;
    service_fee: number;
    usd_rate: string;
  };
  options: {
    outputs: {
      satoshis: number;
      to: string;
    }[];
  };
}

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss'],
})
export class DonatePageComponent implements OnInit, AfterViewInit {
  @ViewChild('moneyButton') moneyButton: MoneyButtonComponent;
  @ViewChild('cardElement') cardElement: ElementRef;
  @ViewChild('paymentCard') paymentCard: ElementRef;
  @ViewChild('presto') presto: PayprestoComponent;
  creditCard: AnimationOptions = {
    path: '/assets/animations/credit-card.json',
    loop: false,
  };

  hand: AnimationOptions = {
    path: '/assets/animations/hand.json',
    loop: false,
  };

  completedAnim: AnimationOptions = {
    path: '/assets/animations/completed.json',
  };

  stripe;
  display = false;
  card;
  cardErrors;
  isCardLoading = true;
  selltoken: ISelltoken;
  comment: string;
  paymentIntent;
  clientSecret;
  elements;
  faLock = faLock;
  faHandHoldingUsd = faHandHoldingUsd;
  userEmail: string;
  isFlippedStripe = false;
  isPayedWithCard = false;
  isPayedWithMB = false;
  payerName = '';
  subs$: Subscription[] = [];
  termsChecked = false;
  env = environment;
  captchaResponse;
  currentPriceOfBsvInEur;
  currentPriceOfUsdInEur;
  currentPriceOfUsdInBsv;
  currentPriceOfEurInBsv;
  payPrestoEvent: PaymentPresto;
  mobileView = false;

  // moneybutton
  outputs: {
    to?: string;
    amount?: string;
    currency?: string;
    userId?: string;
  }[] = [];

  totalAmount = 1;
  totalPlusFeeAmount = 1;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  constructor(
    private stateService: AppStateService,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private userService: UserService,
    private SelltokenService: SelltokenService,
    private paymentService: PaymentService,
    public donateService: DonateService,
    private location: Location,
    private perkService: PerkService,
    private translateService: TranslateService,
    private dialogService: DialogService
  ) {
    this.stripe = Stripe(environment.stripe_public);
    this.elements = this.stripe.elements();
  }

  ngOnInit(): void {
    this.mobileView = window.innerWidth < 958;

    this.SelltokenService.getCurrentBsvPriceInUsd().then(
      (res: any) => {
        this.currentPriceOfBsvInEur = res.rate;
      }
    );

    // this.SelltokenService.getCurrentEurPriceInBsv().then(
    //   (res: { BSV: number }) => {
    //     this.currentPriceOfEurInBsv = res.BSV;
    //   }
    // );

    // this.SelltokenService.getCurrentUsdPrice().then((res: { USD: number }) => {
      this.currentPriceOfUsdInEur = 1;
    // });

    this.SelltokenService.getCurrentUsdPriceInBsv().then(
      (res: any) => {
        this.currentPriceOfUsdInBsv = (1 / res.rate);
      }
    );

    // this.SelltokenService.getCurrentUsdPriceInBsv().then(
    //   (res: { BSV: number }) => {
    //     this.currentPriceOfUsdInBsv = res.BSV;
    //   }
    // );

    this.stateService.changeState('loading');

    this.subs$.push(
      this.SelltokenService.getSingleselltoken(
        this.route.snapshot.params.id
      ).subscribe((res) => {
        console.log(this.selltoken);
        this.selltoken = res;
        this.totalAmount = this.selltoken.currentTokenPrice;

        this.outputs = [
          {
            to: this.selltoken.bsvAddress.address,
            amount: Number(this.totalAmount).toFixed(8).toString(),
            currency: 'USD',
          },
          {
            to: 'tokenpow@moneybutton.com',
            amount: Number((this.totalAmount / 100) * 5)
              .toFixed(8)
              .toString(),
            currency: 'USD',
          },
        ];
      })
    );
    this.stateService.changeState('normal');
    setTimeout(() => {
      this.onInput(this.totalAmount);
    }, 1500);
  }

  async handlePaymentForm(e): Promise<any> {
    if (this.totalAmount <= 100) {
      e.preventDefault();
      this.stateService.changeState('loading');
      this.paymentService
        .createIntent(this.totalAmount.toFixed(0))
        .toPromise()
        .then((data) => {
          console.log('DATA: ', data);
          this.paymentIntent = data;
          console.log('PAYMENT INTENT: ', this.paymentIntent);
          this.clientSecret = this.paymentIntent.client_secret;

          this.stripe
            .confirmCardPayment(this.clientSecret, {
              payment_method: {
                card: this.card,
                billing_details: {
                  name: this.payerName?.toString(),
                },
              },
            })
            .then((result) => {
              let tempAmount = this.totalAmount;
              console.log('RESULT', result);
              this.paymentIntent = result.paymentIntent;

              console.log('Handled intent: ', this.paymentIntent);

              if (result.error) {
                console.log('Error on intent', result.error);
                this.stateService.changeState('normal');
              }

              if (this.paymentIntent.status === 'succeeded') {
                //this.paymentService.sendNewContributionEmail(this.selltoken.userEmail, window.location.href.split('/buy')[0]);

                this.toastrService.success(
                  this.translateService.instant(
                    'selltokens.donate-page.thank-you-for-contributing'
                  )
                );
                this.isPayedWithCard = true;
                const fee = Number(((tempAmount / 100) * 2.9 + 0.3).toFixed(2));
                //tempAmount = tempAmount - fee;
                this.SelltokenService.createDonateRequest({
                  sharedLinkUserEmail: this.donateService.getValue()?.userEmail
                    ? this.donateService.getValue()?.userEmail
                    : '',
                  sharedLinkUserId: this.donateService.getValue()?.userId
                    ? this.donateService.getValue()?.userId
                    : '',
                  comment: this.comment ? this.comment : '',
                  link: window.location.href.split('donate')[0],
                  payedToselltoken: this.donateService.getValue()?.address
                    ? Number((tempAmount / 100) * 100).toFixed(8)
                    : Number((tempAmount / 100) * 100).toFixed(8),
                  payedToGoBitFundMe: Number((tempAmount / 100) * 5)
                    .toFixed(8)
                    .toString(),
                  selltokenId: this.selltoken.uid,
                  createdAt: this.paymentIntent.created,
                  status: 'waiting',
                  stripeFee: fee,
                  selltokenAddress: this.selltoken.bsvAddress.address,
                  userAddress: this.donateService.getValue()?.address
                    ? this.donateService.getValue()?.address
                    : '',
                  totalAmount: tempAmount,
                  from: this.payerName ? this.payerName : '',
                  outputs: this.donateService.getValue()?.address
                    ? [
                        {
                          to: this.selltoken.bsvAddress.address,
                          amount: Number((tempAmount / 100) * 100)
                            .toFixed(8)
                            .toString(),
                          currency: 'USD',
                        },
                        {
                          to: 'tokenpow@moneybutton.com',
                          amount: Number((tempAmount / 100) * 5)
                            .toFixed(8)
                            .toString(),
                          currency: 'USD',
                        },
                      ]
                    : [
                        {
                          to: this.selltoken.bsvAddress.address,
                          amount: Number((tempAmount / 100) * 100)
                            .toFixed(8)
                            .toString(),
                          currency: 'USD',
                        },
                        {
                          to: 'tokenpow@moneybutton.com',
                          amount: Number((tempAmount / 100) * 5)
                            .toFixed(8)
                            .toString(),
                          currency: 'USD',
                        },
                      ],
                } as DonateRequest);
                this.stateService.changeState('normal');
              }
            });
        })
        .catch((err) => {
          console.error(err);
          this.stateService.changeState('normal');
          this.toastrService.error(
            this.translateService.instant(
              'selltokens.donate-page.error-occurred-while-contributing-if-error-remains-please-contact-our-team'
            )
          );
        });
    } else {
      this.toastrService.error(
        this.translateService.instant(
          'selltokens.donate-page.maximum-amount-to-contribute-with-credit-card-is-100-eur'
        )
      );
    }
  }

  onErrorFromMoneyButton(event): void {
    console.log('ERROR', event);
    if (event.message) {
      this.toastrService.error(event.message);
    } else {
      this.toastrService.error(
        this.translateService.instant(
          'selltokens.donate-page.unexpected-error-occurred'
        )
      );
    }
  }

  async onPaymentFromMoneyButton(event): Promise<void> {
    this.isPayedWithMB = true;
    const paymentOutputs = await event.paymentOutputs?.sort((a, b) =>
      Number(a.satoshis) < Number(b.satoshis) ? 1 : -1
    );
    //this.paymentService.sendNewContributionEmail(this.selltoken.userEmail, window.location.href.split('/buy')[0]);

    this.toastrService.success(
      this.translateService.instant(
        'selltokens.donate-page.thank-you-for-contributing'
      )
    );
    this.selltoken.totalSatoshisDonated += +paymentOutputs[0].satoshis;
    this.selltoken.currentDonation += +paymentOutputs[0].amount;
    this.selltoken.buyerAddress = event.senderPaymail;
    if (paymentOutputs[2]) {
      this.subs$.push(
        this.userService
          .sendWithdrawTransactionToTxt(
            paymentOutputs[2].satoshis,
            this.donateService.getValue()?.userEmail,
            event.txid,
            this.donateService.getValue()?.userId,
            false,
            this.selltoken.uid,
            event.senderPaymail,
            paymentOutputs[2].address,
            '',
            true
          )
          .subscribe((res) => console.log(res))
      );
    }
    this.SelltokenService.getCurrentBsvPriceInUsd()
      .then((res: any) => {
        if (
          Number(
            (
              (this.selltoken.totalSatoshisDonated / 100000000) *
              res.rate
            ).toFixed(2)
          ) >= this.selltoken.targetInEur
        ) {
          //this.toastrService.success(this.translateService.instant('selltokens.donate-page.selltoken-target-reached'));
          //this.SelltokenService.sendReachedEmail(this.selltoken.userEmail, window.location.href);
          this.SelltokenService.createOrUpdateselltoken(
            {
              status: SelltokenStatus.AUCTION_FINISHED,
              currentDonation: this.selltoken.currentDonation,
              buyerAddress: this.selltoken.buyerAddress,
              totalSatoshisDonated: this.selltoken.totalSatoshisDonated,
              isselltokenFullyDonated: true,
            },
            true,
            this.selltoken.uid
          )
            .then(async () => {
              await this.SelltokenService.changeselltokenProperty(
                1,
                this.selltoken?.uid,
                'totalContributions'
              );

              this.stateService.changeState('normal');
            })
            .catch((err) => {
              this.stateService.changeState('normal');
              console.log(err);
              this.toastrService.error(
                this.translateService.instant(
                  'donate-page.error-while-updating-selltoken'
                ),
                'Error'
              );
            });
        } else {
          this.SelltokenService.createOrUpdateselltoken(
            {
              status: SelltokenStatus.AUCTION_FINISHED,
              buyerAddress: this.selltoken.buyerAddress,
              currentDonation: this.selltoken.currentDonation,
              totalSatoshisDonated: this.selltoken.totalSatoshisDonated,
            },
            true,
            this.selltoken.uid
          )
            .then(async () => {
              await this.SelltokenService.changeselltokenProperty(
                1,
                this.selltoken?.uid,
                'totalContributions'
              );

              this.stateService.changeState('normal');
            })
            .catch((err) => {
              this.stateService.changeState('normal');
              console.log(err);
              this.toastrService.error(
                this.translateService.instant(
                  'donate-page.error-while-updating-selltoken'
                ),
                'Error'
              );
            });
        }
      })
      .catch(() => {
        this.stateService.changeState('normal');
        this.toastrService.error(
          this.translateService.instant(
            'donate-page.cannot-get-current-bsv-price'
          ),
          'Error'
        );
      });

    this.SelltokenService.sendDonationDataToTxT(
      event.spendAmountSatoshis,
      this.selltoken.uid,
      this.selltoken.photo_url,
      this.selltoken.title,
      event.senderPaymail,
      event.txid,
      event.rawtx,
      this.comment ? this.comment : '',
      window.location.href,
      paymentOutputs[0] ? paymentOutputs[0].satoshis : '',
      paymentOutputs[1] ? paymentOutputs[1].satoshis : '',
      event.feeAmountSatoshis,
      paymentOutputs[2] ? paymentOutputs[2].satoshis : ''
    )
      .then((res) => {
        console.log(res);
        this.comment = '';
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createCardForm(): void {
    this.card = this.elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });
    this.card.mount(this.cardElement.nativeElement);
    this.isCardLoading = false;

    this.card.addEventListener('change', ({ error }) => {
      this.cardErrors = error && error.message;
    });
  }

  async ngAfterViewInit(): Promise<void> {
    this.createCardForm();
  }

  flipCard(): void {
    this.paymentCard.nativeElement.classList.toggle('is-flipped');
    this.isFlippedStripe = !this.isFlippedStripe;
  }

  back(): void {
    this.location.back();
  }

  async onPaymentFromPaypresto(paymentEvent: PaymentPresto): Promise<any> {
    this.toastrService.success(
      this.translateService.instant(
        'selltokens.donate-page.thank-you-for-contributing'
      )
    );
    //this.paymentService.sendNewContributionEmail(this.selltoken.userEmail, window.location.href.split('/buy')[0]);
    this.display = false;
    this.payPrestoEvent = paymentEvent;
    const paymentOuputs = paymentEvent.options.outputs
      .filter((x) => x.satoshis)
      .sort((a, b) => (Number(a.satoshis) < Number(b.satoshis) ? 1 : -1));
    this.selltoken.buyerAddress = this.selltoken.auctionPaymail;
    if (this.donateService.getValue()?.userEmail && paymentOuputs[2]) {
      this.paymentService.sendNewContributionRewardEmail(
        this.donateService.getValue()?.userEmail,
        window.location.href.split('/buy')[0]
      );
    }
    this.selltoken.totalSatoshisDonated += paymentOuputs[0].satoshis;
    this.selltoken.currentDonation += Number(
      (
        (paymentOuputs[0].satoshis / 100000000) *
        this.currentPriceOfBsvInEur
      ).toFixed(2)
    );

    if (
      Number(
        (
          (this.selltoken.totalSatoshisDonated / 100000000) *
          this.currentPriceOfBsvInEur
        ).toFixed(2)
      ) >= this.selltoken.targetInEur
    ) {
      //this.SelltokenService.sendReachedEmail(this.selltoken.userEmail, window.location.href);
      this.SelltokenService.createOrUpdateselltoken(
        {
          status: SelltokenStatus.AUCTION_FINISHED,
          buyerAddress: this.selltoken.buyerAddress,
          currentDonation: this.selltoken.currentDonation,
          totalSatoshisDonated: this.selltoken.totalSatoshisDonated,
          isselltokenFullyDonated: true,
        },
        true,
        this.selltoken.uid
      )
        .then(async () => {
          await this.SelltokenService.changeselltokenProperty(
            1,
            this.selltoken?.uid,
            'totalContributions'
          );
          this.stateService.changeState('normal');
        })
        .catch((err) => {
          this.stateService.changeState('normal');
          console.log(err);
          this.toastrService.error(
            this.translateService.instant(
              'donate-page.error-while-updating-selltoken'
            ),
            'Error'
          );
        });
    } else {
      this.SelltokenService.createOrUpdateselltoken(
        {
          status: SelltokenStatus.AUCTION_FINISHED,
          buyerAddress: this.selltoken.buyerAddress,
          currentDonation: this.selltoken.currentDonation,
          totalSatoshisDonated: this.selltoken.totalSatoshisDonated,
        },
        true,
        this.selltoken.uid
      )
        .then(async () => {
          await this.SelltokenService.changeselltokenProperty(
            1,
            this.selltoken?.uid,
            'totalContributions'
          );
          this.stateService.changeState('normal');
        })
        .catch((err) => {
          this.stateService.changeState('normal');
          console.log(err);
          this.toastrService.error(
            this.translateService.instant(
              'donate-page.error-while-updating-selltoken'
            ),
            'Error'
          );
        });
    }
  }

  showPayPresto(): void {
    //if (this.captchaResponse && this.termsChecked) {
    this.display = !this.display;
    //} else {
    //  this.toastrService.info(this.translateService.instant('donate-page.must-agree-with-tc-and-resolve-recaptcha'), 'Info');
    //}
  }

  onTxPushedFromPayPresto(event): void {
    console.log(event);
    console.log(this.payPrestoEvent);
    const paymentOutputs = this.payPrestoEvent.options.outputs
      .filter((x) => x.satoshis)
      .sort((a, b) => (Number(a.satoshis) < Number(b.satoshis) ? 1 : -1));
    console.log('PaymentOutputs:', paymentOutputs);
    /*
    this.SelltokenService.sendDonationDataToTxT(
      this.getTotalAmountOfDonationFromPayPresto(paymentOutputs),
      this.selltoken.uid,
      this.selltoken.photo_url,
      this.selltoken.title,
      '',
      event.txid,
      event.rawtx,
      this.comment ? this.comment : '',
      window.location.href,
      this.getPayedToselltokenFromPayPresto(paymentOutputs),
      this.getPayedToGoBitFundMeFomPayPresto(paymentOutputs),
      this.getFeeAmountInSatoshisFromPayPresto(paymentOutputs),
      this.getPayedToSharedLinkOwnerFromPayPresto(paymentOutputs)
    )
      .then((res) => {
        this.comment = '';
      })
      .catch((err) => {
        console.log(err);
      });

    if (paymentOutputs[2]) {
      this.subs$.push(
        this.userService
          .sendWithdrawTransactionToTxt(
            paymentOutputs[2].satoshis,
            this.donateService.getValue()?.userEmail,
            event.txid,
            this.donateService.getValue()?.userId,
            false,
            this.selltoken.uid,
            '',
            paymentOutputs[2].to,
            '',
            true
          )
          .subscribe((res) => console.log(res))
      );
    }
    */
  }

  getTotalAmountOfDonationFromPayPresto(paymentOutputs): number {
    console.log(
      'TOTAL AMOUNT OF DONATION: ',
      this.getPayedToselltokenFromPayPresto(paymentOutputs) +
        this.getFeeAmountInSatoshisFromPayPresto(paymentOutputs) +
        this.getPayedToGoBitFundMeFomPayPresto(paymentOutputs) +
        this.getPayedToSharedLinkOwnerFromPayPresto(paymentOutputs)
    );
    return (
      this.getPayedToselltokenFromPayPresto(paymentOutputs) +
      this.getFeeAmountInSatoshisFromPayPresto(paymentOutputs) +
      this.getPayedToGoBitFundMeFomPayPresto(paymentOutputs) +
      this.getPayedToSharedLinkOwnerFromPayPresto(paymentOutputs)
    );
  }

  getPayedToselltokenFromPayPresto(paymentOutputs): any {
    console.log(
      'Payed to selltoken: ',
      paymentOutputs[0] ? paymentOutputs[0].satoshis : ''
    );
    return paymentOutputs[0] ? paymentOutputs[0].satoshis : '';
  }

  getPayedToGoBitFundMeFomPayPresto(paymentOutputs): any {
    console.log(
      'Payed to tokenpow: ',
      paymentOutputs[1] ? paymentOutputs[1].satoshis : ''
    );
    return paymentOutputs[1] ? paymentOutputs[1].satoshis : '';
  }

  // Should return all satoshis which was payed as fee also to PayPresto
  getFeeAmountInSatoshisFromPayPresto(paymentOutputs): any {
    console.log(
      'Fee: ',
      this.payPrestoEvent.invoice.service_fee + // Service Fee
        (this.payPrestoEvent.invoice.satoshis +
          this.payPrestoEvent.invoice.service_fee - // TotalSatoshis + Service Fee
          ((paymentOutputs[0] ? paymentOutputs[0].satoshis : 0) + // All Outputs
            (paymentOutputs[1] ? paymentOutputs[1].satoshis : 0) +
            (paymentOutputs[2] ? paymentOutputs[2].satoshis : 0) +
            this.payPrestoEvent.invoice.service_fee)) // Service Fee
    );
    // Service fee + (TotalSatoshis + Service Fee) - (All outputs + Service Fee)
    return (
      this.payPrestoEvent.invoice.service_fee + // Service Fee
      (this.payPrestoEvent.invoice.satoshis +
        this.payPrestoEvent.invoice.service_fee - // TotalSatoshis + Service Fee
        ((paymentOutputs[0] ? paymentOutputs[0].satoshis : 0) + // All Outputs
          (paymentOutputs[1] ? paymentOutputs[1].satoshis : 0) +
          (paymentOutputs[2] ? paymentOutputs[2].satoshis : 0) +
          this.payPrestoEvent.invoice.service_fee)) // Service Fee
    );
  }

  getPayedToSharedLinkOwnerFromPayPresto(paymentOutputs): any {
    return paymentOutputs[2] ? paymentOutputs[2].satoshis : '';
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

  onInput(event): void {
    this.totalAmount = event;
    if (!this.selltoken) return;

    this.outputs = [
      {
        to: this.selltoken.bsvAddress.address,
        amount: this.percentage100(this.totalAmount).toFixed(8).toString(),
        currency: 'USD',
      },
      {
        to: 'tokenpow@moneybutton.com',
        amount: this.percentage05(this.totalAmount).toFixed(8).toString(),
        currency: 'USD',
      },
    ];

    setTimeout(() => {
      console.log('onInput - OUTPUTS', this.outputs);
      this.moneyButton?.refreshMoneyButton();
      this.presto.refresh();
    }, 1500);
  }

  resolved(captchaResponse: string): void {
    this.captchaResponse = captchaResponse;
    setTimeout(() => {
      this.moneyButton?.refreshMoneyButton();
      this.presto.refresh();
    }, 500);
  }

  onCaptchaError(error): void {
    console.log(error);
  }

  onTermsInputChange(): void {
    setTimeout(() => {
      this.moneyButton?.refreshMoneyButton();
      this.presto.refresh();
    }, 500);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event): void {
    this.mobileView = event.target.innerWidth < 958;
  }

  openPerkDialog(): void {
    const ref = this.dialogService.open(PerkDialogComponent, {
      header: 'Claim perk',
      width: 'auto',
      styleClass: '',
      data: {
        perkCode: this.selltoken.perkCode,
        selltokenUrl:
          environment.baseUrl + '/tokens/token/' + this.selltoken.uid,
      },
    });

    ref.onClose.subscribe((info) => {
      this.perkService.savePerkRequest(info);
      this.perkService
        .sendEmailToselltokenOwner(this.selltoken.userEmail, info.message)
        .then((res) => {
          this.toastrService.success('Email has been sent to selltoken owner');
        })
        .catch((err) => this.toastrService.error(err));
    });
  }
}
