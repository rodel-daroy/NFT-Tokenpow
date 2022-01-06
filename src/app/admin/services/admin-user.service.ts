import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../../auth/models/user.model';
import {AppStateService} from '../../shared/services/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  constructor(private afs: AngularFirestore,
              private stateService: AppStateService) { }

  getAllUsers(): Observable<User[]> {
    this.stateService.changeState('loading');
    return this.afs.collection('users')
      .get()
      .pipe(
        map((requests: QuerySnapshot<DocumentData>) => {
          return requests.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
            return {
              uid: snap.id,
              ...snap.data()
            } as User;
          });
        })
      );
  }
}
