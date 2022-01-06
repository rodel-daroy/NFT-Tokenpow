import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie';

@Injectable()
export class MoneyButtonService {

  constructor(private httpClient: HttpClient,
              private cookieService: CookieService) { }

  // getMaxWithdrawal(userId: string): Observable<any> {
  //   return this.httpClient.get(`https://www.moneybutton.com/api/v1/users/${userId}/balance`, {
  //     headers: {
  //       Authorization: 'Bearer ' + this.cookieService.get('access_token')
  //     }
  //   })
  //     .pipe(
  //       map((res: any) => {
  //         return {
  //           id: res.data.id,
  //           satoshis: res.data.attributes.satoshis
  //         };
  //       })
  //     );
  // }

  // getUserBalance(userId: string): Observable<any> {
  //   return this.httpClient.get('https://us-central1-viral-captis.cloudfunctions.net/mnybtn/user-balance', {
  //     headers: {
  //       userId,
  //       bearer: 'Bearer ' + this.cookieService.get('access_token')
  //     }
  //   });
  // }
}
