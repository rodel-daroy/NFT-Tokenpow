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
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss']
})
export class CommentDialogComponent implements OnInit, OnDestroy {
  user: User;
  uid: any;
  subs: Subscription[] = [];
  comment: any;
  history: any;
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
    var firstName = this.user.firstName;
    var userId = this.user.uid;
    var paymail = this.user.paymail;
    var commentTime = firebase.firestore.FieldValue.serverTimestamp();
    this.history = {
        firstName: firstName,
        userId: userId,
        paymail: paymail,
        commentTime: commentTime,
        comment: this.comment,
    }
    console.log("comment: ", this.history)
    this.SelltokenService.addComment(this.uid, this.history).then(res => {
        this.ref.close();
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
