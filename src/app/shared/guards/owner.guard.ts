import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {GuardService} from '../services/guard.service';
import {ISelltoken} from '../../selltokens/models/selltoken.model';
import {AuthService} from '../../auth/services/auth.service';
import {mergeMap, switchMap, take} from 'rxjs/operators';
import {User} from '../../auth/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class OwnerGuard implements CanActivate {
  selltoken: ISelltoken;
  user: User;

  constructor(private guardService: GuardService,
              private afAuth: AuthService,
              private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    this
      .afAuth
      .user$
      .pipe(
        switchMap(user => {
          this.user = user;
          return this.guardService.getSingleselltoken(route.queryParams.id);
        })
      ).subscribe(selltoken => {
       return selltoken.userId === this.user.uid;
    });
    return of(false);
  }

}
