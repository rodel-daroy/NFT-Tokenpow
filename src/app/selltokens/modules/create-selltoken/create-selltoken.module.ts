import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateSelltokenRoutingModule } from './create-selltoken-routing.module';
import { StepsModule } from 'primeng/steps';
import { SharedModule } from '../../../shared/shared.module';
import { CreatePreviewSelltokenComponent } from './pages/create-preview-selltoken/create-preview-selltoken.component';
import { CreateSelltokenDataService } from './services/create-selltoken-data.service';
import { SelltokensModule } from '../../selltokens.module';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { CreateSelltokenPageComponent } from './pages/create-selltoken-page/create-selltoken-page.component';
import { TableModule } from 'primeng/table';
import {TabViewModule} from 'primeng/tabview';

import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { ThankYouPageComponent } from './pages/thank-you-page/thank-you-page.component';
import { LottieModule } from 'ngx-lottie';
import { EditorModule } from 'primeng/editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailService } from './services/email.service';
import { EditorModule as KendoUIEditor } from '@progress/kendo-angular-editor';
import { CreateApproveSelltokenComponent } from './pages/create-approve-selltoken/create-approve-selltoken.component';
import { CreateAuctionSelltokenComponent } from './pages/create-auction-selltoken/create-auction-selltoken.component';
import { TimelineModule } from "primeng/timeline";


@NgModule({
  declarations: [
    CreatePreviewSelltokenComponent,
    CreateSelltokenPageComponent,
    ThankYouPageComponent,
    CreateApproveSelltokenComponent,
    CreateAuctionSelltokenComponent
  ],
  imports: [
    CommonModule,
    CreateSelltokenRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    StepsModule,
    SharedModule,
    SelltokensModule,
    CheckboxModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule,
    TabViewModule,
    DropdownModule,
    DialogModule,
    TranslateModule,
    EditorModule,
    KendoUIEditor,
    LottieModule,
    NgSelectModule,
    TableModule,
    TimelineModule,
  ],
  providers: [CreateSelltokenDataService, EmailService]
})
export class CreateSelltokenModule { }
