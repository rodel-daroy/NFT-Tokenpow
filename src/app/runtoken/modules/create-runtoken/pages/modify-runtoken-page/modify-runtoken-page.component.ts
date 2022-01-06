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
import {ModifyRunTokenDataService} from '../../services/modify-runtoken-data.service';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';
import {RunTokenService} from '../../../../services/runtoken.service';

@Component({
  selector: 'app-modify-runtoken-page',
  templateUrl: './modify-runtoken-page.component.html',
  styleUrls: ['./modify-runtoken-page.component.scss']
})
export class ModifyRunTokenPageComponent implements OnInit, OnDestroy {
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
              private modifyRunTokenDataService: ModifyRunTokenDataService,
              private stateService: AppStateService,
              private authService: AuthService,
              private toastrService: ToastrService,
              private cryptoService: CryptoService,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    console.log("this call!!")
    window.scrollTo(0, 0);
    this.$subs.push(this.modifyRunTokenDataService.currentRunTokenData.subscribe(res => {
      this.assets = res;
      console.log("subsribed data is");
      console.log(res);
    }));
    this.$subs.push(this.photoUrlService.currentUrl.subscribe(res => this.url = res));
    this.$subs.push(this.authService.user$.subscribe(res => this.user = res));
    if (this.activatedRoute.snapshot.queryParams.id) {
      this.isEditing = true;
    }
  }

  isUrl(s:string) : boolean {
    var regexp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    //\"^(https?|http?)://[a-zA-Z0-9]+[.][a-zA-Z0-9]{2,}\
    return regexp.test(s);
 }

  async nextStep(): Promise<void> {
    console.log('IS EDITING', this.isEditing);    
    if ( this.assets?.name.length < 5){
      this.toastrService.error(this.translateService.instant('assets-validation-name-cannot-be-less-5'));
      return;
    }
    if ( this.assets?.initialSupply <= 0){
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
      this.stateService.changeState('loading');
      // this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
      if (this.assets.description)
        this.assets.description = this.assets.description.split('\n').join('/newLineSeparator/');
      this.assets.status = RunTokenStatus.CREATION;
      this.stateService.changeState('loading');
      this.assetServices.updateAsset(this.assets).then( res => {
        if (res?.success == true)
        {
          this.toastrService.success(this.translateService.instant('modify.create-assets.assets-modify'));
        }
        else
        {
          if (res?.error)
            this.toastrService.error( res.console.error()
            );
          else
            this.toastrService.error( 'Something went wrong!' );
        }
        this.stateService.changeState('normal');
        this.router.navigate(['rtasset/myassets']);
      }).catch(err => {
        this.toastrService.error(err.message);
        this.stateService.changeState('normal');
        console.log(err);
      });;
    } else {
      this.toastrService.error(this.translateService.instant('selltokens.create-selltoken-page.form-is-invalid'));
    }
  }
  
  backStep(): void {
    // this.selltoken.selltokenFrom = new Date(this.selltoken.selltokenFrom * 1000);
    // this.selltoken.selltokenUntil = new Date(this.selltoken.selltokenUntil * 1000);
    // this.selltoken.shortDescription = this.selltoken.shortDescription.split('/newLineSeparator/').join('\n');
    this.router.navigate(['rtasset/myassets']);
  }
  ngOnDestroy(): void {
    this.$subs.forEach(sub => sub.unsubscribe());
  }
}
