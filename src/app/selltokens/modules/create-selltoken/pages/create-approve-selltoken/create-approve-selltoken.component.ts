import {Component, OnDestroy, OnInit} from '@angular/core';
import {CreateSelltokenDataService} from '../../services/create-selltoken-data.service';
import {SelltokenService} from '../../../../services/selltoken.service';
import {ISelltoken} from '../../../../models/selltoken.model';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {SelltokenStatus} from '../../../../enums/selltoken-status.enum';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {TranslateService} from '@ngx-translate/core';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SelltokenType } from '../../../../enums/selltoken-type.enum';
@Component({
  selector: 'app-create-approve-selltoken',
  templateUrl: './create-approve-selltoken.component.html',
  styleUrls: ['./create-approve-selltoken.component.scss']
})
export class CreateApproveSelltokenComponent implements OnInit, OnDestroy {

  selltoken: ISelltoken;
  subs: Subscription[] = [];
  approve;

  constructor(private createSelltokenDataService: CreateSelltokenDataService,
              private selltokenService: SelltokenService,
              private router: Router,
              private authService: AuthService,
              private stateService: AppStateService,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.subs.push(this.createSelltokenDataService.currentselltokenData.subscribe(res => {
      console.log('CURRENT CAMPAIGN', res);
      this.selltoken = res;
    }));
  }

  submitButton(): void {
    this.stateService.changeState('loading');
    console.log("type is " , this.selltoken.isShowBoard)
    {
      this.authService.getServerTime().then( result =>
        {
          console.log("--------------------------------------------------------------")
          var nowDate:number = Date.now()  ;
          //var times = this.selltoken.auctionEndTime?.getTime();
          nowDate = result['millionseconds'] ;
          var countDownTime = 24*3600*1000*365*5000-nowDate;//times - nowDate;
          this.selltoken.auctionEndTime = new Date(countDownTime);//firebase.firestore.FieldValue.serverTimestamp();
          this.selltoken.countDownTime = countDownTime;
          this.selltoken.buyNow = false;
          this.selltoken.isReserved = true;
          this.stateService.changeState('loading');

          this.selltokenService.createOrUpdateselltoken(this.selltoken).then( res => {
            this.toastrService.success(this.translateService.instant( 'Auction created sucessfuly !'));
            this.stateService.changeState('normal');
            this.router.navigate(['auction/create/thank-you'], {queryParams: {selltokenName: this.selltoken.title}});
            this.createSelltokenDataService.changeState({});
          }).catch(err => {
            this.toastrService.error(err.message);
            this.stateService.changeState('normal');
            console.log(err);
          });;
        }
        ).catch( err=>{

        });
      }

  }

  prevStep(): void {
    this.router.navigate(['auction/create/preview']);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
