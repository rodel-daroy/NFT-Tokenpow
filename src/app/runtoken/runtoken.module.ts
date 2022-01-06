import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicRunTokenPageComponent } from './pages/public-runtoken-page/public-runtoken-page.component';
import { RunTokenRoutingModule } from './runtoken-routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ModifyRunTokenDataService } from './modules/create-runtoken/services/modify-runtoken-data.service';
import { MintRunTokenPageComponent } from './pages/mint-runtoken-page/mint-runtoken-page.component'
import {PublicOwnRunTokenPageComponent} from './pages/public-ownruntoken-page/public-ownruntoken-page.component'
import { RuntokenTransferDialogComponent } from './component/runtoken-transfer-dialog/runtoken-transfer-dialog.component';
import { RunTokenDetailDialogComponent } from './component/runtoken-detail-dialog/runtoken-detail-dialog.component';
import { RunTokenDataService } from './services/runtoken-data.service';
import { TokenDetailComponent } from './pages/token-detail/detail-token';

import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

const components = [
  PublicRunTokenPageComponent,
  PublicOwnRunTokenPageComponent,
  RunTokenDetailDialogComponent,
  TokenDetailComponent
];

const modules = [
  CommonModule,
  TableModule,
  ButtonModule,
  InputTextModule,
  TranslateModule,
  RunTokenRoutingModule,
  FormsModule,
  SharedModule
];

@NgModule({
  declarations: [...components, MintRunTokenPageComponent,  RuntokenTransferDialogComponent,
  ],
  imports: [...modules],
  exports: [
  ],
  providers: [RunTokenDataService]
})
export class RunTokenModule { }
