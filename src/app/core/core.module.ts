import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LazyImageLoadingDirective} from './Directives/lazy-image-loading.directive';



@NgModule({
  declarations: [LazyImageLoadingDirective],
  imports: [
    CommonModule
  ]
})
export class CoreModule { }
