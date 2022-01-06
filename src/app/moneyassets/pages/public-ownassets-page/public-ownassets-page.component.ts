import {Component, OnDestroy, OnInit} from '@angular/core';
import {IOwnedAssets} from '../../models/ownedassets.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AssetServices} from '../../services/assets.service';
import {ModifyAssetsDataService} from '../../modules/create-assets/services/modify-assets-data.service';

@Component({
  selector: 'app-public-ownassets-page',
  templateUrl: './public-ownassets-page.component.html',
  styleUrls: ['./public-ownassets-page.component.scss']
})
export class PublicOwnAssetsPageComponent implements OnInit , OnDestroy{
  assets: IOwnedAssets[] = [];
  $sub: Subscription;
  loading: boolean;
  totalRecords: number;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: AssetServices,
    private stateService: AppStateService,
    private modifyAssetsDataService: ModifyAssetsDataService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    console.log("My Assets Page");
    //this.stateService.changeState('loading');
    this.loading = true;
    this.assetServices.getWalletsAsset().then( res => {
      console.log(res);
      for ( let i=1; i < res.length; i++)
      {
        res[i].description = res[i].description?.split('/newLineSeparator/').join('\n\n')
        this.assets.push(
          res[i]
        )
  
      }
      this.totalRecords = this.assets.length;
      //this.stateService.changeState('normal');
      this.loading = false;
    }).catch(err => {
      this.toastrService.error(err.message);
      this.stateService.changeState('normal');
      console.log("----errror is ");
      console.log(err);
    });;
  }

  ngOnDestroy(): void {
    //this.$sub.unsubscribe();
  }
}
