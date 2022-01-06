import {Component, OnDestroy, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {AuthService} from '../../../auth/services/auth.service';
import {Subscription} from 'rxjs';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import * as firebase from 'firebase';

@Component({
  selector: 'app-perk-dialog',
  templateUrl: './perk-dialog.component.html',
  styleUrls: ['./perk-dialog.component.scss']
})
export class PerkDialogComponent implements OnInit, OnDestroy {

  perkCode;
  selltokenUrl;
  user: User;
  subs: Subscription[] = [];
  name;
  email;
  message;
  emailValid = false;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private authService: AuthService,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.perkCode = this.config.data.perkCode;
    this.selltokenUrl = this.config.data.selltokenUrl;
    this.subs.push(this.authService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.name = user.firstName + ' ' + user.lastName;
        this.email = user.email;
        this.emailValid = true;
        this.message = `Dear selltoken owner,

I would like to claim my perk with use of this code "${this.perkCode}",

Kind Regards,
${this.name}`;
      }
    }));

    this.message = `Dear selltoken owner,

I would like to claim my perk with use of this code "${this.perkCode}",

Kind Regards `;
  }


  sendInfo(): void {
    const info = {
      name: this.name,
      email: this.email,
      perkCode: this.perkCode,
      selltokenUrl: this.selltokenUrl,
      message: `From: ${this.name}
Email: ${this.email}

${this.message}`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if (this.name && this.email && this.message) {
      this.ref.close(info);
    }
    else {
      this.toastrService.error('Invalid form');
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
