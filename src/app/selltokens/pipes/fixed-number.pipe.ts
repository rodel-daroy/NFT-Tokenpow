import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fixedNumber'
})
export class FixedNumberPipe implements PipeTransform {

  transform(value: number): number {
    return Number(Number(value).toFixed(0));
  }

}
