import {Component, OnDestroy, OnInit} from '@angular/core';
import {ISelltoken} from '../../../../models/selltoken.model';
import {CreateSelltokenDataService} from '../../services/create-selltoken-data.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import { faEye, faMapMarkerAlt, faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {SelltokenService} from '../../../../services/selltoken.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {DomSanitizer} from '@angular/platform-browser';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-create-preview-selltoken',
  templateUrl: './create-preview-selltoken.component.html',
  styleUrls: ['./create-preview-selltoken.component.scss']
})
export class CreatePreviewSelltokenComponent implements OnInit, OnDestroy {

  selltoken: ISelltoken;
  $sub: Subscription;
  videoUrl;
  faEye = faEye;
  faMapMarkerAlt = faMapMarkerAlt;
  faUser = faUser;
  faCoins = faCoins;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  mouseOvered = false;
  statusTimeLine: any[];
  countdownTime:number = environment.auctionTime;
  constructor(
              private selltokenService: SelltokenService,
              private createselltokenDataService: CreateSelltokenDataService,
              private router: Router,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    // this.createselltokenDataService.changeState({});
    console.log(history);
    this.$sub = this.createselltokenDataService.currentselltokenData.subscribe(res => {
      this.selltoken = res;
      if (this.selltoken.collection) {
        this.selltokenService.getCollectionById(this.selltoken.collection).subscribe((data: any) => {
          this.countdownTime = data[0].data.duration * 60
        })
      }

    });
    this.statusTimeLine = [
      {status: 'Active', color: '#2ea8fd'},
      {status: 'Pending', color: '#8dd0ff'},
      {status: 'Paid', color: '#8dd0ff'},
      {status: 'Complete', color: '#8dd0ff'},
      {status: 'Closed', color: '#8dd0ff'}
    ];
  }

  nextStep(): void {
    this.createselltokenDataService.changeState(this.selltoken);
    this.router.navigate(['auction/create/approve']);

  }

  prevStep(): void {
    // this.selltoken.selltokenFrom = new Date(this.selltoken.selltokenFrom * 1000);
    // this.selltoken.selltokenUntil = new Date(this.selltoken.selltokenUntil * 1000);
    // this.selltoken.shortDescription = this.selltoken.shortDescription.split('/newLineSeparator/').join('\n');
    this.createselltokenDataService.changeState(this.selltoken);
    this.router.navigate(['auction//create']);
    
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
  selltokenNotCreated(): void {
    this.toastrService.error(this.translateService.instant('selltokens.create-preview-selltoken.you-need-to-create-selltoken-first-to-do-this-action'));
  }

  ngOnDestroy(): void {
    this.$sub.unsubscribe();
  }


  
  formatDate({ date, formatStr, timezone }): string {
    var dateV =  new Date(date);
    var strR = "<div class='css-1minwi3'>";
    var isNew = false;
    if (dateV.getUTCMonth() != 0)
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>"+ dateV.getUTCMonth +"</div> <div class='css-hswzdu'>Months</div> </div>"
      isNew = true;
    }
    if ((dateV.getUTCDate()-1 != 0) || isNew == true)
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>" +  (dateV.getUTCDate()-1)  + "</div> <div class='css-hswzdu'>Days</div> </div>"
      isNew = true;
    }
    if (dateV.getUTCHours() != 0 )
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>" +  dateV.getUTCHours()  + "</div> <div class='css-hswzdu'>Hours</div> </div>"
      isNew = true;
    }
    if (dateV.getUTCMinutes() != 0 )
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>" +  dateV.getUTCMinutes()  + "</div> <div class='css-hswzdu'>Minutes</div> </div>"
      isNew = true;
    }
    if (dateV.getUTCMinutes() != 0 || isNew == true)
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>" +  dateV.getUTCSeconds()  + "</div> <div class='css-hswzdu'>Seconds</div> </div>"
      isNew = true;
    }
    strR += "</div>";
    return strR;
  }




}
