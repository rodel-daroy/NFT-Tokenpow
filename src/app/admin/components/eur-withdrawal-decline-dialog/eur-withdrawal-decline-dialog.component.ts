import { Component, OnInit } from '@angular/core';
import {DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-eur-withdrawal-decline-dialog',
  templateUrl: './eur-withdrawal-decline-dialog.component.html',
  styleUrls: ['./eur-withdrawal-decline-dialog.component.scss']
})
export class EurWithdrawalDeclineDialogComponent implements OnInit {

  reasonOfDecline: string;

  constructor(public ref: DynamicDialogRef) { }

  ngOnInit(): void {
  }

  rejectRequest(): void {
    this.ref.close(this.reasonOfDecline);
  }

}
