import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private httpClient: HttpClient,
              private functions: AngularFireFunctions) { }

  createIntent(amount): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/payments/intents`, {amount: amount * 100});
  }

  async sendDonationEmail(): Promise<void> {
    const callable = this.functions.httpsCallable('sendDonationApproveEmail');
    await callable({}).subscribe(res => console.log(res));
  }

  async sendNewContributionEmail(userEmail, selltokenLink): Promise<void> {
    const callable = this.functions.httpsCallable('sendNewContributionEmail');
    await callable({ userEmail, selltokenLink }).subscribe(res => console.log(res));
  }

  async sendNewContributionRewardEmail(sharedLinkUserEmail, selltokenLink): Promise<void> {
    const callable = this.functions.httpsCallable('sendNewContributionRewardEmail');
    await callable({ sharedLinkUserEmail, selltokenLink }).subscribe(res => console.log(res));
  }
}
