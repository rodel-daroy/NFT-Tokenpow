import {Component, OnDestroy, OnInit} from '@angular/core';
import {EurWithdrawalsService} from '../../services/eur-withdrawals.service';
import {forkJoin, Subscription} from 'rxjs';
import {IbanWithdrawalRequest} from '../../../admin/models/iban-withdrawal-request';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-eur-withdrawals',
  templateUrl: './eur-withdrawals.component.html',
  styleUrls: ['./eur-withdrawals.component.scss']
})
export class EurWithdrawalsComponent implements OnInit, OnDestroy {
  pendingRequests: IbanWithdrawalRequest[];
  rejectedRequests: IbanWithdrawalRequest[];
  approvedRequests: IbanWithdrawalRequest[];
  subs$: Subscription[] = [];
  user: User;

  constructor(private eurWithdrawalsService: EurWithdrawalsService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.subs$.push(this.authService.user$.pipe(
      switchMap(user => {
        this.user = user;
        return forkJoin([
          this.eurWithdrawalsService.getAllApprovedWithdrawalRequests(user.email),
          this.eurWithdrawalsService.getAllRejectedWithdrawalRequests(user.email),
          this.eurWithdrawalsService.getAllNonApprovedWithdrawalRequests(user.email)
        ]);
      })
    ).subscribe((res) => {
      this.approvedRequests = res[0];
      this.approvedRequests.forEach((r: any) => {
        r.fee = (r.amountInSatoshis * 15) / 100;
        r.amountAfterFee = r.amountInSatoshis - r.fee;
        return r;
      });
      this.rejectedRequests = res[1];
      this.rejectedRequests.forEach((r: any) => {
        r.fee = (r.amountInSatoshis * 15) / 100;
        r.amountAfterFee = r.amountInSatoshis - r.fee;
        return r;
      });
      this.pendingRequests = res[2];
      this.pendingRequests.forEach((r: any) => {
        r.fee = (r.amountInSatoshis * 15) / 100;
        r.amountAfterFee = r.amountInSatoshis - r.fee;
        return r;
      });
    }));
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
