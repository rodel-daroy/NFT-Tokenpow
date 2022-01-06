import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CollectionAdapter } from 'src/app/selltokens/adapters/collection.adapter';

@Injectable()
export class PartnerService {

    constructor(
        private afs: AngularFirestore
    ) { }

    getCollectionsByUser(userid) {
        return this.afs
            .collection('collections', ref => {
                return ref
                    .orderBy('order', 'asc')
                    // .where('createdBy', '==', userid)
            })
            .snapshotChanges()
            .pipe(
                map(collections => {
                    return collections.map(a => {
                      const data = a.payload.doc.data();
                      const id = a.payload.doc.id;
                      return {data, id};
                    });
                })
            );
    }

    // deleteselltoken(selltokenId: string): Promise<any> {
    //     return this.afs.doc(`selltokens/${selltokenId}`).delete();
    // }

    updateCollection(selectedId, name, description, type, url, duration, increment) {
        return this.afs.doc(`collections/${selectedId}`).set({
            name: name,
            description: description,
            type: type,
            url: url,
            duration: duration,
            increment: increment
        }, { merge: true });
    }

    createCollection(userid, id, name, description, order, type, url, duration, increment) {
        this.afs.collection("collections").add({
            id: id,
            name: name,
            description: description,
            order: order,
            type: type,
            url: url,
            duration: duration,
            increment: increment,
            createdBy: userid
        })
    }
}
