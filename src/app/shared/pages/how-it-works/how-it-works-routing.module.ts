import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HowItWorksComponent} from './en/how-it-works.component';
import {HowItWorksSkComponent} from './how-it-works-sk/how-it-works-sk.component';
import {HowItWorksChComponent} from './how-it-works-ch/how-it-works-ch.component';
import {HowItWorksEsComponent} from './how-it-works-es/how-it-works-es.component';
import {HowItWorksRoComponent} from './how-it-works-ro/how-it-works-ro.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'en',
    pathMatch: 'full'
  },
  {
    path: 'en',
    component: HowItWorksComponent
  },
  {
    path: 'sk',
    component: HowItWorksSkComponent
  },
  {
    path: 'ch',
    component: HowItWorksChComponent
  },
  {
    path: 'es',
    component: HowItWorksEsComponent
  },
  {
    path: 'ro',
    component: HowItWorksRoComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HowItWorksRoutingModule { }
