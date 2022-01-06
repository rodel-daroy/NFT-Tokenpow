import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TermsAndConditionsEnComponent} from './terms-and-conditions-en/terms-and-conditions-en.component';
import {TermsAndConditionsSkComponent} from './terms-and-conditions-sk/terms-and-conditions-sk.component';
import {TermsAndConditionsChComponent} from './terms-and-conditions-ch/terms-and-conditions-ch.component';
import {TermsAndConditionsEsComponent} from './terms-and-conditions-es/terms-and-conditions-es.component';
import {TermsAndConditionsRoComponent} from './terms-and-conditions-ro/terms-and-conditions-ro.component';

const routes: Routes = [
  {
  path: '',
  redirectTo: 'en',
  pathMatch: 'full'
},
  {
    path: 'en',
    component: TermsAndConditionsEnComponent
  },
  {
    path: 'sk',
    component: TermsAndConditionsSkComponent
  },
  {
    path: 'ch',
    component: TermsAndConditionsChComponent
  },
  {
    path: 'es',
    component: TermsAndConditionsEsComponent
  },
  {
    path: 'ro',
    component: TermsAndConditionsRoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsAndConditionsRoutingModule { }
