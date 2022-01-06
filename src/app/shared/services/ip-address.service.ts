import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpAddressService {

  constructor(private httpClient: HttpClient) { }

  getIpAddress(): Observable<any> {
    return this.httpClient.get('https://api.ipify.org/?format=json');
  }

  getIpLocation(): Observable<any> {
    return this.getIpAddress().pipe(
      switchMap(res => {
        if (res) {
          return this.httpClient.post(`${environment.apiUrl}/ipDeleter/get-ip`, {ip: res?.ip});
        } else {
          return of(null);
        }
      })
    );
  }

}
