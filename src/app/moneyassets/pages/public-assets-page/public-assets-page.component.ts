import {Component, OnDestroy, OnInit} from '@angular/core';
import {IAssets} from '../../models/assets.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {AssetServices} from '../../services/assets.service';
import {ModifyAssetsDataService} from '../../modules/create-assets/services/modify-assets-data.service';
import {IOwnedAssets} from '../../models/ownedassets.model';

@Component({
  selector: 'app-public-assets-page',
  templateUrl: './public-assets-page.component.html',
  styleUrls: ['./public-assets-page.component.scss']
})
export class PublicAssetsPageComponent implements OnInit , OnDestroy{
  assets: IAssets[] = [];
  $sub: Subscription;
  loading: boolean;
  totalRecords: number;
  ownedassets: IOwnedAssets[] = [];
  ownedtotalRecords: number;
  ownedloading: boolean;

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
    this.assetServices.getAssets().then( res => {
      console.log(res);
      for ( let i=0; i < res.length; i++)
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

    this.ownedloading = true;
    this.assetServices.getWalletsAsset().then( res => {
      console.log(res);
      for ( let i=1; i < res.length; i++)
      {
        res[i].description = res[i].description?.split('/newLineSeparator/').join('\n\n')
        this.ownedassets.push(
          res[i]
        )
  
      }
      this.ownedtotalRecords = this.ownedassets.length;
      //this.stateService.changeState('normal');
      this.loading = false;
    }).catch(err => {
      this.toastrService.error(err.message);
      this.stateService.changeState('normal');
      console.log("----errror is ");
      console.log(err);
    });;
  }

  modifyAsset(index:number): void {
    // get 
    let assets =  this.assets[index];
    this.modifyAssetsDataService.changeState(assets);
    this.router.navigate(['mbasset/create/modify']);
  }
  mintAsset(index:number): void {
    // get 
    let assets =  this.assets[index];
    this.modifyAssetsDataService.changeState(assets);
    this.router.navigate(['mbasset/mint']);
  }
  ngOnDestroy(): void {
    //this.$sub.unsubscribe();
  }
}
