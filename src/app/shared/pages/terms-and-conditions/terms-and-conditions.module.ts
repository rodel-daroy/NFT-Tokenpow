import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsAndConditionsRoutingModule } from './terms-and-conditions-routing.module';
import { TermsAndConditionsEnComponent } from './terms-and-conditions-en/terms-and-conditions-en.component';
import { TermsAndConditionsEsComponent } from './terms-and-conditions-es/terms-and-conditions-es.component';
import { TermsAndConditionsChComponent } from './terms-and-conditions-ch/terms-and-conditions-ch.component';
import { TermsAndConditionsSkComponent } from './terms-and-conditions-sk/terms-and-conditions-sk.component';
import { TermsAndConditionsRoComponent } from './terms-and-conditions-ro/terms-and-conditions-ro.component';


@NgModule({
  declarations: [TermsAndConditionsEnComponent, TermsAndConditionsEsComponent, TermsAndConditionsChComponent, TermsAndConditionsSkComponent, TermsAndConditionsRoComponent],
  imports: [
    CommonModule,
    TermsAndConditionsRoutingModule
  ]
})
export class TermsAndConditionsModule { }
