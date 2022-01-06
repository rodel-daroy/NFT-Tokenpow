import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '../../../auth/services/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../../../auth/models/user.model';
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase';
import {SelltokenService} from '../../services/selltoken.service';
import { AppStateService } from '../../../shared/services/app-state.service';
import { CryptoService } from '../../../shared/services/crypto.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrls: ['./offer-dialog.component.scss']
})
export class OfferDialogComponent implements OnInit, OnDestroy {
  offerValue: number;
  uid: string;
  notifications: any;
  history: any
  user: User;
  subs: Subscription[] = [];
  outputs: any;
  clientId = environment.moneyButton.client_id;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private stateService: AppStateService,
              private authService: AuthService,
              private cryptoService: CryptoService,
              private SelltokenService: SelltokenService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    console.log("data: ", this.config.data)
    this.uid = this.config.data.uid
    this.notifications = this.config.data.notifications

    this.outputs = [
      {
        to: 'tokenpow@moneybutton.com',
        amount: 0.005,
        currency: 'USD'
      },
      {
        to: this.config.data.owner_mb,
        amount: 0.005,
        currency: 'USD'
      }
    ];

    this.subs.push(this.authService.user$.subscribe(user => {
        if (user) {
          this.user = user;
        }
    }))
  }

  confirm() {
        var sender = this.user.firstName;
        var senderUid = this.user.uid;
        var paymail = this.user.paymail;
        var offerTime = firebase.firestore.FieldValue.serverTimestamp();
        var price = this.offerValue;
        this.history = {
            sender: sender,
            senderUid: senderUid,
            paymail: paymail,
            offerTime: offerTime,
            price: price,
        }
        console.log("collectionId: ", this.config.data.collection_id)
        if (this.config.data.collection_id) {
          this.SelltokenService.updateNotificationForCollection(this.config.data.collection_id, this.notifications).then(res => {
            console.log("updateNotiforCollection", res)
          })
        }

      this.SelltokenService.updateNotification(this.uid, this.notifications).then(noti => {
        console.log("noti res: ", noti)
        this.SelltokenService.addOfferHistory(this.uid, this.history).then(res => {
          console.log("resOffer: ", res)
          this.ref.close();
        })
      })
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async onPaymentSuccess(event): Promise<void> {
    console.log('Payment succesful', event);
    this.confirm();
  }

  async onPaymentError(event): Promise<void> {
    console.log('Payment failed', event);
  }
}
