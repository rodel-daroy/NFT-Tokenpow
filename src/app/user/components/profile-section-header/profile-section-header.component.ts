import {Component, OnDestroy, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {User} from '../../../auth/models/user.model';
import {AuthService} from '../../../auth/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {UserService} from '../../services/user.service';
import {Subscription} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {ActivitySummaryDialogComponent} from '../activity-summary-dialog/activity-summary-dialog.component';
import {ConfirmationService} from 'primeng/api';
import {UserWithdrawDialogComponent} from '../user-withdraw-dialog/user-withdraw-dialog.component';
import {delay, switchMap, tap} from 'rxjs/operators';
import {AppStateService} from '../../../shared/services/app-state.service';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import {CryptoService} from '../../../shared/services/crypto.service';
import {AnimationOptions} from 'ngx-lottie';
import {TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-profile-section-header',
  templateUrl: './profile-section-header.component.html',
  styleUrls: ['./profile-section-header.component.scss'],
  providers: [ConfirmationService]
})
export class ProfileSectionHeaderComponent implements OnInit, OnDestroy {
  options: AnimationOptions = {
    path: '/assets/animations/coins.json',
    loop: true,
  };
  user: User;
  subs: Subscription[] = [];
  userCoins: number;
  userWithdraw: number = 1000;
  loading = true;
  faExternalLinkAlt = faExternalLinkAlt;
  currentPriceInEur;

  constructor(private cookieService: CookieService,
              private auth: AuthService,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private dialogService: DialogService,
              private confirmationDialogService: ConfirmationService,
              private cryptoService: CryptoService,
              private httpClient: HttpClient,
              private userService: UserService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.getCurrentPrice()
      .then((res: any) => {
        this.currentPriceInEur = res.rate;
      });
    this.subs.push(
      this.auth.user$.pipe(
        switchMap(res => {
          this.user = res;
          return this.userService.getUserWalletStatus(res.bsvAddress?.address);
        })
      ).subscribe(res => {
        console.log(res);
        this.userCoins = (res.confirmed + res.unconfirmed);
        this.loading = false;
        // this.stateService.changeState('normal');
    }));
  }

  makeUserWithdraw(): void {
    if (this.user) {
      this.userService.withdrawUserCoins(
        this.user.uid,
        this.user.withdrawalBsvAddress,
        this.userWithdraw
      ).pipe(
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
      ).subscribe(res => {
        console.log(res);
        this.stateService.changeState('normal');
        this.toastrService.success(this.translateService.instant('user.profile-section-header.coins-has-been-successfully-withdrawn'));
        this.userCoins -= this.userWithdraw;
        this.userWithdraw = 0;
      }, (err) => this.toastrService.error(this.translateService.instant('user.profile-section-header.coins-has-not-been-withdrawn')));
    } else {
      this.toastrService.error(this.translateService.instant('user.profile-section-header.coins-has-not-been-withdrawn'));
    }
  }

  onSubmitClick(): void {
    if (this.userWithdraw >= 1000 && (this.userWithdraw <= this.userCoins)) {
      if (this.user.withdrawalBsvAddress) {
        this.confirmationDialogService.confirm({
          message: `Do you want withdraw your coins to this Bitcoin (Satoshi Vision) address ${this.user.withdrawalBsvAddress}?`,
          accept: () => {
            this.makeUserWithdraw();
          }
        });
      } else {
        const ref = this.dialogService.open(UserWithdrawDialogComponent, {
          header: this.translateService.instant('profile-section-header.withdraw-your-coins-to-a-bsv-address'),
          width: '40%',
          height: '50%',
          baseZIndex: 100000,
          style: {
            background: '#2a323d'
          },
          data: {
            amountInSatoshisToWithdraw: this.userWithdraw,
            userEmail: this.user.email,
            userId: this.user.uid,
            userAddress: this.user.bsvAddress.address
          }
        }).onClose.pipe(
          tap(() => this.loading = true),
          delay(5000),
          switchMap(() => {
              return this.userService.getUserWalletStatus(this.user.bsvAddress.address);
          })
        ).subscribe((res) => {
            console.log(res);
            this.userCoins = (res.confirmed + res.unconfirmed);
            this.loading = false;
            this.userWithdraw = 0;
        });
      }
    } else if (this.userWithdraw > this.userCoins) {
      this.toastrService
          .error(this.translateService
          .instant('profile-section-header.you-cannot-withdraw-more-coins-than-you-have'), 'Error');
    } else if (this.userWithdraw < 1000) {
      this.toastrService
          .error(this.translateService
          .instant('profile-section-header.minimum-amount-to-withdraw-is-1000-coins'), 'Error');
    }
  }

  openActivitySummaryDialog(): void {
    const ref = this.dialogService.open(ActivitySummaryDialogComponent, {
      header: this.translateService.instant('profile-section-header.my-activity'),
      width: '70%',
      height: '100%',
      baseZIndex: 100000,
      style: {
        background: 'white'
      },
      data: {
        userEmail: this.user.email,
        userId: this.user.uid
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  showUserAddress(): void {
    window.open(`https://whatsonchain.com/address/${this.user?.bsvAddress?.address.toString()}`, '_blank');
  }

  onEarnedCoinsClick(): void {
    this.userWithdraw = this.userCoins;
  }

  getCurrentPrice(): Promise<any> {
      // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=BSV&tsyms=USD', {
      return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
        // , {
        //   headers: {
        //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
        //   }
        // }
      ).toPromise();
    }
}
