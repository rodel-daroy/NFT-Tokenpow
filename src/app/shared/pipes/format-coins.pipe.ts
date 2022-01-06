import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCoins'
})
export class FormatCoinsPipe implements PipeTransform {

  transform(value: number): string {
    return value?.toString().replace(
      /(?!^)(?=(?:\d{3})+$)/g,
      '\''
    );
  }

}
