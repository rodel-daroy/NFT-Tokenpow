import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AppStateService} from '../../../shared/services/app-state.service';
import {ToastrService} from 'ngx-toastr';
import {ApprovalsService} from '../../services/approvals.service';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-decline-dialog',
  templateUrl: './decline-dialog.component.html',
  styleUrls: ['./decline-dialog.component.scss']
})
export class DeclineDialogComponent implements OnInit {

  reasonOfDecline: string;
  userId: string;
  amountOfCoins: number;
  withdrawRequestId: string;
  userEmail: string;
  selltoken: ISelltoken;
  deleting: boolean;

  constructor(public ref: DynamicDialogRef,
              private config: DynamicDialogConfig,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private approvalsService: ApprovalsService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.userId = this.config.data.userId;
    this.amountOfCoins = this.config.data.amountOfCoins;
    this.withdrawRequestId = this.config.data.withdrawRequestId;
    this.userEmail = this.config.data.userEmail;
    this.selltoken = this.config.data.selltoken;
    this.deleting = this.config.data.deleting;
  }

  rejectRequest(): void {
    this.stateService.changeState('loading');
    this.approvalsService.sendRejectEmail(this.userEmail, this.reasonOfDecline)
      .then(res => {
        this.toastrService.success(this.translateService.instant('admin.decline-dialog.reject-email-sent'));
        console.log(res);
      })
      .catch(err => {
        this.toastrService.error(err);
        console.log(err);
      });
    if (this.deleting) {
      this.selltoken.status = SelltokenStatus.NOT_APPROVED;
      this.approvalsService.updateselltoken(this.selltoken).then(response => {
        console.log(response);
        this.stateService.changeState('normal');
        this.ref.close();
      });
    }
  }
}
