import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRunTokenRoutingModule } from './create-runtoken-routing.module'
import { StepsModule } from 'primeng/steps';
import { SharedModule } from '../../../shared/shared.module';
import { CreateRunTokenStepsPageComponent } from './pages/create-runtoken-steps-page/create-runtoken-steps-page.component'
import { CreateRunTokenPageComponent } from './pages/create-runtoken-page/create-runtoken-page.component'
import { CreatePreviewRunTokenComponent } from './pages/create-preview-runtoken/create-preview-runtoken.component'
import { ThankYouPageRunTokenComponent } from './pages/thank-you-page-runtoken/thank-you-page.component'
import { RunTokenModule } from '../../runtoken.module';
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
import { CreateRunTokenDataService } from './services/create-runtoken-data.service'
import { EditorModule as KendoUIEditor } from '@progress/kendo-angular-editor';
import { from } from 'rxjs';
import { ModifyRunTokenPageComponent } from './pages/modify-runtoken-page/modify-runtoken-page.component'

@NgModule({
  declarations: [
    CreateRunTokenStepsPageComponent,
    CreateRunTokenPageComponent,
    CreatePreviewRunTokenComponent,
    ThankYouPageRunTokenComponent,
    ModifyRunTokenPageComponent,
  ],
  imports: [
    CommonModule,
    CreateRunTokenRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    StepsModule,
    SharedModule,
    RunTokenModule,
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
  providers: [CreateRunTokenDataService, EmailService]
})
export class CreateRunTokenModule { }




