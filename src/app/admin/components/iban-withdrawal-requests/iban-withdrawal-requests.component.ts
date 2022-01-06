import {Component, OnDestroy, OnInit} from '@angular/core';
import {IbanWithdrawalRequest} from '../../models/iban-withdrawal-request';
import {IbanWithdrawalRequestsService} from '../../services/iban-withdrawal-requests.service';
import {forkJoin, of, Subscription} from 'rxjs';
import {AppStateService} from '../../../shared/services/app-state.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {EurWithdrawalDeclineDialogComponent} from '../eur-withdrawal-decline-dialog/eur-withdrawal-decline-dialog.component';
import {switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-iban-withdrawal-requests',
  templateUrl: './iban-withdrawal-requests.component.html',
  styleUrls: ['./iban-withdrawal-requests.component.scss']
})
export class IbanWithdrawalRequestsComponent implements OnInit, OnDestroy {
  pendingRequests: IbanWithdrawalRequest[];
  rejectedRequests: IbanWithdrawalRequest[];
  approvedRequests: IbanWithdrawalRequest[];
  completedRequests: IbanWithdrawalRequest[];
  subs$: Subscription[] = [];
  ref: DynamicDialogRef;

  constructor(private ibanService: IbanWithdrawalRequestsService,
              private dialogService: DialogService,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.subs$.push(
      forkJoin([
        this.ibanService.getAllNonApprovedWithdrawalRequests(),
        this.ibanService.getAllApprovedWithdrawalRequests(),
        this.ibanService.getAllCompletedWithdrawalRequests(),
        this.ibanService.getAllRejectedWithdrawalRequests()
      ]).subscribe(requests => {
        this.stateService.changeState('normal');
        this.pendingRequests = requests[0];
        this.pendingRequests.forEach((r: any) => {
          r.fee = (r.amountInSatoshis * 15) / 100;
          r.amountAfterFee = r.amountInSatoshis - r.fee;
          return r;
        });
        this.approvedRequests = requests[1];
        this.approvedRequests.forEach((r: any) => {
          r.fee = (r.amountInSatoshis * 15) / 100;
          r.amountAfterFee = r.amountInSatoshis - r.fee;
          return r;
        });
        this.completedRequests = requests[2];
        this.completedRequests.forEach((r: any) => {
          r.fee = (r.amountInSatoshis * 15) / 100;
          r.amountAfterFee = r.amountInSatoshis - r.fee;
          return r;
        });
        this.rejectedRequests = requests[3];
        this.rejectedRequests.forEach((r: any) => {
          r.fee = (r.amountInSatoshis * 15) / 100;
          r.amountAfterFee = r.amountInSatoshis - r.fee;
          return r;
        });
      })
    );
  }

  approveRequest(request): void {
    this.ibanService.approveRequest(request)
      .then(() => {
        this.subs$.push(
          forkJoin([
            this.ibanService.getAllNonApprovedWithdrawalRequests(),
            this.ibanService.getAllApprovedWithdrawalRequests()
          ]).subscribe(res => {
            this.stateService.changeState('normal');
            this.pendingRequests = res[0];
            this.approvedRequests = res[1];
            this.toastrService.success(this.translateService.instant('admin.iban-withdrawal-requests.request-approved'));
          })
        );
      });
  }

  completeRequest(request): void {
    this.ibanService.completeRequest(request)
      .then(() => {
        this.subs$.push(
          forkJoin([
            this.ibanService.getAllApprovedWithdrawalRequests(),
            this.ibanService.getAllCompletedWithdrawalRequests()
          ]).subscribe(res => {
            this.approvedRequests = res[0];
            this.completedRequests = res[1];
            this.stateService.changeState('normal');
            this.toastrService.success(this.translateService.instant('admin.iban-withdrawal-requests.request-completed'));
          })
        );
      });
  }

  declineRequest(request): void {
    this.ref = this.dialogService.open(EurWithdrawalDeclineDialogComponent, {
      header: 'Please type reason of reject',
      width: '30%',
      baseZIndex: 10000,
    });

    this.ref.onClose.pipe(
      switchMap((reason) => {
        if (reason) {
          this.ibanService.declineRequest(request, reason);
        }
        return forkJoin([
          this.ibanService.getAllNonApprovedWithdrawalRequests(),
          this.ibanService.getAllRejectedWithdrawalRequests()
        ]);
      })
    ).subscribe(res => {
      if (res) {
        this.pendingRequests = res[0];
        this.rejectedRequests = res[1];
        this.stateService.changeState('normal');
        this.toastrService.success(this.translateService.instant('admin.iban-withdrawal-requests.request-rejected'));
      } else {
        this.stateService.changeState('normal');
      }
    });
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
