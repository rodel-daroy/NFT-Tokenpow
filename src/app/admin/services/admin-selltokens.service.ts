import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {Observable, throwError} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {catchError, map} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';
import {ToastrService} from 'ngx-toastr';
import {SelltokenStatus} from '../../selltokens/enums/selltoken-status.enum';

@Injectable()
export class AdminSelltokensService {
  private field = 'createdAt';
  private pageSize = 8;

  constructor(private afs: AngularFirestore,
              private toastrService: ToastrService) { }

  getAllselltokens(): Observable<ISelltoken[]> {
    return this.afs
      .collection('selltokens', ref => {
        return ref
          .orderBy(this.field, 'asc');
      })
      .get()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  getselltokenByStatus(status: SelltokenStatus): Observable<ISelltoken[]> {
    return this.afs
      .collection('selltokens', ref => {
        return ref
          .where('status', '==', status)
          .orderBy(this.field, 'asc')
          .limit(this.pageSize);
      })
      .get()
      .pipe(
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  getAllrefunds(): Observable<any[]> {
    return this.afs
      .collection('refund_coins', ref => {
        return ref;
      })
      .get()
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        }),
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  removeRefund(uid: string) {
    console.log("uid: ", uid)
    return this.afs.doc(`refund_coins/${uid}`).delete();
  }
}
