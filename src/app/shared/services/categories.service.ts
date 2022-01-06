import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ICategory} from '../../selltokens/models/category.model';
import {map} from 'rxjs/operators';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {CategoryAdapter} from '../../selltokens/adapters/category.adapter';
import {CategoryAdapter as CategoryAdapterGlobal} from '../../shared/adapters/category-mapper.adapter';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private categories = new BehaviorSubject<ICategory[]>([]);
  currentCategories = this.categories.asObservable();

  constructor(private db: AngularFirestore) {
    this.getAllCategories().subscribe(res => this.changeCategories(res));
  }

  changeCategories(categories: ICategory[]): void {
    console.log('subscribe change!!! category =====>');
    this.categories.next(categories);
  }

  private getAllCategories(): Observable<ICategory[]> {
    console.log('get categories!!! =====>');
    return this.db.collection('categories').get()
      .pipe(
        map((categories: QuerySnapshot<DocumentData>) => {
          return CategoryAdapter.fromDto(categories);
        })
      ).pipe(
        map((categories: ICategory[]) => {
          return CategoryAdapterGlobal.fromDtoMultipleCategories(categories);
        })
      );
  }
}
