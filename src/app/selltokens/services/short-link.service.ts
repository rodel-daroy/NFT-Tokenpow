import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentData, QueryDocumentSnapshot, QuerySnapshot} from '@angular/fire/firestore';
import {Observable, of, throwError} from 'rxjs';
import {IShortUrl} from '../models/shortUrl.model';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShortLinkService {

  constructor(private db: AngularFirestore,
              private httpClient: HttpClient,
              private toastrService: ToastrService) { }

  createShortLink(longUrl, userId, selltokenId, userAddress: string, userEmail: string): Observable<IShortUrl> {
    return this.httpClient.post<IShortUrl>(`${environment.apiUrl}/urlShortener/shorten`, {
      longUrl,
      userId,
      selltokenId,
      userAddress,
      userEmail
    }).pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        })
      );
  }

  redirectUserToLongUrl(selltokenId): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/urlShortener/redirect`, {
      shortUrl: window.location.href,
      selltoken_id: selltokenId
    }, { responseType: 'text'})
      .pipe(
        catchError(err => {
          this.toastrService.error(err, 'Error');
          return throwError(err);
        })
      );
  }

  checkIfUserAlreadyCreatedShortLink(userId, selltokenId): Observable<IShortUrl | null> {
    if (userId && selltokenId) {
      return this.db.collection('urls', ref => {
        return ref.where('userId', '==', userId)
          .where('selltokenId', '==', selltokenId).limit(1);
      })
        .get()
        .pipe(
          map((urls: QuerySnapshot<DocumentData>) => {
            return urls.docs.map((snap: QueryDocumentSnapshot<DocumentData>) => {
              return {
                ...snap.data()
              } as IShortUrl;
            })[0];
          })
        );
    } else {
      return of(null);
    }
  }
}
