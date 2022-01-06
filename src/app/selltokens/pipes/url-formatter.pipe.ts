import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortUrl'
})
export class UrlFormatterPipe implements PipeTransform {

  transform(value: string): string {
    return value?.split('https://')[1];
  }

}
