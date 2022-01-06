import {Component, ElementRef, Inject, Input, OnInit, Output, PLATFORM_ID, Renderer2, ViewChild, EventEmitter} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {environment} from '../../../../environments/environment';
import {Presto, embed} from 'paypresto.js';
import {AngularFirestore} from '@angular/fire/firestore';


@Component({
  selector: 'app-paypresto',
  templateUrl: './paypresto.component.html',
  styleUrls: ['./paypresto.component.scss']
})
export class PayprestoComponent implements OnInit {

  @ViewChild('paypresto') paypresto: ElementRef;
  @Input() amount: number = 0;
  @Input() selltokenAddress: string;
  @Input() sharedAddress: string;
  @Output() onPayment = new EventEmitter<any>();
  @Output() onTxPushed = new EventEmitter<any>();

  isBrowser;
  promise;

  constructor(private renderer: Renderer2,
              private db: AngularFirestore,
              @Inject(PLATFORM_ID) private platformId) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.refresh();
  }

  public refresh(): void {
    setTimeout(() => {
      console.log('PAYPresto AMOUNT: ', this.amount);
      console.log('Auction address: ', this.selltokenAddress);
        const payment = Presto.create({
          appIdentifier: environment.payprestoAppId,
          key: 'Kx2p4o7FYJYjEwufdYJLXjPtu2vaSpQ8mB7mjMJnaHnPSrGQ1nQk',
          description: 'My PayPresto payment',
          currency: 'USD',
          outputs: [
            {to: this.selltokenAddress, satoshis:  this.amount},
            {to: '1A2RnxAU7ge4JFwxuPYWxWenhLMMfLDZpW', satoshis: Number(Number((this.amount / 100) * 2.5).toFixed(0))},
            {data: ['Buffer.from("TokenPow")']}
          ]
        }, 1000);
        setTimeout(() => {
          payment
            .mount(embed(this.paypresto.nativeElement))
            .on('invoice', invoice => console.log('INVOICE: ', invoice))
            .on('funded', pay => {
              console.log(pay);
              this.onPayment.emit(pay);
              pay.pushTx();
            })
            .on('success', txid => {
              console.log('TX sent', txid);
              this.onTxPushed.emit(txid);
            })
            .on('error', err => console.log('ERROR', err));
        }, 1000);
    });
  }

//   async getBsvPrivateKey(id: string, getUser: boolean): Promise<string> {
//     if (getUser) {
//       const snapshot = await this.db.doc(`users/${id}`).get();
//       return this.getDecryptedPrivateKey(snapshot.data().bsvAddress.privateKey)
//     } else {
//       const snapshot = await this.db.doc(`selltokens/${id}`).get();
//       return this.getDecryptedPrivateKey(snapshot.data().bsvAddress.privateKey)
//     }
//   }
// // Decrypt the value
//   getDecryptedPrivateKey(value): string {
//     const key = CryptoJS.enc.Utf8.parse(environment.privateKey);
//     const iv = CryptoJS.enc.Utf8.parse(environment.privateKey);
//     const decrypted = CryptoJS.AES.decrypt(value, key, {
//       keySize: 128 / 8,
//       iv,
//       mode: CryptoJS.mode.CBC,
//       padding: CryptoJS.pad.Pkcs7
//     });
//
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   }
}
