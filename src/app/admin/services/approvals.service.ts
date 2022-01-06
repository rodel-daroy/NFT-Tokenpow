import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QuerySnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {AppStateService} from '../../shared/services/app-state.service';
import {map} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';
import {SelltokenStatus} from '../../selltokens/enums/selltoken-status.enum';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable()
export class ApprovalsService {

  constructor(private afs: AngularFirestore,
              private functions: AngularFireFunctions,
              private stateService: AppStateService) { }

  getAllNonApprovedselltokens(): Observable<ISelltoken[]> {
    this.stateService.changeState('loading');
    return this.afs
      .collection('selltokens', ref => {
        return ref
          .where('status', '==', SelltokenStatus.CREATION);
      })
      .get()
      .pipe(
        map((selltokens: QuerySnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDtoMultipleselltokens(selltokens);
        })
      );
  }

  deleteselltoken(selltokenId: string): Promise<any> {
    return this.afs.doc(`selltokens/${selltokenId}`).delete();
  }

  updateselltoken(selltoken: ISelltoken): Promise<any> {
    return this.afs.doc(`selltokens/${selltoken.uid}`).set(selltoken, {merge: true});
  }

  async sendRejectEmail(userEmail: string, message: string): Promise<void> {
    const callable = this.functions.httpsCallable('sendEmail');
    await callable({
      userEmail,
      message
    }).subscribe(res => console.log(res));
  }

  async sendApproveEmail(userEmail: string, userFirstName: string, selltokenUrl: string, selltokenTitle: string): Promise<void> {
    const callable = this.functions.httpsCallable('sendApproveEmail');
    await callable({
      userEmail,
      userFirstName,
      selltokenUrl,
      selltokenTitle
    }).subscribe(res => console.log(res ));
  }
}
