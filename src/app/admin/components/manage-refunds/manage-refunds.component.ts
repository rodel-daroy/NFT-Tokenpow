import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApprovalsService } from '../../services/approvals.service';
import { AppStateService } from '../../../shared/services/app-state.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AdminSelltokensService } from '../../services/admin-selltokens.service';
import { UserService } from 'src/app/user/services/user.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-manage-refunds',
  templateUrl: './manage-refunds.component.html',
  styleUrls: ['./manage-refunds.component.scss'],
})
export class ManageRefundsComponent implements OnInit, OnDestroy {
  refunds: any[];
  ref: DynamicDialogRef;

  constructor(
    private approvalsService: ApprovalsService,
    private adminSellTokenService: AdminSelltokensService,
    private stateService: AppStateService,
    private toastrService: ToastrService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('redund');
    this.adminSellTokenService.getAllrefunds().subscribe((res) => {
      this.refunds = res;
      console.log('getAllrefunds: ', this.refunds);
      this.stateService.changeState('normal');
    });
  }

  refundBtn(refund) {
    this.userService
      .withdrawEscrowCoins(
        refund.privateAddress,
        refund.bsvAddress,
        refund.amountToWithdraw
      )
      .pipe()
      .subscribe(
        (res) => {
          console.log('ok withdraw it!');
          this.adminSellTokenService.removeRefund(refund.uid).then(() => {
              this.ngOnInit()
          });
        },
        (err) => {}
      );
  }

  ngOnDestroy(): void {}
}
