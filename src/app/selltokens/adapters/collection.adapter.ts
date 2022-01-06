import {ICollection} from '../models/collection.model';
import {DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';

export class CollectionAdapter {
  static fromDto(categories: QuerySnapshot<DocumentData>): ICollection[] {
    return categories.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
      return {
        documentId: snap.id,
        ...snap.data()
      } as ICollection;
    });
  }
}
