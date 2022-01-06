import {Component, OnDestroy, OnInit} from '@angular/core';
import {DonationsService} from '../../services/donations.service';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {Donation} from '../../models/donation.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {DonateRequest} from '../../models/donate-request.model';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';

@Component({
  selector: 'app-donations-table',
  templateUrl: './donations-table.component.html',
  styleUrls: ['./donations-table.component.scss']
})
export class DonationsTableComponent implements OnInit, OnDestroy {

  selltokenId: string;
  selltokenOwner: string;
  user: User;
  approvedDonations: Donation[] = [];
  pendingDonations: DonateRequest[] = [];
  rejectedDonations: DonateRequest[] = [];
  subs$: Subscription[] = [];

  constructor(private donationService: DonationsService,
              private config: DynamicDialogConfig,
              private stateService: AppStateService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.selltokenOwner = this.config?.data?.selltokenOwner;
    if (this.config?.data) {
      this.subs$.push(this.donationService
        .getAllDonationsForselltoken(this.config?.data?.selltokenId)
        .subscribe((res) => {
          this.approvedDonations = res;
          this.stateService.changeState('normal');
        }));

      this.subs$.push(this.donationService
        .getPendingDonationsForselltoken(this.config?.data?.selltokenId)
        .subscribe((res) => {
          this.pendingDonations = res;
        }));

      this.subs$.push(this.donationService
        .getRejectedDonationsForselltoken(this.config?.data?.selltokenId)
        .subscribe((res) => {
          this.rejectedDonations = res;
        }));
    }
    this.subs$.push(this.authService.user$.subscribe((user) => this.user = user));
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.approvedDonations);
      const workbook = {Sheets: {data: worksheet}, SheetNames: ['data']};
      const excelBuffer: any = xlsx.write(workbook, {bookType: 'xlsx', type: 'array'});
      this.saveAsExcelFile(excelBuffer, 'data');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    });
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
