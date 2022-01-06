import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'descriptionFormatter'
})
export class DescriptionFormatterPipe implements PipeTransform {

  transform(value: string): string {
    return value?.split('/newLineSeparator/').join('<br />');
  }

}
