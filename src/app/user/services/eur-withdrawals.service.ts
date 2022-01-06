import {Injectable, OnInit} from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {IbanWithdrawalRequest} from '../../admin/models/iban-withdrawal-request';
import {map} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth.service';

@Injectable()
export class EurWithdrawalsService {

  constructor(private afs: AngularFirestore) { }

  getAllNonApprovedWithdrawalRequests(email: string): Observable<IbanWithdrawalRequest[]> {
    console.log('EMAIL: ', email);
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'waiting')
                  .where('email', '==', email);
      }).get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as IbanWithdrawalRequest;
          });
        })
      );
  }

  getAllApprovedWithdrawalRequests(email: string): Observable<IbanWithdrawalRequest[]> {
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'approved')
                  .where('email', '==', email);
      }).get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as IbanWithdrawalRequest;
          });
        })
      );
  }

  getAllRejectedWithdrawalRequests(email: string): Observable<IbanWithdrawalRequest[]> {
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'declined')
                  .where('email', '==', email);
      }).get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as IbanWithdrawalRequest;
          });
        })
      );
  }
}
