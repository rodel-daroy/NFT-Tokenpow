import {Component, OnDestroy, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../../shared/services/app-state.service';
import {switchMap} from 'rxjs/operators';
import {CryptoService} from '../../../shared/services/crypto.service';
import {BsvPriceService} from '../../../selltokens/modules/create-selltoken/services/bsv-price.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-user-withdraw-dialog',
  templateUrl: './user-withdraw-dialog.component.html',
  styleUrls: ['./user-withdraw-dialog.component.scss'],
  providers: [BsvPriceService]
})
export class UserWithdrawDialogComponent implements OnInit, OnDestroy {
  address = '';
  amountInSatoshisToWithdraw: number;
  userEmail: string;
  userId: string;
  userAddress: string;
  currentBsvPrice: number;
  subs$: Subscription[] = [];
  user: User;
  priceUserWillReceive: number;
  withdrawIsMade = false;

  constructor(private config: DynamicDialogConfig,
              private userService: UserService,
              public authService: AuthService,
              private dialog: DynamicDialogRef,
              private stateService: AppStateService,
              private cryptoService: CryptoService,
              private bsvService: BsvPriceService,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.subs$.push(this.authService.user$.subscribe(res => {
      console.log(res);
      this.user = res;
    }));
    this.subs$.push(this.bsvService.getCurrentBsvPriceInUsd().subscribe((res: any) => {
      this.amountInSatoshisToWithdraw = this.config.data.amountInSatoshisToWithdraw;
      this.userEmail = this.config.data.userEmail;
      this.userId = this.config.data.userId;
      this.userAddress = this.config.data.userAddress;
      this.currentBsvPrice = res.rate;
      this.priceUserWillReceive = this.countReceivePrice(res.rate, this.amountInSatoshisToWithdraw);
      console.log(this.countReceivePrice(res.rate, this.amountInSatoshisToWithdraw));
    }));
  }

  countReceivePrice(currentPrice: number, amountInSatoshis: number): number {
    return (amountInSatoshis / 100000000) * (currentPrice);
  }

  makeUserIbanWithdraw(): void {
    this.userService.withdrawUserCoinsToIban(this.user, this.amountInSatoshisToWithdraw, this.priceUserWillReceive)
      .then(() => {
        this.withdrawIsMade = true;
        this.stateService.changeState('normal');
      })
      .catch((err) => {
        this.stateService.changeState('normal');
        this.toastrService.error(err, 'Error');
      });
  }

  makeUserWithdraw(): void {
    if (this.userId && this.address && this.amountInSatoshisToWithdraw) {
      this.subs$.push(this.userService.withdrawUserCoins(
        this.userId,
        this.address,
        this.amountInSatoshisToWithdraw
      ).pipe(
        switchMap((res: { tx: string, fee: any }) => {
          return this.userService
            .sendWithdrawTransactionToTxt(
              this.amountInSatoshisToWithdraw,
              this.userEmail,
              res.tx,
              this.userId,
              true,
              '',
              this.userAddress,
              this.address,
              res.fee.toString(),
              false
            );
        })
      ).subscribe(res => {
        console.log(res);
        this.stateService.changeState('normal');
        this.toastrService.success(this.translateService.instant('user.profile-section-header.coins-has-been-successfully-withdrawn'));
        this.dialog.close('closedByAfterWithdraw');
      }, (err) => this.toastrService.error(this.translateService.instant('user.profile-section-header.coins-has-not-been-withdrawn'))));
    } else {
      this.toastrService.error(this.translateService.instant('user.profile-section-header.coins-has-not-been-withdrawn'));
    }
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }
}
