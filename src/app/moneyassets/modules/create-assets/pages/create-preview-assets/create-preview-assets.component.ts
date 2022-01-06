import {Component, OnDestroy, OnInit} from '@angular/core';
import {IAssets} from '../../../../models/assets.model';
import {CreateAssetsDataService} from '../../services/create-assets-data.service';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AssetServices} from '../../../../services/assets.service';

@Component({
  selector: 'app-create-preview-assets',
  templateUrl: './create-preview-assets.component.html',
  styleUrls: ['./create-preview-assets.component.scss']
})
export class CreatePreviewAssetComponent implements OnInit, OnDestroy {

  assets: IAssets;
  $sub: Subscription;
 
  constructor(private createAssetsDataService: CreateAssetsDataService,
              private router: Router,
              private toastrService: ToastrService,
              private assetServices: AssetServices,
              private stateService: AppStateService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // this.createselltokenDataService.changeState({});
    console.log(history);
    this.$sub = this.createAssetsDataService.currentAssetsData.subscribe(res => {
      this.assets = res;
    });
  }

  nextStep(): void {
    this.createAssetsDataService.changeState(this.assets);
    this.stateService.changeState('loading');
    this.assetServices.createAsset(this.assets).then( res => {
      this.toastrService.success(this.translateService.instant('assets.create-assets.assets-created'));
      this.stateService.changeState('normal');
      this.router.navigate(['mbasset/create/thank-you']);
    }).catch(err => {
      //this.toastrService.error(err.message);
      this.assetsNotCreated();
      this.stateService.changeState('normal');
      console.log(err);
    });;

  }

  prevStep(): void {
    // this.selltoken.selltokenFrom = new Date(this.selltoken.selltokenFrom * 1000);
    // this.selltoken.selltokenUntil = new Date(this.selltoken.selltokenUntil * 1000);
    // this.selltoken.shortDescription = this.selltoken.shortDescription.split('/newLineSeparator/').join('\n');
    this.createAssetsDataService.changeState(this.assets);
    this.router.navigate(['mbasset/create/create']);
  }

  assetsNotCreated(): void {
    this.toastrService.error(this.translateService.instant('assets.create-assets.assets-not-created'));
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

}
