import {Component, OnDestroy, OnInit} from '@angular/core';
import {PerkService} from '../../../selltokens/services/perk.service';
import {PerkRequest} from '../../models/perk-request';
import {Subscription} from 'rxjs';
import {DialogService} from 'primeng/dynamicdialog';
import {PerkRequestDialogComponent} from '../perk-request-dialog/perk-request-dialog.component';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-perk-requests',
  templateUrl: './perk-requests.component.html',
  styleUrls: ['./perk-requests.component.scss']
})
export class PerkRequestsComponent implements OnInit, OnDestroy {

  requests: PerkRequest[] = [];
  subs$: Subscription[] = [];

  constructor(private perkService: PerkService,
              private dialogService: DialogService) { }

  ngOnInit(): void {
    this.subs$.push(this.perkService.getAllPerksRequests().subscribe(res => this.requests = res));
  }

  openRequest(request: PerkRequest): void {
    this.dialogService.open(PerkRequestDialogComponent, {
      header: request.id,
        width: 'auto',
      styleClass: '',
      data: {
      request
    }
    });
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
