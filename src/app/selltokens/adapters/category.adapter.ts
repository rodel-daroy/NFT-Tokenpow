import {ICategory} from '../models/category.model';
import {DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';

export class CategoryAdapter {
  static fromDto(categories: QuerySnapshot<DocumentData>): ICategory[] {
    return categories.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
      return {
        id: snap.id,
        ...snap.data()
      } as ICategory;
    });
  }
}
