import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {User} from '../models/user.model';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {catchError, map, switchMap, take, tap} from 'rxjs/operators';
import {auth} from 'firebase/app';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie';
import {UserProfile} from '../models/user-profile.model';
import {environment} from '../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../shared/services/app-state.service';
import * as firebase from 'firebase/app';
import {CryptoService} from '../../shared/services/crypto.service';
import {OauthTokenResponse} from '../models/oauth-token-response.model';
import {UserIdentity} from '../models/user-identity.model';
import {DialogService} from 'primeng/dynamicdialog';
import {AskForPasswordDialogComponent} from '../components/ask-for-password-dialog/ask-for-password-dialog.component';
import {ResetPasswordDialogComponent} from '../components/reset-password-dialog/reset-password-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import { response } from 'express';
import { ShellComponent } from 'src/app/shared/components/shell/shell.component';

@Injectable({providedIn: 'root'})
export class AuthService {
  user$: Observable<User>;
  userProfile : UserProfile;
  moneyButtonRefreshToken: String;
  serverTimeDiff: number;
  shell: ShellComponent;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private toastrService: ToastrService,
    private stateService: AppStateService,
    private cryptoService: CryptoService,
    private translateService: TranslateService,
    @Inject(DialogService) private dialogService: DialogService,
  ) {
    this.user$ = this.afAuth.authState
      .pipe(
        switchMap(user => {
          if (user) {
            return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
          } else {
            return of(null);
          }
        })
      );
  }

  setShell( shell:ShellComponent)
  {
    this.shell = shell;
  }

  getShell():ShellComponent{
    return this.shell;
  }

  getServerTime(): Promise<object>{
    if (!this.serverTimeDiff)
    {
      return  new Promise((resolve, reject) => {
        this
        .httpClient
        .get
        (`${environment.apiUrl}/auth/getservertime`).toPromise().then(
          (res) =>{ 
            var serverTime = res['millionseconds'] ;
            var now = Date.now();
            this.serverTimeDiff = serverTime-now;
            resolve(res);
          }
        ).catch(
          (res) => {
            reject(res);
          }
        )
      });
    }else
    { 
      return new Promise((resolve,reject) => {
        var now = Date.now();
        var result = {};
        result['millionseconds'] = now + this.serverTimeDiff;
        resolve(result);
      });
    }
  }

  async googleSignIn(): Promise<void> {
    const provider = new auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    this.afs.doc(`users/${credential.user.uid}`).get().subscribe(async (res) => {
      if (res.data()) {
        const user = await this.afAuth.currentUser;
        this.updateUserLastLoggedIn(user.uid, user.metadata.lastSignInTime);
      }
      else {
        this.createUser(credential.user);
      }
    })
    // await this.checkIfUserIsAlreadyRegistered(credential.user.email)
    //   .then(async (res) => {
    //     if (!res.includes('password')) {
    //       // const currentUser  = await this.afAuth.currentUser;
    //       // await currentUser.delete();
    //       // this.toastrService.error(this.translateService.instant('auth.service.sorry-user-was-not-found-please-register'));
    //       // await this.router.navigate(['auth/register']);
    //       // return Promise.reject();
    //       this.createUser(credential.user)
    //     } else {
    //       const user = await this.afAuth.currentUser;
    //       this.updateUserLastLoggedIn(user.uid, user.metadata.lastSignInTime);
    //       // this.router.navigate(['/tokens']);
    //     }
    //   });
  }

  async facebookSignIn(): Promise<void> {
      const credential = await this.afAuth.signInWithPopup(new auth.FacebookAuthProvider())
        .then(creds => {
          this.checkIfUserIsAlreadyRegistered(creds.user.email)
            .then(async (res) => {
              if (!res.includes('password')) {
                const currentUser  = await this.afAuth.currentUser;
                await currentUser.delete();
                this.toastrService.error(this.translateService.instant('auth.service.sorry-user-was-not-found-please-register'));
                await this.router.navigate(['auth/register']);
                return Promise.reject();
              } else {
                const user = await this.afAuth.currentUser;
                this.updateUserLastLoggedIn(user.uid, user.metadata.lastSignInTime);
                 this.router.navigate(['/tokens']);
              }
            });
        })
        .catch(error => {
          console.log(error);
          if (error.code === 'auth/account-exists-with-different-credential') {
            const pendingCredential = error.credential;
            const email = error.email;

            this.afAuth.fetchSignInMethodsForEmail(email).then(async (methods: string[]) => {
              if (methods.includes('password')) {
                const ref = this.dialogService.open(AskForPasswordDialogComponent, {
                  header: this.translateService.instant('auth.service.this-email-is-already-linked-with-email-provider-please-type-your-password-for-email') + ': ' + email + ' ' + this.translateService.instant('auth.service.to-link-facebook-account-to-this-email'),
                  width: 'auto',
                  styleClass: 'password-dialog-input'
                });

                ref.onClose.subscribe((password) => {
                  if (password) {
                    this.afAuth.signInWithEmailAndPassword(email, password)
                      .then(result => {
                        this.toastrService.success(this.translateService.instant('auth.service.facebook-account-was-successfully-linked-with-your-email'));
                        return result.user.linkWithCredential(pendingCredential);
                      })
                      .then(() => {
                         this.router.navigate(['/tokens']);
                      });
                  }
                });
              }
            });
          }
        });

  }

  moneyButtonCheckCredentials(): boolean {
    return this.cookieService.hasKey('access_token') && this.cookieService.hasKey('user_id');
  }

  moneyButtonSignIn(): void {
    console.log('debug star!');
    //window.location.href = `https://www.moneybutton.com/oauth/v1/authorize?response_type=code&client_id=${environment.moneyButton.oauth_identifier}&redirect_uri=${environment.moneyButton.redirect_uri}&scope=auth.user_identity:read%20users.profiles:read%20users.balance:read&state=somerandomgeneratedstring`;
    window.location.href = `https://www.moneybutton.com/oauth/v1/authorize?response_type=code&client_id=${environment.moneyButton.oauth_identifier}&redirect_uri=${environment.moneyButton.redirect_uri}&scope=auth.user_identity:read%20users.profiles:read%20users.balance:read%20users.asset:write%20users.asset:read&state=somerandomgeneratedstring`;
  }

  moneyButtonSaveToken(response: OauthTokenResponse): void {
    this.cookieService.put('access_token', response.access_token.toString(), {
      expires: response.expires_in.toString()
    });
    this.cookieService.put('refresh_token', response.refresh_token.toString());

    this.router.navigate(['/']);
  }

  moneyButtonGetToken(): string{
    //let current_access_token = this.cookieService.get('access_token');
    return "";
  }
  async getNewMoneyButtonToken(): Promise<any> 
  {
    this.moneyButtonRefreshToken =  this.cookieService.get('refresh_token');
    const body = `grant_type=refresh_token&client_id=${environment.moneyButton.oauth_identifier}&refresh_token=${this.moneyButtonRefreshToken}`;
    
    return this.httpClient.post('https://www.moneybutton.com/oauth/v1/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).toPromise();
  }
  async moneyButtonRetrieveToken(code): Promise<void> {
    console.log("log here");
    this.cookieService.put('auth_code', code);
    const body = `grant_type=authorization_code&client_id=${environment.moneyButton.oauth_identifier}&code=${code}&redirect_uri=${environment.moneyButton.redirect_uri}`;
  
    this.httpClient.post('https://www.moneybutton.com/oauth/v1/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .pipe(
        map((res: OauthTokenResponse) => {
          res.expires_in = new Date().getTime() + (1000 * res.expires_in);
          return res;
        }),
      ).subscribe((response) => {
      this.moneyButtonSaveToken(response);
  
      this.moneyButtonGetUserIdentity(response.access_token).pipe(
        switchMap((userIdentity: UserIdentity) => {
          this.cookieService.put('user_id', userIdentity.data.id);
          return this.moneyButtonGetUserProfile(response.access_token, userIdentity.data.id).pipe(take(1));
        }),
        map((user: any) => {
          return {
            attributes: {
              name: user.data.attributes.name,
              primaryPaymail: user.data.attributes['primary-paymail']
            },
            id: user.data.id,
          } as UserProfile;
        })
      ).pipe(
        tap((userProfile: UserProfile) => {
          this.userProfile = userProfile;
        })
        // switchMap((userProfile: UserProfile) => {
        //   this.userProfile = userProfile;
        //   return this.afs.collection('users', ref => {
        //     return ref
        //       .where('email', '==', userProfile.attributes.primaryPaymail);
        //   }).get();
        // })
      ).subscribe(async (snap) => {
          console.log(snap);
          this.afs.firestore.doc('/users/' + this.userProfile.id).get()
          .then(docSnapshot => {
            if (!docSnapshot.exists) {
              this.generateAddressForUser().toPromise().then(res1 => {
                this.generateAddressForUser().toPromise().then(res2 => {
                  const bsvAddress: any = {};
                  bsvAddress.address = res1.address;
                  bsvAddress.publicKey = res1.publicKey;
                  bsvAddress.privateKey = this.cryptoService.set(res1.privateKey);
                  const assetAddress:any = {};
                  assetAddress.address = res2.address;
                  assetAddress.publicKey = res2.publicKey;
                  assetAddress.privateKey = this.cryptoService.set(res2.privateKey);

                  this.moneyButtonRefreshToken = response.refresh_token;
                  this.afs.collection('users').doc(this.userProfile.id).set({
                    uid: this.userProfile.id,
                    moneyButtonLogin: true,
                    roles: {client: true},
                    refreshToken: response.refresh_token,
                    photoUrl: 'assets/account.png',
                    bsvAddress,
                    assetAddress,
                    paymail: this.userProfile.attributes.primaryPaymail,
                    firstName: this.userProfile.attributes.name.split(' ')[0],
                    lastName: this.userProfile.attributes.name.split(' ')[1] ? this.userProfile.attributes.name.split(' ')[1] : '',
                    isAnonymous: false,
                  } as User).then((value) => {
                    this.moneyButtonLoginTry();
                  }
        
                  ).catch((err) => {
                    // this.toastrService.error(err, 'Error');
                    // console.log(err);
                  });
                });
              });
            }
            else{
              this.moneyButtonLoginTry();
            }
          });
         
          //this.addEmailToExisting(this.userProfile.attributes.primaryPaymail);
         
        
        });
      });
    }
    async moneyButtonLoginTry():Promise<void> {
            //`${environment.apiUrl}/auth/generate-verification-email`
      await this.httpClient.get(`${environment.apiUrl}/auth/oauth-callback`, {
        headers: {
          uid: this.userProfile.id
        }
      })
        .subscribe((res: {token: string}) => {
          this.cookieService.put('firebase_token', res.token);
          this.afAuth.signInWithCustomToken(res.token).then(credential => {
            this.user$ = this.afs.doc<User>(`users/${credential.user.uid}`).valueChanges();
          }).catch((err) => {
            console.log(err);
            this.toastrService.error(err, 'Error');
          });
        });
    }
  moneyButtonGetUserIdentity(token): Observable < any > {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token
      });
      // Need to pass bearer token with request
      return this.httpClient.get<any>('https://www.moneybutton.com/api/v1/auth/user_identity', {
        headers
      })
        .pipe(
          catchError(err => {
            this.toastrService.error(err, 'Error');
            return throwError(err);
          }),
        );
    }
  
   moneyButtonGetUserProfile(token, userId): Observable <any> {
      const headers = new HttpHeaders({
        Authorization: 'Bearer ' + token
      });
      // Need to pass bearer token  and userId with request
      return this.httpClient.get<any>(`https://www.moneybutton.com/api/v1/users/${userId}/profile`, {
        headers
      })
        .pipe(
          catchError(err => {
            this.toastrService.error(err, 'Error');
            return throwError(err);
          }),
        );
    }

  async createUser(user): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
    console.log('USER', user);
    let displayName: string[] = [];
    if (this.cookieService.get('firstName')) {
      displayName.push(this.cookieService.get('firstName'));
      displayName.push(this.cookieService.get('lastName'));
    } else {
      displayName = user.displayName ? user.displayName.split(' ') : '';
    }
    const data = {
      uid: this.isNotUndefined(user.uid),
      email: this.isNotUndefined(user.email),
      createdAt: this.isNotUndefined(user.metadata.creationTime),
      firstName: displayName[0] ? displayName[0] : '',
      lastName: displayName[1] ? displayName[1] : '',
      roles: {client: true},
      photoUrl: user.photoURL ? user.photoURL : 'assets/account.png',
      totalCoins: 1,
      favoritesselltokens: [],
      phoneNumber: this.cookieService.get('phoneNumber') ?
        this.cookieService.get('phoneNumber') :
        ''
    } as User;

    this.generateAddressForUser().toPromise().then(res => {
      this.generateAddressForUser().toPromise().then(res2 => {
        data.bsvAddress = {};
        data.bsvAddress.address = this.isNotUndefined(res.address);
        data.bsvAddress.publicKey = this.isNotUndefined(res.publicKey);
        data.bsvAddress.privateKey = this.cryptoService.set(this.isNotUndefined(res.privateKey));
        data.assetAddress = {};
        data.assetAddress.address = res2.address;
        data.assetAddress.publicKey = res2.publicKey;
        data.assetAddress.privateKey = this.cryptoService.set(res2.privateKey);
        return userRef.set(data, {merge: true});
      })
    }).catch(err => {
      console.log(err);
      this.toastrService.error('Something went wrong');
    });
  }


  linkUserWithMoneyButton(moneyButtonEmail: string, currentUser: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${currentUser.uid}`);
    const uid = moneyButtonEmail.split('@')[0];
    const user = {
      ...currentUser,
      moneyButtonEmail,
      moneyButtonLogin: true,
      moneyButtonUid: uid
    };

    return userRef.set(user, {merge: true});
  }

  async sendEmailLink(email, registering: boolean): Promise<void> {
    const actionCodeSettings = {
      // Redirect URL
      url: `${environment.baseUrl}/auth/login`,
      handleCodeInApp: true
    };
    if (!registering) {
      await this.checkIfUserIsAlreadyRegistered(email).then((res) => {
          if (res.includes('emailLink')) {
            try {
              this.toastrService.success('Email to sign in was send. Please check your inbox', 'Email send');
              this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings);
              this.cookieService.put('emailForSignIn', email);
            } catch (err) {
              return err;
            }
          } else {
            this.toastrService.success('Sorry user with this email was not found, please Sign Up', 'Not found');
            this.router.navigate(['/auth/register']);
            return;
          }
        });
    }

    if (registering === true) {
      try {
        this.toastrService.success('Email to sign in was send. Please check your inbox', 'Email send');
        await this.afAuth.sendSignInLinkToEmail(email, actionCodeSettings);
        this.cookieService.put('emailForSignIn', email);
      } catch (err) {
        return err;
      }
    }
  }

  async registerUser(email, password): Promise<void> {
    const actionCodeSettings = {
      // Redirect URL
      url: `${environment.baseUrl}/auth/login`,
      handleCodeInApp: true
    };
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password).then((user) => {
        this.createUser(user.user);
        user.user.sendEmailVerification(actionCodeSettings).then(res => {
          this.toastrService.success(this.translateService.instant('auth.service.verification-email-has-been-sent'));
          this.afAuth.signOut();
        });
      }).catch(err => this.toastrService.error(err));
  } catch (err) {
      this.toastrService.error(err);
    }
  }

  async loginUser(email, password): Promise<void> {
    try {
      await this.checkIfUserIsAlreadyRegistered(email).then((res) => {
        if (res.includes('password')) {
          try {
            this.afAuth.signInWithEmailAndPassword(email, password).then((user) => {
              if (user.user.emailVerified === false) {
                this.afAuth.signOut();
                throw new Error(this.translateService.instant('auth.service.user-email-has-not-been-verified-yet-to-log-in-please-verify-your-email'));
              }
              else {
                this.updateUserLastLoggedIn(user.user.uid, user.user.metadata.lastSignInTime).then(res => {
                   this.router.navigate(['/tokens']);
                }).catch(err => {
                  this.toastrService.error('Something went wrong, please contact GoBitFundMe team', 'Error');
                  this.afAuth.signOut();
                });
              }
            }).catch(err => this.toastrService.error(err));
          } catch (err) {
            this.toastrService.error(err);
          }
        } else {
          this.toastrService.error(this.translateService.instant('auth.service.sorry-user-with-this-email-was-not-found-please-sign-up'));
          this.router.navigate(['/auth/register']);
          return;
        }
      });
    } catch (err) {
      this.toastrService.error(err);
    }
  }

  sendNewVerificationEmail(): void {
    const ref = this.dialogService.open(ResetPasswordDialogComponent, {
      header: this.translateService.instant('auth.service.insert-your-email'),
      width: 'auto',
      styleClass: 'password-dialog-input'
    });

    ref.onClose.subscribe((email) => {
      if (email) {
        this.httpClient.post(`${environment.apiUrl}/auth/generate-verification-email`,
        {
                email
              }
          ).subscribe(res => {
            console.log(res);
            this.toastrService.success(this.translateService.instant('auth.service.verification-email-has-been-sent'));
        });
      }
    });

  }

  async resetPassword(): Promise<void> {
    const ref = this.dialogService.open(ResetPasswordDialogComponent, {
      header: this.translateService.instant('auth.service.forgot-your-password-insert-your-email'),
      width: 'auto',
      styleClass: 'password-dialog-input'
    });

    ref.onClose.subscribe((email) => {
      if (email) {
        this.afAuth.sendPasswordResetEmail(email, {
          url: 'https://gobitfundme.com/auth/login',
          handleCodeInApp: false
        })
          .then(res => {
            this.toastrService.success(this.translateService.instant('auth.service.password-reset-email-has-been-sent-please-check-your-email'));
          })
          .catch(err => this.toastrService.error(err));
      }
    });
  }

  async confirmSignIn(url): Promise<void> {
    try {
      if (await this.afAuth.isSignInWithEmailLink(url)) {
        let email = this.cookieService.get('emailForSignIn');
        console.log('EMAIL JE: ', email);
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }

        this.afAuth.signInWithEmailLink(email, url)
          .then(user => {
            console.log('RESULT OF SIGN IN WITH EMAIL LINK: ', user);
            this.createUser(user.user)
              .then(() => {
              });
             this.router.navigate(['/tokens']);
          })
          .catch(err => {
          this.toastrService.error(err, 'Error');
        });
      }
    } catch (err) {
      this.toastrService.error(err, 'Error');
      return err;
    }
  }

  async signOut(): Promise<void> {
      await this.afAuth.signOut();
      this.cookieService.remove('access_token');
      this.cookieService.remove('refresh_token');
      this.cookieService.remove('auth_code');
      this.cookieService.remove('firebase_token');
      this.cookieService.remove('user_id');
      this.cookieService.remove('phoneNumber');
      this.cookieService.remove('firstName');
      this.cookieService.remove('lastName');
      this.cookieService.remove('emailForSignIn');
      this.toastrService.success(this.translateService.instant('auth.service.you-were-successfully-signet-out'));
      await this.router.navigate(['/']);
  }

  canRead(user: User): boolean {
    const allowed = ['admin', 'client', 'readonly'];
    return this.checkAuthorization(user, allowed);
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'client'];
    return this.checkAuthorization(user, allowed);
  }

  canDelete(user: User): boolean {
    const allowed = ['admin'];
    return this.checkAuthorization(user, allowed);
  }

  checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) { return false; }
    for (const role of allowedRoles) {
      if ( user.roles[role] === true ) {
        return true;
      }
    }
    return false;
  }

  checkIfUserIsAlreadyRegistered(email: string): Promise<string[]> {
    console.log('EMAIL: ', email);
    return this.afAuth.fetchSignInMethodsForEmail(email);
  }

  checkIfPhoneAlreadyExists(): Observable<any> {
    return this.afs
      .doc('metadata/registeredPhoneNumbers')
      .get();
  }

  async addPhoneNumberToExisting(phoneNumber: string): Promise<void> {
    const currentDocument = await this.afs.doc('metadata/registeredPhoneNumbers').get().toPromise();
    const currentNumbers: string[] = currentDocument.data()["numbers"];
    currentNumbers.push(phoneNumber);
    await this.afs.doc('metadata/registeredPhoneNumbers').set({numbers: currentNumbers}, {merge: true});
  }

  async addEmailToExisting(email: string): Promise<void> {
    const currentDocument = await this.afs.doc('metadata/registeredEmails').get().toPromise();
    const currentEmails: string[] = currentDocument.data()["emails"];
    currentEmails.push(email);
    await this.afs.doc('metadata/registeredEmails').set({emails: currentEmails}, {merge: true});
  }

  isNotUndefined(param): any {
    return param ? param : '';
  }

  generateAddressForUser(): Observable<{privateKey: string, publicKey: string, address: string }> {
    return this
      .httpClient
      .get<{privateKey: string, publicKey: string, address: string }>
      (`${environment.apiUrl}/bsv/generate-keys`);
  }

  getKeys(): Observable<{privateKey: string, publicKey: string, address: string }> {
    return this
      .httpClient
      .get<{privateKey: string, publicKey: string, address: string }>
      (`${environment.apiUrl}/bsv/get-keys`);
  }


  async updateUserLastLoggedIn(uid, lastLoggedIn): Promise<void> {
    await this.afs.doc(`users/${uid}`).update( {lastLoggedIn});
  }
}
