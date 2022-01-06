import {Component, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import {IRunNft} from '../../models/runnft.model';
import {RunNftDataService} from '../../services/runnft-data.service';
import {RunNftServices} from '../../services/runnft.service';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import { faEye, faMapMarkerAlt, faCoins, faUser } from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons';
import {AppStateService} from '../../../shared/services/app-state.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {DomSanitizer} from '@angular/platform-browser';
import { HttpHeaders ,HttpClient } from '@angular/common/http';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'detail-nft',
  templateUrl: './detail-nft.component.html',
  styleUrls: ['./detail-nft.scss']
})
export class NftDetailComponent implements OnInit, OnDestroy {

  runNft: IRunNft;
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

  promotionData;
  isPromotionLoaded = false;
  promotionAssets = [];

  @ViewChild('fullscreen') fullScreenImage: ElementRef;
  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  constructor(
              private runnftDataService: RunNftDataService,
              private router: Router,
              private runnftService: RunNftServices,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              private toastrService: ToastrService,
              private http: HttpClient,
              private translateService: TranslateService) { }

  ngOnInit(): void {
    // this.createselltokenDataService.changeState({});
    console.log(history);

    this.$sub = this.runnftDataService.currentNftData.subscribe(res => {
      this.runNft = res;

      console.log('NFT=',this.runNft);
      this.runnftService.getPromotionLink(this.runNft.name).then(
        (data) =>{
          if (data.exists)
          {
            this.promotionData = data.data()
          }else {
            console.log('no promotion found!', this.runNft.name);
          }

        }
      )
      if (this.promotionAssets.length == 0)
      {
        var assets = {};
        try{
        assets['url'] = this.runNft && this.runNft.image ?  this.sanitize(this.runNft?.image) : 'assets/token_land.png';
        assets['type'] = 'image';
        this.promotionAssets.push(assets);
        }catch (e) {
          console.log(e);
        }

        var assetsIds = this.runNft.assetIds;

        if(assetsIds && assetsIds.length > 0)
          assetsIds.forEach(async assetTxid => {
            var assets = {};
            assets['url'] = "https://media.bitcoinfiles.org/" + assetTxid.txtid;
            assets['type'] = 'image';
            var blob = await this.http.get(assets['url'], {
              responseType: 'blob'
            }).toPromise();
            if (blob?.type)
            {
              if ( blob['type'].startsWith("image"))
              {
                  assets['type'] = 'image';
              }
              if ( blob['type'].startsWith("video"))
              {
                  assets['type'] = 'video';
              }
              if ( blob['type'].startsWith("audio"))
              {
                  assets['type'] = 'sound';
              }
            }
            console.log(assets);
            this.promotionAssets.push(assets);
          });
        setTimeout(() => {
          if (this.myCarousel)
          {
            this.myCarousel.pause();
          }
        }, 2000);

      }
    });


  }

  promotionLoaded($event): void
  {
    console.log('loaded promotion');
    this.isPromotionLoaded = true;
  }
  prevStep(): void {
    this.runnftDataService.changeState(this.runNft);
    this.router.navigate(['runnft/myassets']);

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
