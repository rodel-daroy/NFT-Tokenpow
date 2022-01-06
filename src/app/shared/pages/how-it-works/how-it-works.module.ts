import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HowItWorksRoutingModule } from './how-it-works-routing.module';
import {HowItWorksComponent} from './en/how-it-works.component';
import {LottieModule} from 'ngx-lottie';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ButtonModule} from 'primeng/button';
import { HowItWorksSkComponent } from './how-it-works-sk/how-it-works-sk.component';
import { HowItWorksChComponent } from './how-it-works-ch/how-it-works-ch.component';
import { HowItWorksEsComponent } from './how-it-works-es/how-it-works-es.component';
import { HowItWorksRoComponent } from './how-it-works-ro/how-it-works-ro.component';


@NgModule({
  declarations: [HowItWorksComponent, HowItWorksSkComponent, HowItWorksChComponent, HowItWorksEsComponent, HowItWorksRoComponent],
  imports: [
    CommonModule,
    HowItWorksRoutingModule,
    LottieModule,
    FlexLayoutModule,
    ButtonModule
  ]
})
export class HowItWorksModule { }
