import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAssetsRoutingModule } from './create-assets-routing.module'
import { StepsModule } from 'primeng/steps';
import { SharedModule } from '../../../shared/shared.module';
import { CreateAssetsStepsPageComponent } from './pages/create-assets-steps-page/create-assets-steps-page.component'
import { CreateAssetsPageComponent } from './pages/create-assets-page/create-assets-page.component'
import { CreatePreviewAssetComponent } from './pages/create-preview-assets/create-preview-assets.component'
import { ThankYouPageAssetsComponent } from './pages/thank-you-page-assets/thank-you-page.component'

import { MeneyAssetsModule } from '../../moneyassets.module';
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
import { CreateAssetsDataService } from './services/create-assets-data.service'
import { EditorModule as KendoUIEditor } from '@progress/kendo-angular-editor';
import { from } from 'rxjs';
import { ModifyAssetsPageComponent } from './pages/modify-assets-page/modify-assets-page.component'
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  declarations: [
    CreateAssetsStepsPageComponent,
    CreateAssetsPageComponent,
    CreatePreviewAssetComponent,
    ThankYouPageAssetsComponent,
    ModifyAssetsPageComponent,
    DragDropDirective
  ],
  imports: [
    CommonModule,
    CreateAssetsRoutingModule,
    HttpClientModule,
    AngularEditorModule,
    StepsModule,
    SharedModule,
    MeneyAssetsModule,
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
  providers: [CreateAssetsDataService, EmailService]
})
export class CreateAssetsModule { }




