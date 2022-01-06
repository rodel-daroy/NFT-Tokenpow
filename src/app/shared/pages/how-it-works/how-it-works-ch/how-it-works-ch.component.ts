import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '../../../../auth/models/user.model';
import {Subscription} from 'rxjs';
import {AnimationOptions} from 'ngx-lottie';
import {Router} from '@angular/router';
import {AuthService} from '../../../../auth/services/auth.service';

@Component({
  selector: 'app-how-it-works-ch',
  templateUrl: './how-it-works-ch.component.html',
  styleUrls: ['./how-it-works-ch.component.scss']
})
export class HowItWorksChComponent implements OnInit, OnDestroy {

  user: User;
  subs$: Subscription[] = [];

  peopleAnim: AnimationOptions = {
    path: '/assets/animations/people.json'
  };

  ideaAnim: AnimationOptions = {
    path: '/assets/animations/idea.json'
  };

  securityAnim: AnimationOptions = {
    path: '/assets/animations/security.json'
  };

  constructor( private router: Router,
               private authService: AuthService) { }

  ngOnInit(): void {
    this.subs$.push(this.authService.user$.subscribe((user) => this.user = user));
    window.scrollTo(0, 0);
  }

  startGoBitFundMe(): void {
    this.router.navigate(this.user ? ['auction/create'] : ['auth/register'] );
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
