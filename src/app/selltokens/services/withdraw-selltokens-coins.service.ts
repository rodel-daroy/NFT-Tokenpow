import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppStateService} from '../../shared/services/app-state.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class WithdrawSelltokensCoinsService {

  constructor(private httpClient: HttpClient,
              private stateService: AppStateService) { }

  sendSelltokensCoinsToUserWallet(selltokenId, userAddress, selltokenAddress): Observable<any> {
    this.stateService.changeState('loading');
    return this
      .httpClient
      .post(`${environment.apiUrl}/bsv/move-selltokens-coins-to-user`,
        {
          selltokenId,
          userAddress,
          selltokenAddress
        });
  }

  checkWalletBalance(userAddress, showLoading:boolean): Observable<any> {
    if (showLoading)
      this.stateService.changeState('loading');
    return this
      .httpClient
      .post(`${environment.apiUrl}/bsv/check-user-wallet`, {
        userAddress
      });
  }
}
