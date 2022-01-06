import { NgModule } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { PublicRunNftPageComponent } from './pages/public-runnft-page/public-runnft-page.component';
import { NftDetailComponent } from './pages/nft-detail/detail-nft';
import { RunNftRoutingModule } from './runassets-routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ModifyRunNftDataService } from './modules/create-runnft/services/modify-runnft-data.service';
import { RunNftServices } from './services/runnft.service';
import { RunNftDataService } from './services/runnft-data.service';

import { RunNftTransferDialogComponent } from './component/runnft-transfer-dialog/runnft-transfer-dialog.component'
import { RunNftDetailDialogComponent } from './component/runnft-detail-dialog/runnft-detail-dialog.component'

import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const components = [
  PublicRunNftPageComponent,
  RunNftTransferDialogComponent,
  RunNftDetailDialogComponent,
  NftDetailComponent
];

const modules = [
  CommonModule,
  TableModule,
  ButtonModule,
  InputTextModule,
  TranslateModule,
  RunNftRoutingModule,
  FormsModule,
  SharedModule,
  NgbModule
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [
  ],
  providers: [ModifyRunNftDataService,RunNftDataService,RunNftServices]
})
export class RunNftMoudle { }
