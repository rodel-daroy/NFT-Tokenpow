import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { SectionTitleComponent } from './components/section-title/section-title.component';
import { FeatureCardComponent } from './components/feature-card/feature-card.component';
import { SelltokenCardComponent } from './components/selltoken-card/selltoken-card.component';
import { FilterComponent } from '../selltokens/components/filter/filter.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TransformCategoriesPipe } from './pipes/transform-categories.pipe';
import { ShellComponent } from './components/shell/shell.component';
import { RouterModule } from '@angular/router';
import { NavbarToggleDirective } from './directives/navbar-toggle.directive';
import { HttpClientModule} from '@angular/common/http';
import { RedirectComponent } from './components/redirect/redirect.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MoneyButtonComponent } from './components/money-button/money-button.component';
import { FormatCoinsPipe } from './pipes/format-coins.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DateFormatterPipe } from './pipes/date-formatter.pipe';
import { DescriptionFormatterPipe } from '../selltokens/pipes/description-formatter.pipe';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { ReplacePipe } from './pipes/replace.pipe';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {RadioButtonModule} from 'primeng/radiobutton';
import { DialogService } from 'primeng/dynamicdialog';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TranslateModule } from '@ngx-translate/core';
import { MenubarModule } from 'primeng/menubar';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { MoneyButtonLoaderComponent } from './components/money-button-loader/money-button-loader.component';
import {SafeHtmlPipe} from './pipes/safe-html.pipe';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {LottieModule} from 'ngx-lottie';
import {LineTruncationLibModule} from 'ngx-line-truncation';
import { PaginationService } from '../shared/services/pagination.service';
import { SelltokenGridComponent } from '../selltokens/components/selltoken-grid/selltoken-grid.component';
import { SidebarModule } from 'primeng/sidebar';
import { CheckboxModule } from 'primeng/checkbox';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CountdownModule } from 'ngx-countdown';
import { CollectionPageComponent } from './pages/collection-page/collection-page.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CollectionsComponent } from './pages/collections/collections.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';

const components = [
  ButtonComponent,
  FilterComponent,
  SelltokenGridComponent,
  SectionTitleComponent,
  FooterComponent,
  ShellComponent,
  NavbarToggleDirective,
  RedirectComponent,
  DropzoneDirective,
  FileUploadComponent,
  UploadTaskComponent,
  MoneyButtonComponent,
  SelltokenCardComponent,
  FeatureCardComponent,
  TransformCategoriesPipe,
  DateFormatterPipe,
  FormatCoinsPipe,
  TransformCategoriesPipe,
  DescriptionFormatterPipe,
  BigNumberPipe,
  ReplacePipe,
  LandingPageComponent,
  CollectionPageComponent,
  MoneyButtonLoaderComponent,
  SafeHtmlPipe,
  CollectionsComponent
];

const modules = [
  CommonModule,
  FlexLayoutModule,
  FontAwesomeModule,
  RouterModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  NgxSpinnerModule,
  ProgressSpinnerModule,
  ProgressBarModule,
  TooltipModule,
  DialogModule,
  ButtonModule,
  SidebarModule,
  ScrollPanelModule,
  MenubarModule,
  TranslateModule,
  ConfirmDialogModule,
  ToggleButtonModule,
  RadioButtonModule,
  CheckboxModule,
  InfiniteScrollModule,
  CountdownModule,
  NgxQRCodeModule,
  SlickCarouselModule
];

@NgModule({
  declarations: [...components],
  imports: [...modules, LottieModule, LineTruncationLibModule],
  exports: [...components, ...modules],
  providers: [ConfirmationService,PaginationService,DialogService]
})
export class SharedModule {}
