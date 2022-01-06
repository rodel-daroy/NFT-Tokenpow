import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[libCommonControlErrorContainer]'
})
export class CommonControlErrorContainerDirective {

  constructor(public vcr: ViewContainerRef) { }

}
