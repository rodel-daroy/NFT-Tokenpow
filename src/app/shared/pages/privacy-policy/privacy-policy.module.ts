import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivacyPolicyRoutingModule } from './privacy-policy-routing.module';
import {PrivacyPolicyEsComponent} from './privacy-policy-es/privacy-policy-es.component';
import {PrivacyPolicyChComponent} from './privacy-policy-ch/privacy-policy-ch.component';
import {PrivacyPolicySkComponent} from './privacy-policy-sk/privacy-policy-sk.component';
import {PrivacyPolicyEnComponent} from './privacy-policy-en/privacy-policy-en.component';
import { PrivacyPolicyRoComponent } from './privacy-policy-ro/privacy-policy-ro.component';


@NgModule({
  declarations: [PrivacyPolicyEsComponent, PrivacyPolicyChComponent, PrivacyPolicySkComponent, PrivacyPolicyEnComponent, PrivacyPolicyRoComponent],
  imports: [
    CommonModule,
    PrivacyPolicyRoutingModule
  ]
})
export class PrivacyPolicyModule { }
