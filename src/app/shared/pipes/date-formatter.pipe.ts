import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormatter'
})
export class DateFormatterPipe implements PipeTransform {

  // @memo()
  transform(value: any, showExactTime?: boolean): string {
    if (showExactTime === true) {
      if (value?.seconds) {
        return moment(value?.seconds * 1000).format('DD MMMM YYYY HH:mm:ss');
      } else if (value) {
        return moment(value * 1000).format('DD MMMM YYYY HH:mm:ss');
      }
    } else {
      if (value?.seconds) {
        return moment(value?.seconds * 1000).format('DD MMMM YYYY');
      } else if (value) {
        return moment(value * 1000).format('DD MMMM YYYY');
      }
    }
  }

}
