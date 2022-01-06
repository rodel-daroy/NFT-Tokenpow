import {Component, OnDestroy, OnInit} from '@angular/core';
import {DonateService} from '../../services/donate.service';
import {DonateRequest} from '../../../selltokens/models/donate-request.model';
import {of, Subscription} from 'rxjs';
import {AppStateService} from '../../../shared/services/app-state.service';
import {environment} from '../../../../environments/environment';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../../user/services/user.service';
import {switchMap, tap} from 'rxjs/operators';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {EurWithdrawalDeclineDialogComponent} from '../eur-withdrawal-decline-dialog/eur-withdrawal-decline-dialog.component';

@Component({
  selector: 'app-donate-requests',
  templateUrl: './donate-requests.component.html',
  styleUrls: ['./donate-requests.component.scss']
})
export class DonateRequestsComponent implements OnInit, OnDestroy {
  donations: DonateRequest[];
  subs: Subscription[] = [];
  clientId = environment.moneyButton.client_id;
  approvedDonations: DonateRequest[];
  declinedDonations: DonateRequest[];
  ref: DynamicDialogRef;

  constructor(private donateService: DonateService,
              private SelltokenService: SelltokenService,
              private toastrService: ToastrService,
              private userService: UserService,
              private dialogService: DialogService,
              private stateService: AppStateService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.subs.push(this.donateService
      .getAllDonateRequests()
      .subscribe(res => {
        this.donations = res;
        console.log(res);
        this.stateService.changeState('normal');
      }));
    this.subs.push(this.donateService.getAllApprovedRequests().subscribe(
      response => {
        this.approvedDonations = response;
        this.stateService.changeState('normal');
      }
    ));
    this.subs.push(this.donateService.getAllDeclinedRequests().subscribe(
      res => {
        this.declinedDonations = res;
        this.stateService.changeState('normal');
      }
    ));
  }

  getSingleselltoken(donation) {
    this.SelltokenService.getSingleselltokenWithoutLiveData(donation.selltokenId).subscribe(res => console.log(res));
  }

  async onPaymentSuccess(event, donation: DonateRequest): Promise<void> {
    const paymentOutputs = await event.paymentOutputs?.sort((a, b) => Number(a.satoshis) < Number(b.satoshis) ? 1 : -1);
    let currentselltoken: ISelltoken;
    this.SelltokenService.getSingleselltokenWithoutLiveData(donation.selltokenId)
      .pipe(
        tap(console.log),
        switchMap(selltoken => {
          //console.log('selltoken: ', selltoken);
          currentselltoken = selltoken;
          currentselltoken.currentDonation += +paymentOutputs[0].amount;
          currentselltoken.totalSatoshisDonated += +paymentOutputs[0].satoshis;
          if (paymentOutputs[2]) {
            return this.userService.sendWithdrawTransactionToTxt(
              paymentOutputs[2].satoshis,
              donation.sharedLinkUserEmail,
              event.txid,
              donation.sharedLinkUserId,
              false,
              donation.selltokenId,
              event.senderPaymail,
              paymentOutputs[2].address,
              '',
              true
            );
          } else {
            return of(currentselltoken);
          }
        })
      )
      .subscribe(async () => {
        this.SelltokenService.getCurrentBsvPriceInUsd()
          .then((res: any) => {
            //console.log('CURRENT PRICE OF BSV IN EUR: ' + res.EUR);
            if (Number(((currentselltoken.totalSatoshisDonated / 100000000) * res.rate).toFixed(2)) >= currentselltoken.targetInEur) {
              //this.toastrService.success(this.translateService.instant('admin.donate-requests.selltoken-target-reached'));
              //this.SelltokenService.sendReachedEmail(currentselltoken.userEmail, window.location.href);
              this.SelltokenService
                .createOrUpdateselltoken(
                  {
                    currentDonation: currentselltoken.currentDonation,
                    totalSatoshisDonated: currentselltoken.totalSatoshisDonated,
                    isselltokenFullyDonated: true
                  }, true, currentselltoken.uid)
                .then(async () => {
                  await this.SelltokenService.changeselltokenProperty(1, currentselltoken.uid, 'totalContributions');
                  this.stateService.changeState('normal');
                });
            } else {
              this.SelltokenService
                .createOrUpdateselltoken(
                  {
                    currentDonation: currentselltoken.currentDonation,
                    totalSatoshisDonated: currentselltoken.totalSatoshisDonated
                  }, true, currentselltoken.uid)
                .then(async () => {
                  await this.SelltokenService.changeselltokenProperty(1, currentselltoken.uid, 'totalContributions');
                  this.stateService.changeState('normal');
                });
            }
          });

        this.SelltokenService
          .sendDonationDataToTxT(
            event.spendAmountSatoshis,
            currentselltoken.uid,
            currentselltoken.photo_url,
            currentselltoken.title,
            donation.from,
            event.txid,
            event.rawtx,
            donation.comment ? donation.comment : '',
            window.location.href,
            paymentOutputs[0] ? paymentOutputs[0].satoshis : '',
            paymentOutputs[1] ? paymentOutputs[1].satoshis : '',
            event.feeAmountSatoshis,
            paymentOutputs[2] ? paymentOutputs[2].satoshis : '',
          )
          .then((res) => {
            this.subs.push(this.donateService
              .getAllDonateRequests()
              .subscribe(result => {
                this.donations = result;

                this.stateService.changeState('normal');
              }));
          })
          .catch((err) => console.log(err));
      });
    this.donateService.updateDonateRequest({uid: donation.uid, status: 'approved'}).then(() => {
        console.log('Donate request updated');
      });

    this.subs.push(this.donateService
      .getAllDonateRequests()
      .subscribe(res => {
        this.donations = res;
        console.log(res);
        this.stateService.changeState('normal');
      }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  onPaymentError($event: any): void {
    console.log($event);
  }

  declineRequest(donateRequest: DonateRequest): void {
    // Update status of request
    this.ref = this.dialogService.open(EurWithdrawalDeclineDialogComponent, {
      header: 'Please type reason of reject',
      width: '30%',
      baseZIndex: 10000,
    });

    this.ref.onClose.pipe(
      switchMap((reason) => {
        if (reason) {
          this.donateService.declineRequest(donateRequest, reason);
        }
        return this.donateService.getAllDonateRequests();
      })
    ).subscribe(res => {
      this.donations = res;
      this.stateService.changeState('normal');
    });
    // this.donateService.updateDonateRequest({uid: donateRequest.uid, status: 'rejected'}).then(() => {
    //   console.log('Donate request updated');
    // });
    //
    // this.subs.push(this.donateService
    //   .getAllDonateRequests()
    //   .subscribe(res => {
    //     this.donations = res;
    //     console.log(res);
    //     this.stateService.changeState('normal');
    //   }));
    //
    // // Send new transaction to TXT
    // this.SelltokenService
    //   .sendDonationDataToTxT(
    //     donateRequest.totalAmount,
    //     donateRequest.selltokenId,
    //     '',
    //     '',
    //     donateRequest.from,
    //     donateRequest.uid,
    //     '',
    //     donateRequest.comment,
    //     donateRequest.link,
    //     donateRequest.payedToselltoken,
    //     donateRequest.payedToGoBitFundMe,
    //     donateRequest.stripeFee,
    //     donateRequest.payedToUserFromLink,
    //     true
    //   );
  }
}
