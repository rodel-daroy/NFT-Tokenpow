import {Component, OnDestroy, OnInit} from '@angular/core';
import {IRunToken} from '../../../../models/runtoken.model';
import {CreateRunTokenDataService} from '../../services/create-runtoken-data.service';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {RunTokenService} from '../../../../services/runtoken.service';

@Component({
  selector: 'app-create-preview-runtoken',
  templateUrl: './create-preview-runtoken.component.html',
  styleUrls: ['./create-preview-runtoken.component.scss']
})
export class CreatePreviewRunTokenComponent implements OnInit, OnDestroy {

  assets: IRunToken;
  $sub: Subscription;
 
  constructor(private createRunTokenDataService: CreateRunTokenDataService,
              private router: Router,
              private toastrService: ToastrService,
              private assetServices: RunTokenService,
              private stateService: AppStateService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // this.createselltokenDataService.changeState({});
    console.log(history);
    this.$sub = this.createRunTokenDataService.currentRunTokenData.subscribe(res => {
      this.assets = res;
    });
  }

  nextStep(): void {
    this.createRunTokenDataService.changeState(this.assets);
    this.stateService.changeState('loading');
    this.assetServices.createAsset(this.assets).then( res => {
      if (res?.success == true)
      {
        //mint 
        //this.createRunTokenDataService.changeState({});

        this.toastrService.success(this.translateService.instant('assets.create-assets.assets-created'));
        this.router.navigate(['rtasset/create/thank-you']);
      }
      else
      {
        if (res?.message)
          this.toastrService.error( res?.name + "\n" + res?.message);
        else
          this.toastrService.error( 'Something went wrong!' );
      }
      this.stateService.changeState('normal');
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
    this.createRunTokenDataService.changeState(this.assets);
    this.router.navigate(['rtasset/create/create']);
  }

  assetsNotCreated(): void {
    this.toastrService.error(this.translateService.instant('assets.create-assets.assets-not-created'));
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }

}
