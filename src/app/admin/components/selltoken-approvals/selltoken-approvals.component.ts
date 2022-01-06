import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApprovalsService} from '../../services/approvals.service';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {Subscription} from 'rxjs';
import {AppStateService} from '../../../shared/services/app-state.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DeclineDialogComponent} from '../decline-dialog/decline-dialog.component';
import {ToastrService} from 'ngx-toastr';
import {ConfirmationService} from 'primeng/api';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {environment} from '../../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-selltoken-approvals',
  templateUrl: './selltoken-approvals.component.html',
  styleUrls: ['./selltoken-approvals.component.scss']
})
export class SelltokenApprovalsComponent implements OnInit, OnDestroy {

  selltokens: ISelltoken[];
  subs: Subscription[] = [];
  ref: DynamicDialogRef;

  constructor(private approvalsService: ApprovalsService,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private dialogService: DialogService,
              private confirmationService: ConfirmationService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.subs.push(this.approvalsService.getAllNonApprovedselltokens().subscribe(res => {
      this.selltokens = res;
      console.log("selltokens: ", this.selltokens)
      this.stateService.changeState('normal');
    }));
  }

  showDialog(userEmail: string, selltoken: ISelltoken): void {
    this.ref = this.dialogService.open(DeclineDialogComponent, {
      header: 'Please type reason of decline.',
      width: '30%',
      baseZIndex: 10000,
      data: {
        userEmail,
        selltoken,
        deleting: true
      }
    });

    this.ref.onClose.subscribe(() => {
      this.subs.push(this.approvalsService.getAllNonApprovedselltokens().subscribe(res => {
        this.selltokens = res;
        this.stateService.changeState('normal');
      }));
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  approveselltoken(selltoken: ISelltoken): void {
    selltoken.status = SelltokenStatus.APPROVED;
    selltoken.isShowBoard = true;
    this.confirmationService.confirm({
      message: this.translateService.instant('admin.selltoken-approvals.do-you-want-to-approve-this-selltoken'),
      accept: () => {
        // TODO: add username
        this.approvalsService.sendApproveEmail(
          selltoken.userEmail,
          selltoken.userName,
          `${environment.baseUrl}/tokens/token/${selltoken.uid}`,
          selltoken.title
        ).then(() => {});
        this.approvalsService.updateselltoken(selltoken).then(() => {
          this.toastrService.success(this.translateService.instant('admin.selltoken-approvals.selltoken-approved'), 'Success');
          this.subs.push(this.approvalsService.getAllNonApprovedselltokens().subscribe(res => {
            this.selltokens = res;
            this.stateService.changeState('normal');
          }));
        });
      }
    });
  }
}
