import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrivacyPolicyEnComponent} from './privacy-policy-en/privacy-policy-en.component';
import {PrivacyPolicySkComponent} from './privacy-policy-sk/privacy-policy-sk.component';
import {PrivacyPolicyChComponent} from './privacy-policy-ch/privacy-policy-ch.component';
import {PrivacyPolicyEsComponent} from './privacy-policy-es/privacy-policy-es.component';
import {PrivacyPolicyRoComponent} from './privacy-policy-ro/privacy-policy-ro.component';

const routes: Routes = [  {
  path: '',
  redirectTo: 'en',
  pathMatch: 'full'
},
  {
    path: 'en',
    component: PrivacyPolicyEnComponent
  },
  {
    path: 'sk',
    component: PrivacyPolicySkComponent
  },
  {
    path: 'ch',
    component: PrivacyPolicyChComponent
  },
  {
    path: 'es',
    component: PrivacyPolicyEsComponent
  },
  {
    path: 'ro',
    component: PrivacyPolicyRoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivacyPolicyRoutingModule { }
