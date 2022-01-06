import {Component, OnDestroy, OnInit} from '@angular/core';
import {IRunToken} from '../../models/runtoken.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunTokenService} from '../../services/runtoken.service';
import {ModifyRunTokenDataService} from '../../modules/create-runtoken/services/modify-runtoken-data.service';

@Component({
  selector: 'app-public-runtoken-page',
  templateUrl: './public-runtoken-page.component.html',
  styleUrls: ['./public-runtoken-page.component.scss']
})
export class PublicRunTokenPageComponent implements OnInit , OnDestroy{
  assets: IRunToken[] = [];
  $sub: Subscription;
  loading: boolean;
  totalRecords: number;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: RunTokenService,
    private stateService: AppStateService,
    private modifyRunTokenDataService: ModifyRunTokenDataService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    console.log("My RunToken Page");
    //this.stateService.changeState('loading');
    this.loading = true;
    this.assetServices.getRunToken().then( res => {
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
  }

  modifyAsset(index:number): void {
    // get 
    let assets =  this.assets[index];
    this.modifyRunTokenDataService.changeState(assets);
    this.router.navigate(['rtasset/create/modify']);
  }
  mintAsset(index:number): void {
    // get 
    let assets =  this.assets[index];
    this.modifyRunTokenDataService.changeState(assets);
    this.router.navigate(['rtasset/mint']);
  }
  ngOnDestroy(): void {
    //this.$sub.unsubscribe();
  }
}
