import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, DocumentSnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {map} from 'rxjs/operators';
import {SelltokenAdapter} from '../../selltokens/adapters/selltoken.adapter';
import {AuthService} from '../../auth/services/auth.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuardService {

  constructor(private afs: AngularFirestore) { }

  getSingleselltoken(selltokenId: string): Observable<ISelltoken> {
    return this.afs.doc(`selltokens/${selltokenId}`)
      .get()
      .pipe(
        map((selltoken: DocumentSnapshot<DocumentData>) => {
          return SelltokenAdapter.fromDocumentSnapshotSingleselltoken(selltoken);
        })
      );
  }
 }
