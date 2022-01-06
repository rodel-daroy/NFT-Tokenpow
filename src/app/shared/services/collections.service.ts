import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ICollection} from '../../selltokens/models/collection.model';
import {map} from 'rxjs/operators';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {NgxSpinnerService} from 'ngx-spinner';
import {CollectionAdapter} from '../../selltokens/adapters/collection.adapter';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private collections = new BehaviorSubject<ICollection[]>([]);
  currentCategories = this.collections.asObservable();

  constructor(private db: AngularFirestore,
              private spinner: NgxSpinnerService) {

    this.getAllCategories().subscribe(res => this.changeCategories(res));
  }

  changeCategories(collectionArray: ICollection[]): void {
    console.log('subscribe change!!! category =====>');
    this.collections.next(collectionArray);
  }

  private getAllCategories(): Observable<ICollection[]> {
    console.log('get categories!!! =====>');
    this.spinner.show();
    return this.db.collection('collections', ref => {
      return ref
        .orderBy('order', 'asc');
    }).snapshotChanges()
      .pipe(
        // map((categories: QuerySnapshot<DocumentData>) => {
        //   return CollectionAdapter.fromDto(categories);
        // })
        map((res: any) => {
          return res.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            data['documentId'] = id;
            return data;
          });
        })
      );
  }
}
