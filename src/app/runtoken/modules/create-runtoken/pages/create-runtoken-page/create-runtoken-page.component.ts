import {Component, OnDestroy, OnInit} from '@angular/core';
//import {AssetServices} from '../../../../services/assets.service';
import {IRunToken} from '../../../../models/runtoken.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription,Observable} from 'rxjs';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {AuthService} from '../../../../../auth/services/auth.service';
import {User} from '../../../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {CategoriesService} from '../../../../../shared/services/categories.service';
import {finalize,map, tap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import * as moment from 'moment';
import {RunTokenStatus} from '../../../../enums/runtoken-status.enum';
import {CryptoService} from '../../../../../shared/services/crypto.service';
import {OwnerGuard} from '../../../../../shared/guards/owner.guard';
import {TranslateService} from '@ngx-translate/core';
import {PhotoUrlService} from '../../../../services/photo-url.service';
import {CreateRunTokenDataService} from '../../services/create-runtoken-data.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {RunTokenService} from '../../../../services/runtoken.service';

declare var Run;

@Component({
  selector: 'app-create-runtoken-page',
  templateUrl: './create-runtoken-page.component.html',
  styleUrls: ['./create-runtoken-page.component.scss']
})
export class CreateRunTokenPageComponent implements OnInit, OnDestroy {
  $subs: Subscription[] = [];
  url;
  thumbnailUrl;
  user: User;
  assets: IRunToken = {};
  todayDate: Date = new Date();
  isEditing = false;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  downloadURL: string;

  constructor(//private assetsService: AssetServices,
              private storage: AngularFireStorage,
              private router: Router,
              private photoUrlService: PhotoUrlService,
              private activatedRoute: ActivatedRoute,
              private assetServices: RunTokenService,
              private createRunTokenDataService: CreateRunTokenDataService,
              private stateService: AppStateService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private cryptoService: CryptoService,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.$subs.push(this.createRunTokenDataService.currentRunTokenData.subscribe(res => {
      this.assets = res;
    }));
    this.$subs.push(this.photoUrlService.currentUrl.subscribe(res => this.url = res));
    this.$subs.push(this.authService.user$.subscribe(res => this.user = res));
  }


  isUrl(s:string) : boolean {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    //\"^(https?|http?)://[a-zA-Z0-9]+[.][a-zA-Z0-9]{2,}\
    return regexp.test(s);
  }

  goNext() : void {
    try{
      console.log('IS EDITING', this.isEditing);
      if ( this.assets?.name.length < 5)
      {
        this.toastrService.error(this.translateService.instant('assets-validation-name-cannot-be-less-5'));
        return;
      }
      if ( this.assets?.initialSupply <= 0)
      {
        this.toastrService.error(this.translateService.instant('assets-validation-please-set-number-more-0'));
        return;
      }
      // check load image ; not right now

      if (
        (
          this.assets?.name !== ''))
      {
        this.stateService.changeState('normal');
        // this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
        //if (this.assets.description)
        //  this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
        this.assets.status = RunTokenStatus.CREATION;
        this.createRunTokenDataService.changeState(this.assets);
        this.router.navigate(['rtasset/create/preview']).then(() => this.stateService.changeState('normal'));
      } else {
        this.toastrService.error(this.translateService.instant('assets.create-assets-page.form-is-invalid'));
      }
    }catch(err) {
      this.toastrService.error(this.translateService.instant('Cannot load the image, problem with the Run B class, please choose another image.'));
      console.log(err);
    }
  }

  async nextStep(): Promise<void> {
    console.log('IS EDITING', this.isEditing);

    if ( this.assets.avatar && this.assets.avatar != '')
    {
      this.stateService.changeState('loading');
      this.assetServices.canLoadImage(this.assets.avatar).then( res => {
        this.stateService.changeState('normal');

        if (res?.success == true)
        {
            this.goNext();
        }
        else
        {
          this.toastrService.error(this.translateService.instant('Cannot load the image, image must be a PNG or SVG, please choose another image.'));
        }
      })
    }else{
      this.goNext();
    }

  }


  async onFileChanged(event): Promise<void> {
    console.log(event.target.files[0].name);
    console.log(event.target.files[0]);
    const path = `uploads/${Date.now()}_${event.target.files[0].name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, event.target.files[0]);

    this.percentage = this.task.percentageChanges();

    this.$subs.push(this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async () =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();
        this.assets.avatar = this.downloadURL;
        console.log("avatar url is:" + this.assets.avatar);
        return;
      }),
    ).subscribe()
    );
  }
  changeAvatar()
  {

  }
  ngOnDestroy(): void {
    this.$subs.forEach(sub => sub.unsubscribe());
  }
}
