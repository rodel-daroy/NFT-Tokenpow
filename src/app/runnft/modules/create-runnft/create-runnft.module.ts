import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRunNftRoutingModule } from './create-runnft-routing.module'
import { StepsModule } from 'primeng/steps';
import { SharedModule } from '../../../shared/shared.module';
import { CreateRunNftStepsPageComponent } from './pages/create-runnft-steps-page/create-runnft-steps-page.component'
import { CreateRunNftPageComponent } from './pages/create-runnft-page/create-runnft-page.component'
import { CreatePreviewRunNftComponent } from './pages/create-preview-runnft/create-preview-runnft.component'
import { ThankYouPageAssetsComponent } from './pages/thank-you-page-runnft/thank-you-page.component'

import { RunNftMoudle } from '../../runassets.module';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DialogModule } from 'primeng/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { LottieModule } from 'ngx-lottie';
import { EditorModule } from 'primeng/editor';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailService } from './services/email.service';
import { CreateRunNftDataService } from './services/create-runnft-data.service'
import { EditorModule as KendoUIEditor } from '@progress/kendo-angular-editor';
import { from } from 'rxjs';
//import { ModifyRunNftPageComponent } from './pages/modify-runnft-page/modify-runnft-page.component'

@NgModule({
  declarations: [
    CreateRunNftStepsPageComponent,
    CreateRunNftPageComponent,
    CreatePreviewRunNftComponent,
    ThankYouPageAssetsComponent,
    //ModifyRunNftPageComponent,
  ],
  imports: [
    CommonModule,
    CreateRunNftRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    StepsModule,
    SharedModule,
    RunNftMoudle,
    CheckboxModule,
    MultiSelectModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    CalendarModule,
    DropdownModule,
    DialogModule,
    TranslateModule,
    EditorModule,
    KendoUIEditor,
    LottieModule,
    NgSelectModule,
  ],
  providers: [CreateRunNftDataService, EmailService]
})
export class CreateRunNftModule { }




