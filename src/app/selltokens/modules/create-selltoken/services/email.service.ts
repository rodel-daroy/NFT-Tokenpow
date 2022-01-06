import { Injectable } from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';

@Injectable()
export class EmailService {

  constructor(private functions: AngularFireFunctions) { }

  async sendNewselltokenEmail(): Promise<void> {
    const callable = this.functions.httpsCallable('sendNewselltokenWaitingEmail');
    await callable({}).subscribe(res => console.log(res));
  }

  async sendNewBidEmail(): Promise<void> {
    const callable = this.functions.httpsCallable('sendNewBidEmail');
    await callable({}).subscribe(res => console.log(res));
  }
}
