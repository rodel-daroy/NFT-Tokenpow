import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerkService {

  constructor(private afs: AngularFirestore,
              private functions: AngularFireFunctions) { }


  savePerkRequest(perkRequest): void {
    this.afs.collection('perk_requests').add(perkRequest);
  }

  async sendEmailToselltokenOwner(email: string, message: string): Promise<void> {
    const callable = this.functions.httpsCallable('sendPerkRequestEmail');
    await callable({
      userEmail: email,
      message
    }).subscribe(res => console.log(res));
  }

  getAllPerksRequests(): Observable<any[]> {
    return this.afs
      .collection('perk_requests')
      .get()
      .pipe(
        map((data: QuerySnapshot<DocumentData>) => {
          return data.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              id: snap.id,
              ...snap.data()
            };
          });
        })
      );
  }



}
