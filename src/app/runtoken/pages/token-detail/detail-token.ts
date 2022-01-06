import {Component, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import {IRunToken} from '../../models/runtoken.model';
import {RunTokenDataService} from '../../services/runtoken-data.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import { faEye, faMapMarkerAlt, faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {AppStateService} from '../../../shared/services/app-state.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'detail-token',
  templateUrl: './detail-token.component.html',
  styleUrls: ['./detail-token.scss']
})
export class TokenDetailComponent implements OnInit, OnDestroy {

  runtoken: IRunToken;
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
  countdownTime:number = 3600*24;
  isFullScreenView = false;
  @ViewChild('fullscreen') fullScreenImage: ElementRef;

  constructor(
              private runTokenDataService: RunTokenDataService,
              private router: Router,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              private toastrService: ToastrService,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    // this.createselltokenDataService.changeState({});
    console.log(history);
    this.$sub = this.runTokenDataService.currentTokenData.subscribe(res => {
      this.runtoken = res;
    });
  }


  prevStep(): void {
    this.runTokenDataService.changeState(this.runtoken);
    this.router.navigate(['rtasset/myownedassets']);
    
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

  showFullScreen(): void {
    if (!this.isFullScreenView)
    {
      console.log("test...................")
      var elem = this.fullScreenImage.nativeElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen();
      }
  
    }
    else{
      var elem = this.fullScreenImage.nativeElement;
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } 
    }
    this.isFullScreenView = !this.isFullScreenView;
  }
  getRealSupply(supply:number, decimal:number)
  {
    var su = supply;
    for (var i  = 0; i < decimal; i++) {
          su /= 10
     }
     
     return su.toFixed(decimal);     
  }
}
