import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {Observable, of, Subscription} from 'rxjs';
import {finalize, switchMap, tap} from 'rxjs/operators';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from '../../services/user.service';
import {ToastrService} from 'ngx-toastr';
import {CookieService} from 'ngx-cookie';
import {AppStateService} from '../../../shared/services/app-state.service';
import {TranslateService} from '@ngx-translate/core';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';

interface Language {
  name: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit, OnDestroy {

  user: User = {};
  subs$: Subscription[] = [];
  languages: Language[];
  countries = [];

  task: AngularFireUploadTask;
  percentage: Observable<number>;
  downloadURL: string;
  preferredLanguage: Language;
  userselltokens: ISelltoken[] = [];


  constructor(private authService: AuthService,
              private storage: AngularFireStorage,
              private db: AngularFirestore,
              private userService: UserService,
              private cookieService: CookieService,
              private appStateService: AppStateService,
              private translateService: TranslateService,
              private toastrService: ToastrService,
              private SelltokenService: SelltokenService) {
    this.languages = [
      {code: 'EN', name: 'English', icon: 'assets/flags/united-kingdom-flag-round-medium.png'},
      {code: 'ES', name: 'Spanish', icon: 'assets/flags/spain-flag-round-medium.png'},
      {code: 'CH', name: 'Swiss', icon: 'assets/flags/switzerland-flag-round-medium.png'},
      {code: 'SK', name: 'Slovak', icon: 'assets/flags/slovakia-flag-round-medium.png'},
      {code: 'RO', name: 'Romanian', icon: 'assets/flags/romania-flag-round-medium.png'},
    ];
  }

  ngOnInit(): void {
    //this.subs$.push(this.userService.getCountries().subscribe(res => {
    //  this.countries = res;
    //}));
    // this.preferredLanguage = this.languages.find(x => x.code === this.cookieService.get('preferredLanguage'));
    // this.subs$.push(this.authService.user$.subscribe((res) => this.user = res));
    var  isLoad:boolean = false;
    this.subs$.push(
      this.authService.user$.pipe(
        switchMap((user) => { 
          if (!user)
          {
            this.authService.getShell().actionLogin();
            return of([]);
          }
          if (isLoad )
            return;
          isLoad = true;
          this.user = user;
          if (!this.user?.description)
            this.user.description = ''
          return this.userService.getUserselltokens(user.uid);
        })
      ).subscribe((selltokens) => {
        if (selltokens && selltokens.length>0)
          this.userselltokens = selltokens;
      })
    );
  }

  async onFileChanged(event): Promise<void> {
    console.log(event.target.files[0].name);
    console.log(event.target.files[0]);
    const path = `uploads/${Date.now()}_${event.target.files[0].name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, event.target.files[0]);

    this.percentage = this.task.percentageChanges();

    this.subs$.push(this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.user.photoUrl = this.downloadURL;
        this.db.collection('files').add( { downloadURL: this.downloadURL, path });
        return;
      }),
    ).subscribe()
    );
  }

  updateProfile(): void {
    console.log("update profile============");
    if (this.user.firstName.length > 0 && this.user.lastName.length > 0){
      // this.cookieService.put('preferredLanguage', this.preferredLanguage?.code);
      this.appStateService.changeState('loading');
      this.userService.updateUserProfileData(this.user)
        .then(res => {
          this.toastrService.success(this.translateService.instant('user.profile-section-header.profile-has-been-updated'));
          this.appStateService.changeState('normal');
          // if (this.cookieService.get('preferredLanguage')) {
          //   this.translateService.use(this.cookieService.get('preferredLanguage').toLowerCase());
          // }
          if (this.user.preferredLanguage) {
            this.translateService.use(this.user.preferredLanguage.code.toLocaleLowerCase());
          }
          this.userselltokens.forEach(selltoken => {
            selltoken.userName = this.user.firstName + ' ' + this.user.lastName;
            selltoken.userPhotoUrl = this.user.photoUrl;
            selltoken.userFacebook = this.user.facebookUrl ? this.user.facebookUrl : '';
            selltoken.userTwitter = this.user.twitterUrl ? this.user.twitterUrl : '';
            selltoken.userDescription = this.user.description ? this.user.description : '';
            this.SelltokenService.createOrUpdateselltoken(selltoken).then((response) => this.appStateService.changeState('normal'))
              .catch(error => console.log(error));
          });
        })
        .catch(err => 
          {
            this.toastrService.error(err.message, 'Error')
            this.appStateService.changeState('normal');
          }
          );
    }
    else {
      this.toastrService.error(this.translateService.instant('user.profile-section-header.form-is-invalid'));
    }

  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

  clipboard() {
    this.toastrService.success("Successfully Copied")
  }

}
