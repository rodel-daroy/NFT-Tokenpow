import {Component, OnDestroy, OnInit} from '@angular/core';
//import {AssetServices} from '../../../../services/assets.service';
import {IAssets} from '../../../../models/assets.model';
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
import {AssetsStatus} from '../../../../enums/assets-status.enum';
import {CryptoService} from '../../../../../shared/services/crypto.service';
import {OwnerGuard} from '../../../../../shared/guards/owner.guard';
import {TranslateService} from '@ngx-translate/core';
import {PhotoUrlService} from '../../../../services/photo-url.service';
import {CreateAssetsDataService} from '../../services/create-assets-data.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';

@Component({
  selector: 'app-create-assets-page',
  templateUrl: './create-assets-page.component.html',
  styleUrls: ['./create-assets-page.component.scss']
})
export class CreateAssetsPageComponent implements OnInit, OnDestroy {
  $subs: Subscription[] = [];
  url;
  thumbnailUrl;
  user: User;
  assets: IAssets = {};
  todayDate: Date = new Date();
  isEditing = false;
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  downloadURL: string;

  file: any;

  constructor(//private assetsService: AssetServices,
              private storage: AngularFireStorage,
              private router: Router,
              private photoUrlService: PhotoUrlService,
              private activatedRoute: ActivatedRoute,
              private createAssetsDataService: CreateAssetsDataService,
              private stateService: AppStateService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private cryptoService: CryptoService,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.$subs.push(this.createAssetsDataService.currentAssetsData.subscribe(res => {
      this.assets = res;
    }));
    this.$subs.push(this.photoUrlService.currentUrl.subscribe(res => this.url = res));
    this.$subs.push(this.authService.user$.subscribe(res => this.user = res));
  }

  uploadFile(event) {
    this.file = event[0]
    console.log("file: ", this.file)
  }
  deleteAttachment() {
    this.file = null
  }


  isUrl(s:string) : boolean {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    //\"^(https?|http?)://[a-zA-Z0-9]+[.][a-zA-Z0-9]{2,}\
    return regexp.test(s);
  }

  async nextStep(): Promise<void> {
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
    if ( this.assets.avatar != null && this.assets.avatar.trim() != '' && !this.isUrl(this.assets.avatar)) {
      this.toastrService.error(this.translateService.instant('assets-validation-avatar-link-is-url'));
      return;
    }
    if (
      (
        this.assets?.name !== ''))
    {

      const filePath = `moneynft/${Date.now()}_${this.file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.storage.upload(filePath, this.file);    // upload task

      // this.progress = this.snapTask.percentageChanges();

      this.stateService.changeState('loading');
      (await this.task).ref.getDownloadURL().then(async url => {
        this.assets.avatar = url;
        console.log("avatar url is:" + this.assets.avatar);
        // this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
        if (this.assets.description)
          this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
        this.assets.status = AssetsStatus.CREATION;
        await this.createAssetsDataService.changeState(this.assets);
        this.router.navigate(['mbasset/create/preview']).then(() => this.stateService.changeState('normal'));
      });  // <<< url is found here


    } else {
      this.toastrService.error(this.translateService.instant('assets.create-assets-page.form-is-invalid'));
    }
  }
  

  async onFileChanged(): Promise<void> {
    const path = `moneynft/${Date.now()}_${this.file.name}`;

    const ref = this.storage.ref(path);

    this.task = this.storage.upload(path, this.file);

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
