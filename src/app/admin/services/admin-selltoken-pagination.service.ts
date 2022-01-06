import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {AdminSelltokensService} from './admin-selltokens.service';
import {SelltokenStatus} from '../../selltokens/enums/selltoken-status.enum';
import {map} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';

@Injectable()
export class AdminSelltokenPaginationService {

  private field = 'createdAt';
  private pageSize = 8;
  private _data = new BehaviorSubject<ISelltoken[]>([]);
  $data = this._data.asObservable();

  constructor(private afs: AngularFirestore,
              private AdminSelltokensService: AdminSelltokensService) { }

  init(): void {
    this.getDataByStatus(SelltokenStatus.APPROVED);
  }

  getDataByStatus(status: SelltokenStatus): void {
    this.AdminSelltokensService.getselltokenByStatus(status)
      .subscribe(res => {
        this._data.next(res);
        this.$data = this._data.asObservable();
      });
  }

  nextPage(last: ISelltoken, status: SelltokenStatus): void {
    this.afs.collection('selltokens', ref => {
      return ref.orderBy(this.field, 'asc')
        .startAfter(last[this.field])
        .where('status', '==', status)
        .limit(this.pageSize);
    }).get()
      .pipe(
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      ).subscribe(res => {
        const current = [...this._data.value];
        this._data.next(current.concat(...res));
    });
  }
}
