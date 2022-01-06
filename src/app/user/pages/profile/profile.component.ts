import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User;
  isselltokensSection = false;
  subs: Subscription[] = [];

  constructor(public authService: AuthService,
              private router: Router) {
    this.isselltokensSection = window.location.href.includes('/user/selltokens');
  }

  ngOnInit(): void {
    this.subs.push(this.authService.user$.subscribe(res => this.user = res));
    this.subs.push(this.router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        this.isselltokensSection = res.url === '/user/selltokens';
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
