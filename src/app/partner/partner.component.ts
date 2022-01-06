import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/services/auth.service';
import { User } from 'src/app/auth/models/user.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrls: ['./partner.component.scss']
})
export class PartnerComponent implements OnInit, OnDestroy {

  user: User;
  subs: Subscription[] = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.authService.user$.subscribe(res => {
      this.user = res;
      console.log("userPartner: ", this.user)
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
