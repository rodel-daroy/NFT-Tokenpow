import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {DonateRequest} from '../../selltokens/models/donate-request.model';
import {map} from 'rxjs/operators';
import {AppStateService} from '../../shared/services/app-state.service';
import {SelltokenService} from '../../selltokens/services/selltoken.service';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable()
export class DonateService {

  constructor(private afs: AngularFirestore,
              private stateService: AppStateService,
              private SelltokenService: SelltokenService,
              private functions: AngularFireFunctions) { }

  getAllDonateRequests(): Observable<DonateRequest[]> {
    this.stateService.changeState('loading');
    return this.afs.collection('donate_requests', ref => {
      return ref.where('status', '==' , 'waiting');
    })
      .get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as DonateRequest;
          });
        })
      );
  }

  getAllApprovedRequests(): Observable<DonateRequest[]> {
    this.stateService.changeState('loading');
    return this.afs.collection('donate_requests', ref => {
      return ref.where('status', '==' , 'approved');
    })
      .get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as DonateRequest;
          });
        })
      );
  }

  getAllDeclinedRequests(): Observable<DonateRequest[]> {
    this.stateService.changeState('loading');
    return this.afs.collection('donate_requests', ref => {
      return ref.where('status', '==' , 'rejected');
    })
      .get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as DonateRequest;
          });
        })
      );
  }

  updateDonateRequest(donateRequest: DonateRequest): Promise<any> {
    return this.afs.doc(`donate_requests/${donateRequest.uid}`).set(donateRequest, {merge: true});
  }

  async declineRequest(donateRequest: DonateRequest, reason): Promise<any> {
    this.updateDonateRequest({uid: donateRequest.uid, status: 'rejected'});
    const callable = this.functions.httpsCallable('sendDonationDeclineEmail');
    await callable({
      email: donateRequest.from,
      selltokenLink: donateRequest.link,
      reason
    }).subscribe(res => console.log(res));
    return this.SelltokenService
      .sendDonationDataToTxT(
        donateRequest.totalAmount,
        donateRequest.selltokenId,
        '',
        '',
        donateRequest.from,
        donateRequest.uid,
        '',
        donateRequest.comment,
        donateRequest.link,
        donateRequest.payedToselltoken,
        donateRequest.payedToGoBitFundMe,
        donateRequest.stripeFee,
        donateRequest.payedToUserFromLink,
        true
      );
  }
}
