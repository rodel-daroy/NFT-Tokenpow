import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BsvPriceService {

  constructor(private httpClient: HttpClient) { }

  getCurrentBsvPriceInBsv(): Observable<any> {
      // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=BSV'
      return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
        // , {
        //   headers: {
        //     Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
        //   }
        // }
      );
  }

  getCurrentBsvPriceInUsd(): Observable<any> {
    // return this.httpClient.get('https://min-api.cryptocompare.com/data/price?fsym=BSV&tsyms=USD', {
    return this.httpClient.get('https://api.whatsonchain.com/v1/bsv/main/exchangerate'
      // , {
      // headers: {
      //   Authorization: 'Apikey ff83f79e6472d406dad96ee09558ff5489e302e04214723d0fe11f15c60cf99f'
      // }
      // }
    );
  }
}
