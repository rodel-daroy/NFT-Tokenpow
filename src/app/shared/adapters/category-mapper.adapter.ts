import {ICategory} from '../../selltokens/models/category.model';

export class CategoryAdapter {
  static fromDtoMultipleCategories(categories: ICategory[]): any[] {
    return categories.map(category => {
      return {
        id: category.id,
        nameEN: category.nameEN ? category.nameEN : category.name,
        nameES: category.nameES ? category.nameES : category.name,
        nameCH: category.nameCH ? category.nameCH : category.name,
        nameSK: category.nameSK ? category.nameSK : category.name,
        visibleInCreationProcess: category.visibleInCreationProcess
      };
    });
  }
}
