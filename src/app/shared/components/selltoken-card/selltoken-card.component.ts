import {AfterViewInit, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {UserService} from '../../../user/services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {DonationsService} from '../../../selltokens/services/donations.service';
import {faHandHoldingUsd} from '@fortawesome/free-solid-svg-icons';
import {AppStateService} from '../../services/app-state.service';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AngularFireStorage, AngularFireUploadTask} from '@angular/fire/storage';

@Component({
  selector: 'app-selltoken-card',
  templateUrl: './selltoken-card.component.html',
  styleUrls: ['./selltoken-card.component.scss'],
  providers: [DonationsService]
})
export class SelltokenCardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() selltoken: ISelltoken;
  @Input() isPreview = false;
  user: User;
  valueOfFunding = '';
  subs: Subscription[] = [];
  mouseOvered = false;
  totalContributions;
  faHandHoldingUsd = faHandHoldingUsd;
  countdownTime = 0;
  isWaiting = false;
  isAuctionExpired = false;
  status: string = '';
  selectedUrl:SafeUrl = '';
  selectedType = 'image';
  constructor(private userService: UserService,
              private authService: AuthService,
              private httpClient: HttpClient,
              private toastrService: ToastrService,
              private router: Router,
              private storage: AngularFireStorage,
              private translateService: TranslateService,
              private donationService: DonationsService,
              private stateService: AppStateService,
              private sanitizer:DomSanitizer,
              private SelltokenService: SelltokenService,
              private http: HttpClient,

  ) {}

  async ngOnInit(): Promise<void> {
    this.isWaiting = true;
    //console.log("show token:", this.selltoken);
    //count down time

    this.subs.push(this.authService.user$.subscribe((res) => {
      this.user = res;
    }));

    if (this.selltoken.tokenType == 0)
    {
      var assetsIds = [];
      var selltoken = this.selltoken;
      if (!this.selltoken?.defaultSelected || this.selltoken?.defaultSelected == '0')
      {
        this.selectedUrl = selltoken && selltoken.photo_url!? selltoken.photo_url : selltoken?.runart?.image ?  this.sanitize(selltoken.runart?.image) : 'assets/token_land.png';
      }
      else
      {

        var index = parseInt(selltoken.defaultSelected ) - 1;
        var assetData = selltoken.runart.assetIds[index];
        var blob = await this.http.get("https://media.bitcoinfiles.org/" + assetData.txtid, {
          responseType: 'blob'
        }).toPromise();
        if (blob?.type)
        {
          if ( blob['type'].startsWith("image"))
          {
              this.selectedType = 'image';
          }
          if ( blob['type'].startsWith("video"))
          {
              this.selectedType = 'video';
          }
          if ( blob['type'].startsWith("audio"))
          {
              this.selectedType = 'sound';
          }
        }
        this.selectedUrl = "https://media.bitcoinfiles.org/" + assetData.txtid;
      }
    }

    this.authService.getServerTime().then( result =>
      {
        this.isWaiting = false;
        var serverTime = result['millionseconds'] ;
        var times = this.selltoken.auctionEndTime;
        this.countdownTime = times.seconds - serverTime/1000;
        if (this.countdownTime < 0)
        {
          //auction expired .
          //check choosen auction.
          this.isAuctionExpired = true;
          this.countdownTime = 0;
        }
        //console.log( "countdownTime is ==========", this.countdownTime);
        this.updateTimeline();
      }
      ).catch( err=>{
        this.isWaiting = false;
        this.isAuctionExpired = true;
      });
  }

  fixUrl($event)
  {
    console.log("fix url ============");
    if (!this.selltoken?.defaultSelected || this.selltoken?.defaultSelected == '0')
    {
      var path = "runart/" + this.selltoken.runart.location + ".bin";
      return new Promise((resolve, reject) => {
        const ref = this.storage.ref(path);

        ref.getDownloadURL().toPromise().then( (response) =>{
          $event.target.src = response;
          // update token url
          var art = {...this.selltoken.runart};
          art.image = response;
          this.SelltokenService.updateSellTokenUrl(this.selltoken.uid, art);
          //resolve(response);
        }).catch( async (err) => {
          //reject('');
        })
      });

    }
  }


  getUploadedLinks(path:string, file) : Promise<string>
  {
    path = "runart/" + path + ".bin";
    return new Promise((resolve, reject) => {
      const ref = this.storage.ref(path);

      ref.getDownloadURL().toPromise().then( (response) =>{
        resolve(response);
      }).catch( async (err) => {
        reject('');
      })
    });
  }


  sanitize(url:string){
    if (url.startsWith("data"))
      return this.sanitizer.bypassSecurityTrustUrl(url);
    else{
      //var data = await this.httpClient.get(url).toPromise() as string;
      // check if url exists;

      return url;

    }
  }
  updateTimeline()
  {

    if (this.selltoken.status == SelltokenStatus.APPROVED)
    {
      if (this.isAuctionExpired == true)
      {
        if ( this.selltoken?.auctionPaymail)
          this.status = "Processing";
        else
          this.status = "COMPLETE";
      }
      else
      {
        if (this.selltoken?.buyNow && this.selltoken.buyNow == true)
          this.status = "Processing";
        else
          this.status = "ACTIVE";
      }
    }
    else if (this.selltoken.status == SelltokenStatus.TOKEN_TRANSFERED)
    {
      this.status = "COMPLETE";
    }
    else if (this.selltoken.status == SelltokenStatus.ENDED)
    {
      this.status = "CLOSED";
    }else
      this.status = "UNKOWN";
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.valueOfFunding = Number((100 * (this.selltoken?.currentDonation / this.selltoken?.targetInEur))).toFixed(0);
    }, 500);
  }

  setFavoriteselltoken($event): void{
    $event.preventDefault();
    $event.stopPropagation();

    if (!this.isPreview && this.user){
      if (!this.user?.favoritesselltokens?.includes(this.selltoken?.uid)) {
        this.userService.setFavoriteselltokens(this.user.uid, this.selltoken?.uid, false).then(res => {
          this.SelltokenService.changeselltokenProperty(1, this.selltoken?.uid, 'likes');
          this.selltoken?.likes ? this.selltoken.likes++ : this.selltoken.likes = 1;
        });
        this.toastrService.success(this.translateService.instant('shared.selltoken-card.selltoken-has-been-added-to-favorites'));
      }
      else {
        this.userService.setFavoriteselltokens(this.user.uid, this.selltoken?.uid, true).then(res => {
          console.log(res);
          this.SelltokenService.changeselltokenProperty(-1, this.selltoken?.uid, 'likes');
          this.selltoken.likes -= 1;
        });
        this.toastrService.success(this.translateService.instant('shared.selltoken-card.selltoken-has-been-deleted-from-favorites'));
      }
    }
    else if (!this.user) {
      this.toastrService.error(this.translateService.instant('shared.selltoken-card.you-must-be-logged-in'));
    }
  }
  handleEvent($event): void {
    if ($event.action == "done")
    {
      this.isAuctionExpired = true;
      this.updateTimeline();
    }
  }
  showDetailselltoken(): void {
    console.log("show detail now!!!!");
    if (!this.isPreview) {
      this.router.navigate(['/auction/', this.selltoken?.uid]);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  formatDate({ date, formatStr, timezone }): string {
    var dateV =  new Date(date);
    var strR = "<div class='css-1tioz0a'>";
    var isNew = false;
    if (dateV.getUTCMonth() != 0)
    {
      var s = ('0' + dateV.getUTCMonth() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>"+  s +"m </div></div>"
      isNew = true;
    }
    if ((dateV.getUTCDate()-1 != 0) || isNew == true)
    {
      var s = ('0' +  (dateV.getUTCDate()-1)).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "d</div></div>"
      isNew = true;
    }
    if (dateV.getUTCHours() != 0 )
    {
      var s = ('0' +  dateV.getUTCHours() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" + s  + "h</div></div>"
      isNew = true;
    }
    if (dateV.getUTCMinutes() != 0 )
    {
      var s = ('0' +  dateV.getUTCMinutes() ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "m</div></div>"
      isNew = true;
    }
    if (dateV.getUTCSeconds() != 0 || isNew == true)
    {
      var s = ('0' + dateV.getUTCSeconds()  ).slice(-2)
      strR += "<div class='css-vurnku'> <div class='css-vurnku'>" +  s  + "s</div></div>"
      isNew = true;
    }
    strR += "</div>";
    return strR;
  }


}
