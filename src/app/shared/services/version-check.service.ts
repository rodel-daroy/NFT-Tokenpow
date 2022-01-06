import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {first} from 'rxjs/operators';
import has = Reflect.has;
import {ToastrService} from 'ngx-toastr';
import {ConfirmationService} from 'primeng/api';
import {WindowService} from '../../auth/services/window.service';

@Injectable()
export class VersionCheckService {

  // current hash of which is generated in version.js
  private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

  constructor(private httpClient: HttpClient,
              private toastrService: ToastrService,
              private windowService: WindowService,
              private confirmationService: ConfirmationService) { }

  /**
   *
   * @param url
   * @param frequency -> in miliseconds, defaults 30 minutes
   */
  public initVersionCheck = (url, frequency = 1000 * 60 * 30) => {
    setInterval(() => {
      this.checkVersion(url);
    }, frequency);
  }

  private checkVersion(url): void {
    this.httpClient.get(`${url}?t=${new Date().getTime()}`)
      .pipe(first())
      .subscribe(
        (response: any) => {
          const hash = response.hash;
          const hashChanged = this.hasHashChanged(this.currentHash, hash);

          if (hashChanged) {
            this.confirmationService.confirm({
              message: 'Version of application changed. Page will be reloaded after confirmation',
              accept: () => {
                location.reload();
              }
            });
          }

          this.currentHash = hash;
        },
        (err) => {
          this.toastrService.error('Could not get version', 'Error');
          console.error(err, 'Could not get version');
        }
      );
  }

  private hasHashChanged(currentHash, newHash): boolean {
    if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
      return false;
    }

    return currentHash !== newHash;
  }
}
