import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelltokenCountriesService {

  constructor(private afs: AngularFirestore) { }

  getCountries(): Observable<any>{
    return this.afs.doc('countries/countries')
      .snapshotChanges()
      .pipe(
        map((res) => {
          const countries = res.payload.data();
          return countries['countries'].map(country => {
            return {
              name: country
            };
          });
        }));
  }
}
