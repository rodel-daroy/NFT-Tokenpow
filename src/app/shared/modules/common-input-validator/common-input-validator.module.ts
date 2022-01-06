import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonControlErrorsDirective } from './common-control-errors.directive';
import { CommonInputErrorComponent } from './common-input-error-component/common-input-error.component';
import { CommonControlErrorContainerDirective } from './common-control-error-container.directive';

@NgModule({
  declarations: [CommonControlErrorsDirective, CommonInputErrorComponent, CommonControlErrorContainerDirective],
  imports: [
    CommonModule,
  ],
  exports: [
    CommonControlErrorsDirective,
    CommonControlErrorContainerDirective
  ]
})
export class CommonInputValidatorModule { }
