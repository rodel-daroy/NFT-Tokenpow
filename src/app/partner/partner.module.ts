import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartnerRoutingModule } from './partner-routing.module';
import {AuthService} from '../auth/services/auth.service';
import {SharedModule} from '../shared/shared.module';
import {TableModule} from 'primeng/table';
import {TabMenuModule} from 'primeng/tabmenu';
import {TabViewModule} from 'primeng/tabview';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {DialogService, DynamicDialogModule} from 'primeng/dynamicdialog';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService} from 'primeng/api';
import {TranslateModule} from '@ngx-translate/core';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {InputTextModule} from 'primeng/inputtext';
import { PartnerComponent } from './partner.component';
import { ManageCollectionsComponent } from './manage-collections/manage-collections.component';
import { PartnerService } from './services/partner.service';
import { DragDropDirective } from './drag-drop.directive';

@NgModule({
  declarations: [
      PartnerComponent,
      ManageCollectionsComponent,
      DragDropDirective
  ],
  imports: [
    CommonModule,
    PartnerRoutingModule,
    SharedModule,
    TableModule,
    ProgressSpinnerModule,
    TabMenuModule,
    TabViewModule,
    DynamicDialogModule,
    InputTextareaModule,
    ConfirmDialogModule,
    TranslateModule,
    InfiniteScrollModule,
    InputTextModule,
    DropdownModule
  ],
  providers: [AuthService, DialogService, ConfirmationService, PartnerService]
})
export class PartnerModule { }
