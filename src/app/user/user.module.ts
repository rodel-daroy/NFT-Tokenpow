import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import {SharedModule} from '../shared/shared.module';
import { ProfileSectionHeaderComponent } from './components/profile-section-header/profile-section-header.component';
import {MoneyButtonService} from './services/money-button.service';
import { UserSelltokenGridComponent } from './components/user-selltoken-grid/user-selltoken-grid.component';
import {InputTextModule} from 'primeng/inputtext';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CalendarModule} from 'primeng/calendar';
import {MultiSelectModule} from 'primeng/multiselect';
import {TableModule} from 'primeng/table';
import {RippleModule} from 'primeng/ripple';
import {DropdownModule} from 'primeng/dropdown';
import {TabViewModule} from 'primeng/tabview';
import { ActivitySummaryDialogComponent } from './components/activity-summary-dialog/activity-summary-dialog.component';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {PaginatorModule} from 'primeng/paginator';
import { UserWithdrawDialogComponent } from './components/user-withdraw-dialog/user-withdraw-dialog.component';
import {TranslateModule} from '@ngx-translate/core';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import {CardModule} from 'primeng/card';
import {CommonInputValidatorModule} from '../shared/modules/common-input-validator/common-input-validator.module';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {LottieModule} from 'ngx-lottie';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {EurWithdrawalsService} from './services/eur-withdrawals.service';
import { EurWithdrawalsComponent } from './pages/eur-withdrawals/eur-withdrawals.component';
import {InputNumberModule} from 'primeng/inputnumber';
import { UserSelltokenGridAuctionComponent } from './components/user-selltoken-grid-auction/user-selltoken-grid-auction.component';
import { UserSelltokenGridBuyComponent } from './components/user-selltoken-grid-buy/user-selltoken-grid-buy.component';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditorModule as KendoUIEditor } from '@progress/kendo-angular-editor';
import { EditorModule } from 'primeng/editor';
import { DialogModule } from 'primeng/dialog';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [ProfileComponent, ProfileSectionHeaderComponent,UserSelltokenGridAuctionComponent, UserSelltokenGridBuyComponent, UserSelltokenGridComponent, ActivitySummaryDialogComponent, UserWithdrawDialogComponent, UserProfileComponent, EurWithdrawalsComponent],
    imports: [
        CommonModule,
        SharedModule,
        InputTextModule,
        InputNumberModule,
        InputTextareaModule,
        CalendarModule,
        MultiSelectModule,
        TableModule,
        RippleModule,
        DropdownModule,
        TabViewModule,
        DynamicDialogModule,
        PaginatorModule,
        TranslateModule,
        ProgressSpinnerModule,
        CardModule,
        CommonInputValidatorModule,
        LottieModule,
        ConfirmDialogModule,
        MessagesModule,
        MessageModule,
        UserRoutingModule,
        AngularEditorModule,
        KendoUIEditor,
        DialogModule,
        EditorModule,
        ClipboardModule

    ],
  providers: [MoneyButtonService, DialogService, EurWithdrawalsService]
})
export class UserModule { }
