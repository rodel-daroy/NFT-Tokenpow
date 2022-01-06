import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {AppStateService} from '../../shared/services/app-state.service';
import {Observable} from 'rxjs';
import {IbanWithdrawalRequest} from '../models/iban-withdrawal-request';
import {map, switchMap} from 'rxjs/operators';
import {AngularFireFunctions} from '@angular/fire/functions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserService} from '../../user/services/user.service';

@Injectable()
export class IbanWithdrawalRequestsService {

  constructor(private afs: AngularFirestore,
              private functions: AngularFireFunctions,
              private httpClient: HttpClient,
              private userService: UserService,
              private stateService: AppStateService) { }

  getAllNonApprovedWithdrawalRequests(): Observable<IbanWithdrawalRequest[]> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'waiting');
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

  getAllCompletedWithdrawalRequests(): Observable<IbanWithdrawalRequest[]> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'completed');
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

  getAllApprovedWithdrawalRequests(): Observable<IbanWithdrawalRequest[]> {
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'approved');
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

  getAllRejectedWithdrawalRequests(): Observable<IbanWithdrawalRequest[]> {
    return this.afs
      .collection('iban-withdrawal-requests', ref => {
        return ref.where('status', '==', 'declined');
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

  async approveRequest(request: IbanWithdrawalRequest): Promise<void> {
    this.stateService.changeState('loading');
    const callable = this.functions.httpsCallable('sendWithdrawApproveEmail');
    await callable({
      userEmail: request.email,
      userFirstName: request.userFirstName,
      userLastName: request.userLastName,
      amount: request.amountInSatoshis
    }).subscribe(res => console.log(res));

    await this.httpClient.post(`${environment.apiUrl}/bsv/withdraw-user-coins-to-iban`,
      {userId: request.userId, amountToWithdraw: request.amountInSatoshis}).pipe(
           switchMap((res: {tx: string, fee: any, toWallet: string, fromWallet: string}) => {
             return this.userService.sendWithdrawTransactionToTxt(
               request.amountInSatoshis,
               request.email,
               res.tx,
               request.userId,
               true,
               '',
               res.fromWallet,
               res.toWallet,
               res.fee.toString(),
               false
             );
           })
    ).subscribe(res => console.log(res));
    return this.afs.doc(`iban-withdrawal-requests/${request.uid}`)
      .set({status: 'approved'}, {merge: true});
  }

  async completeRequest(request: IbanWithdrawalRequest): Promise<void> {
    return this.afs.doc(`iban-withdrawal-requests/${request.uid}`)
      .set({status: 'completed'}, {merge: true});
  }

  async declineRequest(request: IbanWithdrawalRequest, reason): Promise<void> {
    this.stateService.changeState('loading');
    const callable = this.functions.httpsCallable('sendWithdrawDeclineEmail');
    await callable({
      userEmail: request.email,
      userFirstName: request.userFirstName,
      userLastName: request.userLastName,
      amount: request.amountInSatoshis,
      reason
    }).subscribe(res => console.log(res));
    return this.afs.doc(`iban-withdrawal-requests/${request.uid}`)
      .set({status: 'declined'}, {merge: true});
  }
}
