import {Component, OnInit,HostListener, ElementRef, ViewChild} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie';
import {IpAddressService} from '../../services/ip-address.service';
import {environment} from '../../../../environments/environment';
import {catchError, switchMap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {User} from '../../../auth/models/user.model';
import {AppStateService} from '../../services/app-state.service';
import {Router} from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {LoginComponent} from '../../../auth/components/login/login.component'
import { SelltokenService } from 'src/app/selltokens/services/selltoken.service';

var comp;
//var isShowModal;
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  @ViewChild('modalcomp') modal:ElementRef;
  items: MenuItem[];
  countryCode: string;
  subs$: Subscription[] = [];
  user: User;
  isShowModal;
  isShowMenu1;
  isShowMenu2;
  isShowMenu3;
  isShowMenu4;
  isShowMenu5;

  constructor(public authService: AuthService,
              private cookieService: CookieService,
              private ipService: IpAddressService,
              private selltokenService: SelltokenService,
              private router: Router,
              private dialogService: DialogService,
              public translateService: TranslateService,
              private stateService: AppStateService) {}


  ngOnInit(): void {
    this.isShowModal = false;
    this.isShowMenu1 = false;
    this.isShowMenu2 = false;
    this.isShowMenu3 = false;
    this.isShowMenu4 = false;
    this.isShowMenu5 = false;
    this.authService.user$.subscribe(user => {
          this.stateService.changeState('normal');
          this.user = user;
          console.log('user =====>', this.user);
          if (user && user.preferredLanguage) {
            this.countryCode = user.preferredLanguage.code.toLowerCase();
            this.translateService.use(user.preferredLanguage.code.toLowerCase());
            setTimeout(() => {
              this.getMenuItems(user);
            }, 100);
          }
          else {
            setTimeout(() => {
              this.getMenuItems(user);
            }, 100);
          }
      });

    this.authService.setShell(this);
  }

  ngAfterViewInit() {
    console.log('test =====>' , this.modal);
    comp = this;
    // modal = this.modal.nativeElement;
    // isShowModal = this.isShowModal;
    window.onclick = function(event) {
      console.log('onclick =====>');
      if (event.target ===  comp.modal.nativeElement) {
        // modal.style.display = "none";
        comp.isShowModal = false;
      }
    };
  }

  getLabel(language: string): string {
    switch (language) {
      case 'en':
        return `<div class="navbar-language">
                  <img src="assets/flags/united-kingdom-flag-round-medium.png" class="country-flag" alt="country flag"/>
                  <span>EN</span>
                </div>`;
      case 'es':
        return `<div class="navbar-language">
                  <img src="assets/flags/spain-flag-round-medium.png" class="country-flag" alt="country flag"/>
                  <span>ES</span>
                </div>`;
      case 'ch':
        return `<div class="navbar-language">
                  <img src="assets/flags/switzerland-flag-round-medium.png" class="country-flag" alt="country flag"/>
                  <span>CH</span>
                </div>`;
      case 'sk':
        return `<div class="navbar-language">
                <img src="assets/flags/slovakia-flag-round-medium.png" class="country-flag" alt="country flag"/>
                <span>SK</span>
              </div>`;
      case 'ro':
        return `<div class="navbar-language">
                <img src="assets/flags/romania-flag-round-medium.png" class="country-flag" alt="country flag"/>
                <span>RO</span>
              </div>`;
    }
  }

  getLanguages(): {label: string, escape: boolean, command: any}[] {

    return [
      {
        label: `<div class="navbar-language">
                        <img src="assets/flags/united-kingdom-flag-round-medium.png" class="country-flag" alt="country flag"/>
                        <span>EN</span>
                        </div>`,
        escape: false,
        command: () => {
          this.items[this.items.length - 1].label = this.getLabel('en');
          this.translateService.use('en');
          this.countryCode = 'en';
          setTimeout(() => {
            this.getMenuItems(this.user);
          }, 100);
        }
      },
      {
        label: `<div class="navbar-language">
                        <img src="assets/flags/spain-flag-round-medium.png" class="country-flag" alt="country flag"/>
                        <span>ES</span>
                        </div>`,
        escape: false,
        command: () => {
          this.items[this.items.length - 1].label = this.getLabel('es');
          this.translateService.use('es');
          this.countryCode = 'es';
          setTimeout(() => {
            this.getMenuItems(this.user);
          }, 100);
        }
      },
      {
        label: `<div class="navbar-language">
                        <img src="assets/flags/switzerland-flag-round-medium.png" class="country-flag" alt="country flag"/>
                        <span>CH</span>
                        </div>`,
        escape: false,
        command: () => {
          this.items[this.items.length - 1].label = this.getLabel('ch');
          this.translateService.use('ch');
          this.countryCode = 'ch';
          setTimeout(() => {
            this.getMenuItems(this.user);
          }, 100);
        }
      },
      {
        label: `<div class="navbar-language">
                        <img src="assets/flags/slovakia-flag-round-medium.png" class="country-flag" alt="country flag"/>
                        <span>SK</span>
                        </div>`,
        escape: false,
        command: () => {
          this.items[this.items.length - 1].label = this.getLabel('sk');
          this.translateService.use('sk');
          this.countryCode = 'sk';
          setTimeout(() => {
            this.getMenuItems(this.user);
          }, 100);
        }
      },
      {
        label: `<div class="navbar-language">
                        <img src="assets/flags/romania-flag-round-medium.png" class="country-flag" alt="country flag"/>
                        <span>RO</span>
                        </div>`,
        escape: false,
        command: () => {
          this.items[this.items.length - 1].label = this.getLabel('ro');
          this.translateService.use('ro');
          this.countryCode = 'ro';
          setTimeout(() => {
            this.getMenuItems(this.user);
          }, 100);
        }
      }
    ];
  }

  getMenuItems(user): any[] {
    if (user?.roles?.admin) {
      return this.items =  [
        {
          label: this.translateService.instant('shared.shell.selltokens'),
          routerLink: '/auction'
        },
        {
          label: this.translateService.instant('My Auctions'),
          escape: false,
          items: [
            {
              label: this.translateService.instant('Sell side '),
              routerLink: '/user/myauctions'
            },
            {
              label: this.translateService.instant("Buy side "),
              routerLink: '/user/mybuys'
            },
          ],
        },
        {
          label: this.translateService.instant('My Assets'),
          escape: false,
          items: [
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> Token</span>',
              escape: false,
              routerLink: '/rtasset/myownedassets'
              /*
              items: [
                {
                  label: 'My Assets',
                  routerLink: '/rtasset/myassets'
                },
                {
                  label: 'Owned Assets',
                  routerLink: '/rtasset/myownedassets'
                },
              ],
              */
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> NFT </span>',
              escape: false,
              routerLink: '/runnft/myassets'
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="moneybutton" style="width:1.25rem" src="assets/mb_logo.png"> </span>',
              escape: false,
              items: [
                {
                  label: 'My Assets',
                  routerLink: '/mbasset/myassets'
                },
                {
                  label: 'Owned Assets',
                  routerLink: '/mbasset/myownedassets'
                },
              ],
            },
          ],
        },
        {
          label: this.translateService.instant('Create'),
          escape: false,
          items: [
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> NFT </span>',
              escape: false,
              routerLink: '/runnft/create',
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> Token</span>',
              escape: false,
              routerLink: '/rtasset/create'
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="moneybutton" style="width:1.25rem" src="assets/mb_logo.png"> </span>',
              routerLink: '/mbasset/create',
              escape: false,

            },
          ],
        },
        {
          label: '<span class="d-flex align-items-center"><img class="avatar" src="' + user.photoUrl + '"> ' + user.firstName + '</span>',
          escape: false,
          items: [
            {
              label: this.translateService.instant('shared.shell.my-profile'),
              routerLink: 'profile'
            },
            {
              label: this.translateService.instant('shared.shell.my-wallet'),
              routerLink: '/user/withdrawals'
            },
            {
              label: this.translateService.instant('shared.shell.logout'),
              command: () => {
                this.authService.signOut();
              }
            }
          ]
        },
        {
          label: this.translateService.instant('shared.shell.admin'),
          items: [
            {
              label: this.translateService.instant('shared.shell.selltokens-overview'),
              routerLink: 'admin/selltoken-list'
            }
          ]
        }
      ];
    } else if (user?.roles?.client) {
      return this.items =  [
        {
          label: this.translateService.instant('My Auctions'),
          escape: false,
          items: [
            {
              label: this.translateService.instant('Sell Auctions'),
              routerLink: '/user/myauctions'
            },
            {
              label: this.translateService.instant("Buy Auctions"),
              routerLink: '/user/mybuys'
            },
          ],
        },
        {
          label: this.translateService.instant('My Assets'),
          escape: false,
          items: [
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> NFT </span>',
              escape: false,
              routerLink: '/runnft/myassets'
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> Token</span>',
              escape: false,
              routerLink: '/rtasset/myownedassets'
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="moneybutton" style="width:1.25rem" src="assets/mb_logo.png"> </span>',
              escape: false,
              items: [
                {
                  label: 'My Assets',
                  routerLink: '/mbasset/myassets'
                },
                {
                  label: 'Owned Assets',
                  routerLink: '/mbasset/myownedassets'
                },
              ],
            },
          ],
        },
        {
          label: this.translateService.instant('Create'),
          escape: false,
          items: [
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> NFT </span>',
              routerLink: '/runnft/create',
              escape: false,
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="runlogo mr-1" style="width:1.25rem" src="assets/run_logo.png"> Token</span>',
              escape: false,
              routerLink: '/rtasset/create'
            },
            {
              label:  '<span class="d-flex align-items-center"><img class="moneybutton" style="width:1.25rem" src="assets/mb_logo.png"> </span>',
              routerLink: '/mbasset/create',
              escape: false,
            },
          ],
        },
        {
          label: '<span class="d-flex align-items-center"><img class="avatar" src="' + user.photoUrl + '"> ' + user.firstName + '</span>',
          escape: false,
          items: [
            {
              label: this.translateService.instant('shared.shell.my-profile'),
              routerLink: '/profile'
            },
            {
              label: this.translateService.instant('shared.shell.my-wallet'),
              routerLink: '/user/withdrawals'
            },
            {
              label: this.translateService.instant('shared.shell.logout'),
              command: () => {
                this.authService.signOut();
              }
            }
          ]
        }
      ];
    } else {
      return this.items =  [
        {
          label: this.translateService.instant('shared.shell.login'),
          routerLink: '/auth/login'
        }
      ];
    }
  }

  @HostListener('window:onclick.control', ['$event'])
  ClickControl(event: MouseEvent) {
    console.log("Mouse Event", event);
  }

  closeBox(){
    this.isShowModal = false;
  }
  actionLogin(){
    this.isShowModal = true;
    //this.router.navigate(['/auth/login']);
    //show dialog
    /*const ref = this.dialogService.open(LoginComponent, {
      header: 'Login',
      baseZIndex: 10,
      style: {
        background: 'white'
      },
      data: {
      }
    });*/
  }

  actionShowMenu() {
    this.isShowMenu1 = !this.isShowMenu1;
    this.isShowMenu2 = false;
    this.isShowMenu3 = false;
    this.isShowMenu4 = false;
    this.isShowMenu5 = false;
  }
  actionShowMenu2() {
    this.isShowMenu2 = !this.isShowMenu2;
    this.isShowMenu1 = false;
    this.isShowMenu3 = false;
    this.isShowMenu4 = false;
    this.isShowMenu5 = false;
  }
  actionShowMenu3() {
    this.isShowMenu3 = !this.isShowMenu3;
    this.isShowMenu1 = false;
    this.isShowMenu2 = false;
    this.isShowMenu4 = false;
    this.isShowMenu5 = false;
  }
  actionShowMenu4() {
    this.isShowMenu4 = !this.isShowMenu4;
    this.isShowMenu1 = false;
    this.isShowMenu2 = false;
    this.isShowMenu3 = false;
    this.isShowMenu5 = false;
  }
  actionShowMenu5() {
    this.isShowMenu5 = !this.isShowMenu5;
    this.isShowMenu1 = false;
    this.isShowMenu2 = false;
    this.isShowMenu3 = false;
    this.isShowMenu4 = false;
  }

  loginWithMoneyButton():void {
     this.authService.moneyButtonSignIn();
  }
  onLogInWithGoogleButtonClicked(): void {
    this.authService.googleSignIn().then(() => this.isShowModal = false);
  }
  signOut() {
    this.authService.signOut();
  }

  updateSelltoken() {
    this.selltokenService.updateSelltokenCollection();
  }

  manageCollectionsBtn() {
    this.isShowMenu1 = false;
    this.isShowMenu2 = false;
    this.isShowMenu3 = false;
    this.isShowMenu4 = false;
    this.isShowMenu5 = false;
  }
}
