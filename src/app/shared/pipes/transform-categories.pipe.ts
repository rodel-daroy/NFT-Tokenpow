import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from 'src/app/selltokens/models/category.model';

@Pipe({
  name: 'transformCategories',
  pure: true
})
export class TransformCategoriesPipe implements PipeTransform {

  /**
   * @param categories - selltoken categories
   * @return formatted category string for selltoken card
   */
  transform(categories: ICategory[]): string {
    const names = [];
    names
      .push(
        ...categories
        .map(
          (category) => category.nameEN
        ));

    return names.join(', ');
  }

}
