import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locationFormatter'
})
export class LocationFormatterPipe implements PipeTransform {

  transform(location: {name: string}): string {
    return location?.name;
  }

}
