import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelltokensRoutingModule } from './selltokens-routing.module';
import { PublicSelltokensPageComponent } from './pages/public-selltokens-page/public-selltokens-page.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
//import { FilterComponent } from './components/filter/filter.component';
//import { SelltokenGridComponent } from './components/selltoken-grid/selltoken-grid.component';
import { SelltokenTableComponent } from './components/selltoken-table/selltoken-table.component';
import { DetailComponent } from './pages/detail/detail.component';
import { SingleDetailContentInfoComponent } from './components/single-detail-content-info/single-detail-content-info.component';
import { UrlFormatterPipe } from './pipes/url-formatter.pipe';
import { PaginationService } from '../shared/services/pagination.service';
import { FilterService } from './services/filter.service';
import { CategoriesService } from '../shared/services/categories.service';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { CreateSelltokenStepsPageComponent, } from './modules/create-selltoken/pages/create-selltoken-steps-page/create-selltoken-steps-page.component';
import { StepsModule } from 'primeng/steps';
import { LocationFormatterPipe } from './pipes/location-formatter.pipe';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { DonateDialogComponent } from './components/donate-dialog/donate-dialog.component';
import { BidDialogComponent } from './components/bid-dialog/bid-dialog.component';
import { WithDrawDialogComponent } from './components/withdraw-dialog/withdraw-dialog.component';
import { BuyNowDialogComponent } from './components/buyNow-dialog/buyNow-dialog.component';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { DonationsTableComponent } from './components/donations-table/donations-table.component';
import { DonationsService } from './services/donations.service';
import { TableModule } from 'primeng/table';
import { YouTubePlayerModule } from '@angular/youtube-player';
import {PaginatorModule} from 'primeng/paginator';
import {TranslateModule} from '@ngx-translate/core';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {BsvPriceService} from './modules/create-selltoken/services/bsv-price.service';
import {ClipboardModule} from 'ngx-clipboard';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import { DonatePageComponent } from './pages/donate-page/donate-page.component';
import {PaymentService} from './services/payment.service';
import {RadioButtonModule} from 'primeng/radiobutton';
import {LottieModule} from 'ngx-lottie';
import {DonateService} from './services/donate.service';
import { RecaptchaModule } from 'ng-recaptcha';
import { SelltokenCloseDialogComponent } from './components/selltoken-close-dialog/selltoken-close-dialog.component';
import { SelltokenTransferDialogComponent } from './components/selltoken-transfer-dialog/selltoken-transfer-dialog.component';
import { SelltokenForceTransferDialogComponent  } from './components/selltoken-forcetransfer-dialog/selltoken-forcetransfer-dialog.component';
import { PayprestoComponent } from './components/paypresto/paypresto.component';
import { FixedNumberPipe } from './pipes/fixed-number.pipe';
import { PerkDialogComponent } from './components/perk-dialog/perk-dialog.component';
import { AuctionTableComponent } from './components/auction-table/auction-table.component';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import { TimelineModule } from "primeng/timeline";
import { WithdrawSelltokensCoinsService } from './services/withdraw-selltokens-coins.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { OfferDialogComponent } from './components/offer-dialog/offer-dialog.component';
import { CommentDialogComponent } from './components/comment-dialog/comment-dialog.component';


const components = [
  PublicSelltokensPageComponent,
  //FilterComponent,
  //SelltokenGridComponent,
  AuctionTableComponent,
  SelltokenTableComponent,
  DetailComponent,
  SingleDetailContentInfoComponent,
  UrlFormatterPipe,
  CreateSelltokenStepsPageComponent,
  LocationFormatterPipe,
  DonateDialogComponent,
  BidDialogComponent,
  OfferDialogComponent,
  CommentDialogComponent,
  WithDrawDialogComponent,
  BuyNowDialogComponent,
  DonationsTableComponent,
];

const modules = [
  CommonModule,
  SharedModule,
  HttpClientModule,
  AngularEditorModule,
  SelltokensRoutingModule,
  RouterModule,
  ClipboardModule,
  CheckboxModule,
  CardModule,
  StepsModule,
  ScrollPanelModule,
  DynamicDialogModule,
  TabViewModule,
  InputTextModule,
  TableModule,
  YouTubePlayerModule,
  PaginatorModule,
  TranslateModule,
  ConfirmDialogModule,
  RadioButtonModule,
  ClipboardModule,
  InputTextareaModule,
  InputNumberModule,
  LottieModule,
  RecaptchaModule,
  //SidebarModule,
  CalendarModule,
  SliderModule,
  DialogModule,
  MultiSelectModule,
  ContextMenuModule,
  DropdownModule,
  ButtonModule,
  InputTextModule,
  TimelineModule,
  NgbModule,
  NgxQRCodeModule
];

@NgModule({
  declarations: [...components, DonatePageComponent, SelltokenForceTransferDialogComponent, SelltokenCloseDialogComponent,SelltokenTransferDialogComponent, PayprestoComponent, FixedNumberPipe, PerkDialogComponent],
  imports: [...modules],
  exports: [
    SingleDetailContentInfoComponent,
    LocationFormatterPipe
  ],
  providers: [PaginationService, FilterService, CategoriesService, DialogService, DonationsService, BsvPriceService, WithdrawSelltokensCoinsService, PaymentService, DonateService]
})
export class SelltokensModule { }
