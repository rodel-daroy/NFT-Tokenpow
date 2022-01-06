import {Component, OnDestroy, OnInit} from '@angular/core';
import {IOwnedRunToken} from '../../models/ownedruntoken.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunTokenService} from '../../services/runtoken.service';
import {ModifyRunTokenDataService} from '../../modules/create-runtoken/services/modify-runtoken-data.service';
import { RunTokenStatus } from '../../enums/runtoken-status.enum';
import { IRunToken } from '../../models/runtoken.model';
import {DialogService} from 'primeng/dynamicdialog';
import { RuntokenTransferDialogComponent } from '../../component/runtoken-transfer-dialog/runtoken-transfer-dialog.component';
import {DomSanitizer} from '@angular/platform-browser';
import { RunTokenDetailDialogComponent } from '../../component/runtoken-detail-dialog/runtoken-detail-dialog.component';
import { RunTokenDataService } from '../../services/runtoken-data.service';

@Component({
  selector: 'app-public-ownruntoken-page',
  templateUrl: './public-ownruntoken-page.component.html',
  styleUrls: ['./public-ownruntoken-page.component.scss']
})
export class PublicOwnRunTokenPageComponent implements OnInit , OnDestroy{
  assets: IRunToken[] = [];
  $sub: Subscription;
  loading: boolean;
  totalRecords: number;
  selectedToken: IRunToken;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private assetServices: RunTokenService,
    private dataService: RunTokenDataService,
    private stateService: AppStateService,
    private dialogService: DialogService,
    private sanitizer:DomSanitizer,
    private modifyRunTokenDataService: ModifyRunTokenDataService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    console.log("My RunToken Page");
    //this.stateService.changeState('loading');
    this.loading = true;
    this.assetServices.getWalletsAsset().then( res => {
      console.log(res);
      this.assets = res;
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

  getRealSupply(supply:number, decimal:number)
  {
    var su = supply;
    for (var i  = 0; i < decimal; i++) {
          su /= 10
     }
     
     return su.toFixed(decimal);     
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  transfer(index : number): void {

    let assets =  this.assets[index];
    const ref = this.dialogService.open(RuntokenTransferDialogComponent, {
      header: this.translateService.instant('Transfer'),
      width: 'auto',
      data: {
        decimals:assets.decimals,
        location:assets.location,
      }
    });
    ref.onClose.subscribe((response) => {
      console.log(response);
      if (response.answer) {
        this.assets[index].supply -= response.amount;
      }
    });
  }

  detail(index : number): void {

    let assets =  this.assets[index];
    this.dataService.changeState(assets);
    this.router.navigate(['rtasset/detail']);
    /*
    const ref = this.dialogService.open(RunTokenDetailDialogComponent, {
      header: this.translateService.instant('Detail'),
      width: 'auto',
      data: {
        selToken:assets,
      }
    });
    ref.onClose.subscribe((response) => {
    });
    */
  }


  onRowSelect(event) {
    console.log("show",this.selectedToken);
    //show detail dialog
    const ref = this.dialogService.open(RunTokenDetailDialogComponent, {
      header: this.translateService.instant('Detail'),
      width: 'auto',
      data: {
        selToken:this.selectedToken,
      }
    });
    ref.onClose.subscribe((response) => {
    });
  }
}
