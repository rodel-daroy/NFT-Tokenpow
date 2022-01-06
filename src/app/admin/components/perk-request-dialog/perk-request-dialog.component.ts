import { Component, OnInit } from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {PerkRequest} from '../../models/perk-request';

@Component({
  selector: 'app-perk-request-dialog',
  templateUrl: './perk-request-dialog.component.html',
  styleUrls: ['./perk-request-dialog.component.scss']
})
export class PerkRequestDialogComponent implements OnInit {

  request: PerkRequest;
  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef) { }

  ngOnInit(): void {
    this.request = this.config.data.request;
  }

  close(): void {
    this.ref.close();
  }

}
