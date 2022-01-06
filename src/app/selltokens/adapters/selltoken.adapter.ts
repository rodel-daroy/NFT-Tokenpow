import {ISelltoken} from '../models/selltoken.model';
import {Action, DocumentData, DocumentSnapshot, QueryDocumentSnapshot, QuerySnapshot,DocumentChangeAction} from '@angular/fire/firestore';
import { BidHistory } from '../models/bid-history.model';

export class SelltokenAdapter {
  static fromDtoMultipleselltokens(selltokens: QuerySnapshot<DocumentData>): ISelltoken[] {
    return selltokens.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
      return {
        uid: snap.id,
        ...snap.data()
      } as ISelltoken;
    });
  }
  static fromBidActions(bidHistorys: QuerySnapshot<DocumentData>): BidHistory[] {
    return bidHistorys.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
      return {
        uid: snap.id,
        ...snap.data()
      } as BidHistory;
    });
  }
  static fromSnapshottoMultipleselltokens(selltokens: DocumentChangeAction<ISelltoken>[]): ISelltoken[] {
    return selltokens.map((snap) => {
      const data = snap.payload.doc.data();
      const id = snap.payload.doc.id;
      return { id, ...data } as ISelltoken;
    });
  }
  static fromDtoSingleselltoken(selltoken: Action<DocumentData>): ISelltoken {
    return {
      uid: selltoken.payload.id,
      ...selltoken.payload.data(),
      // description: selltoken.payload.data().description.split('/newLineSeparator/').join('\n\n')
    } as ISelltoken;
  }

  static fromDocumentSnapshotSingleselltoken(selltoken: DocumentSnapshot<DocumentData>): ISelltoken {
    return {
      uid: selltoken.id,
      ...selltoken.data(),
    } as ISelltoken;
  }

  static toDto(): void {

  }
}
