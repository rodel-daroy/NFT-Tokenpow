import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, single} from 'rxjs/operators';
import {Donation} from '../models/donation.model';
import {Observable} from 'rxjs';
import {AppStateService} from '../../shared/services/app-state.service';
import {environment} from '../../../environments/environment';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {DonateRequest} from '../models/donate-request.model';

@Injectable()
export class DonationsService {

  constructor(private httpClient: HttpClient,
              private afs: AngularFirestore,
              private stateService: AppStateService) {}

  getAllDonationsForselltoken(selltokenId: string): Observable<Donation[]> {
    this.stateService.changeState('loading');
    return this
      .httpClient
      .get<Donation[]>(`${environment.apiUrl}/bsv/donations-for-selltoken`, {headers: {selltokenId}})
      .pipe(
        map((data: any) => {
          return data.result.map((singleDonation: any) => {
            console.log(singleDonation);
            return {
              uid: singleDonation.id,
              amountPayed: singleDonation.data?.amountPayed,
              comment: singleDonation.data?.comment ? singleDonation.data?.comment : '',
              created_at: singleDonation.data.created_at,
              //from: singleDonation.data?.from ? singleDonation.data?.from : '',
              from: '',
              txid: singleDonation.meta.txid,
              feeAmountSatoshis: singleDonation.data?.feeAmountSatoshis ? singleDonation.data?.feeAmountSatoshis : '',
              link: singleDonation.data?.link ? singleDonation.data?.link : '',
              payedToselltoken: singleDonation.data?.payedToselltoken ? singleDonation.data?.payedToselltoken : '',
              payedToGoBitFundMe: singleDonation.data?.payedToGoBitFundMe ? singleDonation.data?.payedToGoBitFundMe : '',
              payedToUserFromLink: singleDonation.data?.payedToUserFromLink ? singleDonation.data?.payedToUserFromLink : '',
            } as Donation;
          });
        })
      );
  }

  getPendingDonationsForselltoken(selltokenId: string): Observable<DonateRequest[]> {
    return this.afs.collection('donate_requests', ref => {
      return ref.where('selltokenId', '==', selltokenId)
                .where('status', '==', 'waiting');
    }).get()
      .pipe(
        map((donations: QuerySnapshot<DocumentData>) => {
          return donations.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as DonateRequest;
          });
        })
      );
  }

  getRejectedDonationsForselltoken(selltokenId: string): Observable<DonateRequest[]> {
    return this.afs.collection('donate_requests', ref => {
      return ref.where('selltokenId', '==', selltokenId)
        .where('status', '==', 'rejected');
    }).get()
      .pipe(
        map((donations: QuerySnapshot<DocumentData>) => {
          return donations.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as DonateRequest;
          });
        })
      );
  }
}
