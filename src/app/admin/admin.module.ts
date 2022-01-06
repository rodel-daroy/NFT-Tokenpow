import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AuthService } from '../auth/services/auth.service';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';
import { SelltokensModule } from '../selltokens/selltokens.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { SelltokenApprovalsComponent } from './components/selltoken-approvals/selltoken-approvals.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DeclineDialogComponent } from './components/decline-dialog/decline-dialog.component';
import { ApprovalsService } from './services/approvals.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { DonateRequestsComponent } from './components/donate-requests/donate-requests.component';
import { DonateService } from './services/donate.service';
import { AdminSelltokensService } from './services/admin-selltokens.service';
import { SelltokenListComponent } from './components/selltoken-list/selltoken-list.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IbanWithdrawalRequestsComponent } from './components/iban-withdrawal-requests/iban-withdrawal-requests.component';
import { IbanWithdrawalRequestsService } from './services/iban-withdrawal-requests.service';
import { PerkRequestsComponent } from './components/perk-requests/perk-requests.component';
import { PerkRequestDialogComponent } from './components/perk-request-dialog/perk-request-dialog.component';
import { InputTextModule } from 'primeng/inputtext';
import { EurWithdrawalDeclineDialogComponent } from './components/eur-withdrawal-decline-dialog/eur-withdrawal-decline-dialog.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { ManageRefundsComponent } from './components/manage-refunds/manage-refunds.component';

@NgModule({
  declarations: [
    AdminPageComponent,
    SelltokenApprovalsComponent,
    DeclineDialogComponent,
    DonateRequestsComponent,
    SelltokenListComponent,
    IbanWithdrawalRequestsComponent,
    PerkRequestsComponent,
    PerkRequestDialogComponent,
    EurWithdrawalDeclineDialogComponent,
    UserListComponent,
    ManageRefundsComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TableModule,
    SelltokensModule,
    ProgressSpinnerModule,
    TabMenuModule,
    TabViewModule,
    DynamicDialogModule,
    InputTextareaModule,
    ConfirmDialogModule,
    TranslateModule,
    InfiniteScrollModule,
    InputTextModule,
  ],
  providers: [
    AuthService,
    DialogService,
    ApprovalsService,
    ConfirmationService,
    DonateService,
    AdminSelltokensService,
    IbanWithdrawalRequestsService,
  ],
})
export class AdminModule {}
