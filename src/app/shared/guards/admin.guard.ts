import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/services/auth.service';
import {map, take} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private toastrService: ToastrService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (this.authService
          .checkAuthorization(user, ['admin']).valueOf() === false) {
          this.toastrService.error('Only admin area', 'Error');
           this.router.navigate(['/tokens']);
          return false;
        } else {
          return true;
        }
      })
    );
  }

}
