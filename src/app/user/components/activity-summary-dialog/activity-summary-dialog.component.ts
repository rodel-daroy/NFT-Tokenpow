import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {AppStateService} from '../../../shared/services/app-state.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-activity-summary-dialog',
  templateUrl: './activity-summary-dialog.component.html',
  styleUrls: ['./activity-summary-dialog.component.scss']
})
export class ActivitySummaryDialogComponent implements OnInit {

  userEmail: string;
  userId: string;
  data: any[] = [];
  cols: any[];
  exportColumns: any[];
  expanded: any;
  withdrawalText: string;
  selltokenClosingText: string;

  constructor(private userService: UserService,
              private config: DynamicDialogConfig,
              private stateService: AppStateService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    this.withdrawalText = this.translateService.instant('user.activity-summary-dialog.withdrawal');
    this.selltokenClosingText = this.translateService.instant('user.activity-summary-dialog.selltoken-closing');
    this.userService
      .getAllUserWithdrawalsAndIncomes(this.config?.data?.userId)
      .subscribe(res => {
        console.log(res);
        this.data = res;
        this.stateService.changeState('normal');
      });

    this.cols = [
      { field: 'date', header: this.translateService.instant('user.activity-summary-dialog.date') },
      { field: 'total', header: this.translateService.instant('user.activity-summary-dialog.total-amount') },
      { field: 'from', header: this.translateService.instant('user.activity-summary-dialog.from')},
      { field: 'to', header: this.translateService.instant('user.activity-summary-dialog.to')},
      { field: 'reason', header: this.translateService.instant('user.activity-summary-dialog.reason')},
      { field: 'transaction', header: this.translateService.instant('user.activity-summary-dialog.blockchain-transaction') },
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  exportExcel(): void {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
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

}
