import {AfterViewInit, Component, Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {ISelltoken} from '../../models/selltoken.model';
import {ShortLinkService} from '../../services/short-link.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {IShortUrl} from '../../models/shortUrl.model';
import {SelltokenService} from '../../services/selltoken.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from '../../../shared/services/app-state.service';
import {Meta, Title} from '@angular/platform-browser';
import {SeoService} from '../../../shared/services/seo.service';
import {switchMap} from 'rxjs/operators';
import {DialogService} from 'primeng/dynamicdialog';
import {DonationsTableComponent} from '../../components/donations-table/donations-table.component';
import {BidDialogComponent} from '../../components/bid-dialog/bid-dialog.component';
import { BuyNowDialogComponent } from '../../components/buyNow-dialog/buyNow-dialog.component';
import {SelltokenStatus} from '../../enums/selltoken-status.enum';
import {forkJoin, identity, Observable, Subscription} from 'rxjs';
import {WithdrawSelltokensCoinsService} from '../../services/withdraw-selltokens-coins.service';
import {ConfirmationService} from 'primeng/api';
import {UserService} from '../../../user/services/user.service';
import {ClipboardService} from 'ngx-clipboard';
import {map, take, tap} from 'rxjs/operators';
import {PrimeIcons} from 'primeng/api';
import {SelltokenForceTransferDialogComponent} from '../../components/selltoken-forcetransfer-dialog/selltoken-forcetransfer-dialog.component'
import {
  faArrowLeft,
  faArrowRight,
  faCoins,
  faCrosshairs,
  faEye, faHandHoldingUsd,
  faMapMarkerAlt,
  faUser,
  faWindowClose
} from '@fortawesome/free-solid-svg-icons';
import {CryptoService} from '../../../shared/services/crypto.service';
import {DonateService} from '../../services/donate.service';
import {SelltokenCloseDialogComponent} from '../../components/selltoken-close-dialog/selltoken-close-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {faFacebook, faTwitter} from '@fortawesome/free-brands-svg-icons';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {Button} from 'primeng/button';
//import {PerkDialogComponent} from '../../components/perk-dialog/perk-dialog.component';
import {environment} from '../../../../environments/environment';
//import {PerkService} from '../../services/perk.service';
import {DonationsService} from '../../services/donations.service';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import firebase from 'firebase';
import { SelltokenType } from '../../enums/selltoken-type.enum';
import { SelltokenTransferDialogComponent } from '../../components/selltoken-transfer-dialog/selltoken-transfer-dialog.component';
import {BsvPriceService} from '../../../selltokens/modules/create-selltoken/services/bsv-price.service';
import {DomSanitizer} from '@angular/platform-browser';
import { BidHistory } from '../../models/bid-history.model';
import { WithDrawDialogComponent } from '../../components/withdraw-dialog/withdraw-dialog.component';

import { HttpClient } from '@angular/common/http';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { OfferDialogComponent } from '../../components/offer-dialog/offer-dialog.component';
import { CommentDialogComponent } from '../../components/comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [WithdrawSelltokensCoinsService, ConfirmationService]
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('copyToClipboardButton') copyToClipboardButton: Button;
  @ViewChild('fullscreen') fullScreenImage: ElementRef;
  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  selltoken_STATUS = SelltokenStatus;
  @Input() selltoken: ISelltoken;
  user: User;
  shortLink: IShortUrl;
  loading = false;
  videoUrl;
  subs$: Subscription[] = [];
  userLinkAddress: string;
  withdrawBalance: number;
  selltokenCoins: number;
  selltokenEuro: number;
  escrowAddress: any;
  escrowHistoryId: any;
  mouseOvered: boolean;
  faCrosshairs = faCrosshairs;
  faWindowClose = faWindowClose;
  faEye = faEye;
  faMapMarkerAlt = faMapMarkerAlt;
  faUser = faUser;
  faCoins = faCoins;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;
  faHandingHoldingUsd = faHandHoldingUsd;
  countdownTime = 0;
  isAuctionExpired = false;
  totalContributions = 0;
  escrowCoins = 0;
  currentDonationPercent;
  missingDonation;
  totalAmount = 0;
  faFacebook = faFacebook;
  faTwitter = faTwitter;
  htmlContent: String = "";
  lastBidHistory: BidHistory;
  isrefreshSatoshi:boolean = false;
  isFullScreenView = false;
  editorConfig: AngularEditorConfig = {
      editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '200px',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'yes',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: '',
        defaultFontName: '',
        defaultFontSize: '',
        fonts: [
          {class: 'arial', name: 'Arial'},
          {class: 'times-new-roman', name: 'Times New Roman'},
          {class: 'calibri', name: 'Calibri'},
          {class: 'comic-sans-ms', name: 'Comic Sans MS'}
        ],
        customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText'
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
      // uploadUrl: 'v1/image',
      uploadWithCredentials: false,
      sanitize: true,
      toolbarPosition: 'top',
      // toolbarHiddenButtons: [
      //   ['bold', 'italic'],
      //   ['fontSize']
      // ]
  };
  statusTimeLine: any[];
  status: string = "";
  promotionAssets = [];

  promotionData;
  isPromotionLoaded = false;
  donateAddress: string = "";

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = environment.baseUrl;

  increment: any = 0.5
  interval: any;
  intervalTime: any;

  bidHistory: any;
  offerHistory: any;

  collection_id: any;

  constructor(private shortLinkService: ShortLinkService,
              private authService: AuthService,
              private clipBoardService: ClipboardService,
              private meta: Meta,
              private title: Title,
              private SelltokenService: SelltokenService,
              private activatedRoute: ActivatedRoute,
              private toastrService: ToastrService,
              private stateService: AppStateService,
              private renderer: Renderer2,
              private guard: AuthGuard,
              private bsvService: BsvPriceService,
              private seoService: SeoService,
              private userService: UserService,
              private dialogService: DialogService,
              private cryptoService: CryptoService,
              private withdrawSelltokenCoinsService: WithdrawSelltokensCoinsService,
              private confirmationService: ConfirmationService,
              private donateService: DonateService,
              private router: Router,
              private sanitizer:DomSanitizer,
              private http: HttpClient,
              private translateService: TranslateService,
              //private emailService: EmailService,
              private donationService: DonationsService) { }

  ngAfterViewInit(): void {
    window.scrollTo(0, 0);
    this.router.navigate([], {
      queryParams: {
        userId: null,
        userEmail: null,
        address: null
      },
      queryParamsHandling: 'merge'
    });
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  sanitizeHtml(html:string)
  {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  ngOnInit(): void {
    this.donateService.changeState({
      address: this.activatedRoute.snapshot.queryParams.address,
      userId: this.activatedRoute.snapshot.queryParams.userId,
      userEmail: this.activatedRoute.snapshot.queryParams.userEmail
    });

    this.donateAddress = this.activatedRoute.snapshot.queryParams.address;
    this.value += "/auction/" + this.activatedRoute.snapshot.params.id

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    this.stateService.changeState('loading');

    this.subs$.push(this.SelltokenService.getSingleselltoken(this.activatedRoute.snapshot?.params?.id).pipe(
      switchMap((selltoken) => {
      this.seoService.generateTags({
        title: selltoken.title,
        description: selltoken.description,
        uid:selltoken.uid,
        image: selltoken.photo_url ? selltoken.photo_url : '',
      });

      this.statusTimeLine = [
        {status: 'Active', icon: PrimeIcons.SHOPPING_CART, color: '#8dd0ff'},
        {status: 'Processing', icon: PrimeIcons.ENVELOPE, color: '#8dd0ff'},
        {status: 'Complete', icon: PrimeIcons.ENVELOPE, color: '#8dd0ff'},
        {status: 'Closed', icon: PrimeIcons.CHECK, color: '#8dd0ff'}
      ];
      this.selltoken = selltoken;

      if (this.selltoken.collection) {
        this.SelltokenService.getCollectionById(this.selltoken.collection).subscribe(collection => {
          console.log("collection_id: ", collection[0]?.id)
          this.collection_id = collection[0]?.id ? collection[0]?.id: "none";
        })
      }
      this.SelltokenService.getAllOfferHistory(this.selltoken.uid).subscribe(resOffer => {
        console.log("offerGet", resOffer)
        this.offerHistory = resOffer
        this.loading = false;
      })
      this.SelltokenService.getAllBidHistory(this.selltoken.uid).subscribe( (res) => {
        this.bidHistory = res
      })
      if (this.selltoken.collection) {
        this.SelltokenService.getCollectionById(this.selltoken.collection).subscribe((data: any) => {
          this.increment = data[0]?.data?.increment ? data[0]?.data?.increment:1;
        })
      }

      if (selltoken.tokenType == 0)
      {
        if (this.promotionAssets.length == 0)
        {
          this.updatePromotion(selltoken);

        }
      }

      if (this.selltoken?.runart?.name)
        this.SelltokenService.getPromotionLink(this.selltoken?.runart?.name).then(
          (data) =>{
            if (data.exists)
            {
              this.promotionData = data.data()
            }

          }
        )

        this.authService.getServerTime().then( result =>
          {
            var serverTime = result['millionseconds'] ;
            var times = this.selltoken.auctionEndTime;
            this.countdownTime = times.seconds - serverTime/1000;
            this.intervalTime = times.seconds - serverTime/1000;
            clearInterval(this.interval)
            if (this.intervalTime > 0) {
              this.interval = setInterval(() => {
                this.intervalTime -= 1
              }, 1000)
            }
            if (this.countdownTime < 0)
            {
              //auction expired .
              //check choosen auction.
              this.isAuctionExpired = true;
            }
            this.updateTimeline();
          }
          ).catch( err=>{
            this.isAuctionExpired = true;
          });
      //}
      console.log(selltoken);
      this.htmlContent = this.selltoken.additionalInfo;
      this.videoUrl = this.selltoken?.videoUrl?.split('v=')[1];
      const ampersandPosition = this.videoUrl?.indexOf('&');
      if (ampersandPosition !== -1) {
        this.videoUrl = this.videoUrl?.substring(0, ampersandPosition);
      }
      this.currentDonationPercent = Number((100 * this.selltoken.currentDonation) / this.selltoken.targetInEur).toFixed(0);
      this.missingDonation = Number(this.selltoken.targetInEur - this.selltoken.currentDonation).toFixed(2);

      return this.authService.user$;
      })).pipe(
        switchMap((user) => {
          this.user = user;
          let notifications
          let uid = this.user.uid
          if (this.selltoken.notifications && this.selltoken.notifications.includes(uid)) {
            console.log("UPDATEONTI")
            notifications = this.selltoken.notifications.filter(function(value, index, arr){
              return value != uid;
            });
            this.SelltokenService.updateNotification(this.selltoken.uid, notifications).then(() => {})
          }
          if ( !this.selltoken.buyNow && this.selltoken?.status == 3 && this.selltoken?.auctionPaymail)
          {
            // get paymail address.
            this.SelltokenService.getSellTokenBidEscrowAddressAndMoneyChanges(this.selltoken.uid,this.selltoken.auctionPaymail).subscribe(
              (res) => {

                var myBidHistory:Array<BidHistory> = res;
                if (myBidHistory.length > 0)
                  this.lastBidHistory = myBidHistory[0];
                if ( this.lastBidHistory == null || this.lastBidHistory?.escrowAddress == null)
                {
                  this.selltokenEuro = 0;
                  this.selltokenCoins = 0;
                }else
                {
                  // get last escrow money
                  var address = this.lastBidHistory.escrowAddress.address;
                  this.escrowAddress = this.lastBidHistory.escrowAddress;
                  this.withdrawSelltokenCoinsService.checkWalletBalance(address,false).subscribe(
                    (req) => {
                      this.selltokenCoins = req.confirmed + req.unconfirmed;
                      console.log('selltokenCoins=' + this.selltokenCoins);

                      this.subs$.push(this.bsvService.getCurrentBsvPriceInUsd().subscribe((res: any) => {
                        this.selltokenEuro = this.countReceivePrice(res.rate, this.selltokenCoins);
                      }));
                      this.SelltokenService.getSingleselltoken(this.activatedRoute.snapshot?.params?.id).subscribe((selltoken) => {
                        this.selltoken = selltoken;
                      })
                      this.stateService.changeState('normal');
                    }
                  )
                }

                this.stateService.changeState('normal');
              })

          }
          if ( this.selltoken.buyNow || this.selltoken.status == 2 || this.selltoken.status == 4 )
          {
            this.withdrawSelltokenCoinsService.checkWalletBalance(this.selltoken?.bsvAddress?.address,false).subscribe((req) => {
              this.selltokenCoins = req.confirmed + req.unconfirmed;
              this.subs$.push(this.bsvService.getCurrentBsvPriceInUsd().subscribe((res: any) => {
                this.selltokenEuro = this.countReceivePrice(res.rate, this.selltokenCoins);
              }));
              this.SelltokenService.getSingleselltoken(this.activatedRoute.snapshot?.params?.id).subscribe((selltoken) => {
                this.selltoken = selltoken;
              })
              this.stateService.changeState('normal');
            })
            this.escrowAddress = this.selltoken.bsvAddress;
          }
          if ( !this.user?.uid || !this.selltoken?.auctionPaymail )
          {
            this.SelltokenService.getSingleselltoken(this.activatedRoute.snapshot.params.id).subscribe((selltoken) => {
              if (this.selltoken.currentTokenPrice != selltoken.currentTokenPrice) {
                this.ngOnInit()
              }
            })
            this.stateService.changeState('normal');
             return;
          }
          this.stateService.changeState('normal');

          return this.shortLinkService.checkIfUserAlreadyCreatedShortLink(user?.uid, this.activatedRoute.snapshot?.params?.id);
        })
      ).subscribe((shortLink) => {
        this.shortLink = shortLink;
      })
      );
  }

  refreshSatoshi():void
  {
    this.isrefreshSatoshi = true;
    // this.withdrawSelltokenCoinsService.checkWalletBalance(this.selltoken?.bsvAddress?.address,false).subscribe((req) => {
    this.withdrawSelltokenCoinsService.checkWalletBalance(this.escrowAddress?.address,false).subscribe((req) => {
      this.selltokenCoins = req.confirmed + req.unconfirmed;
      this.subs$.push(this.bsvService.getCurrentBsvPriceInUsd().subscribe((res: any) => {
        this.selltokenEuro = this.countReceivePrice(res.rate, this.selltokenCoins);
      }));
      this.isrefreshSatoshi = false;
    })
  }
  async updatePromotion( selltoken): Promise<void>
  {
    var assets = {};
    assets['url'] = selltoken && selltoken.photo_url!? selltoken.photo_url : selltoken?.runart?.image ?  this.sanitize(selltoken.runart?.image) : 'assets/token_land.png';
    assets['type'] = 'image';
    this.promotionAssets.push(assets);
    for (var i = 0; i < selltoken.runart.assetIds.length;  i++)
    {
      var assetTxid = selltoken.runart.assetIds[i];
      var assets = {};
      assets['url'] = "https://media.bitcoinfiles.org/" + assetTxid.txtid;
      assets['type'] = 'image';
      this.promotionAssets.push(assets);
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
    };
    setTimeout(() => {
      if (this.myCarousel)
      {
        this.myCarousel.pause();
        if (selltoken?.defaultSelected)
        {
          this.myCarousel.select("ngb-slide-" + selltoken.defaultSelected);
          this.myCarousel.activeId = "ngb-slide-" + selltoken.defaultSelected;
        }

      }
    }, 2000);
  }
  promotionLoaded($event): void
  {
    console.log('loaded promotion');
    this.isPromotionLoaded = true;
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

    this.statusTimeLine.forEach( (res) => {
      if (status.toLowerCase() == res.status.toLowerCase())
        res.color = '#2ea8fd';
      else
       res.color = '#8dd0ff';

    })
  }
  countReceivePrice(currentPrice: number, amountInSatoshis: number): number {
    return (amountInSatoshis / 100000000) * (currentPrice);
  }

  shareselltoken(): void {
    if (this.user && this.selltoken.status === SelltokenStatus.APPROVED) {
      this.loading = true;
      //console.log('USER', this.user);
      this.http.get(`https://api.polynym.io/getAddress/` + this.user.paymail, {

          }).toPromise().then(
            (res) => {
              if ( res['address'])
              {
                var bsvPaymail = res['address'];
                this.subs$.push(this.shortLinkService
                  .createShortLink(
                    window.location.href,
                    this.user?.uid,
                    this.selltoken?.uid,
                    // this.campaign.client_url,
                    // this.campaign.brandName,
                    bsvPaymail,
                    this.user?.email)
                  .subscribe(async (res: any) => {
                  this.shortLink = res.shortenedUrl;
                  this.clipBoardService.copy(res.shortenedUrl?.short);
                  this.clipBoardService.copyFromContent(res.shortenedUrl?.short);
                  this.clipBoardService.copy(res.shortenedUrl?.short);
                  this.clipBoardService.copy(res.shortenedUrl?.short);
                  this.clipBoardService.copy(res.shortenedUrl?.short);
                  this.clipBoardService.copy(res.shortenedUrl?.short);
                  this.loading = false;
                  setTimeout(() => {
                      this.clipBoardService.copy(this.shortLink?.short);
                      this.copyToClipboardButton?.onClick.emit();
                    }, 1000);
                }));
              }
            }
      );

    } else if (this.selltoken.status !== SelltokenStatus.APPROVED) {
      this.toastrService.error(this.translateService.instant('Auction is not available to share'));
    } else {
      this.toastrService.error(this.translateService.instant('You must login to share the links'));
    }
  }


  copyToClipboardClicked(): void {
    this.clipBoardService.copy(this.shortLink?.short);
    this.toastrService.success(this.translateService.instant('selltokens.detail.shortlink-has-been-copied-to-clipboard'));
  }

  saveAdditionalInfo(): void {
    this.SelltokenService.updateAdditionalInfo(this.selltoken.uid, this.htmlContent).then(response => {
      console.log(response);
    });
  }

  editselltoken(): void {

  }
  goToTransferPageForceComplete()
  {
    const ref = this.dialogService.open(SelltokenForceTransferDialogComponent, {
      header: this.translateService.instant('Make Complete'),
      width: 'auto',
      data: {
        isMB: true,
        billinguser: this.selltoken.auctionPaymail,
        amount: this.selltoken.orderAmount,
        bsvAddress: this.user.bsvAddress.address,
        address: this.escrowAddress,
        ouruserwallet: this.selltoken.bsvAddress.address,
        satoshi: this.selltokenCoins,
        donateAddress: this.selltoken.donateAddress? this.selltoken.donateAddress:'',
        type: 0
      }
    });
    ref.onClose.subscribe((response) => {
      if (response) {
        this.selltoken.status = SelltokenStatus.TOKEN_TRANSFERED;
        this.SelltokenService.createOrUpdateselltoken(this.selltoken);
      }
    });
  }
  goToTransferPage(): void {
    if (this.selltoken.tokenType == 1){
      const dataSent = {
        isMB: true,
        asset: this.selltoken.asset.paymailAlias + "@moneybutton.com",
        billinguser: this.selltoken.auctionPaymail,
        amount: this.selltoken.orderAmount,
        bsvAddress: this.user.bsvAddress.address
      };
      console.log("MB data", dataSent);
      const ref = this.dialogService.open(SelltokenTransferDialogComponent, {
        header: this.translateService.instant('selltokens.detail.confirmation'),
        width: 'auto',
        data: {
          isMB: true,
          asset: this.selltoken.asset.paymailAlias + "@moneybutton.com",
          billinguser: this.selltoken.auctionPaymail,
          amount: this.selltoken.orderAmount,
          bsvAddress: this.user.bsvAddress.address,
          address: this.escrowAddress,
          ouruserwallet: this.selltoken.bsvAddress.address,
          satoshi: this.selltokenCoins,
          donateAddress: this.selltoken.donateAddress? this.selltoken.donateAddress:'',
          type: 0
        }
      });
      ref.onClose.subscribe((response) => {
        if (response) {
          this.selltoken.status = SelltokenStatus.TOKEN_TRANSFERED;
          this.SelltokenService.createOrUpdateselltoken(this.selltoken);
        }
      });
    }
    else if (this.selltoken.tokenType == 0)
    {

      const ref = this.dialogService.open(SelltokenTransferDialogComponent, {
        header: this.translateService.instant('selltokens.detail.confirmation'),
        width: 'auto',
        data: {
          isMB: false,
          isArt: true,
          location:this.selltoken.runart.location,
          buyerAddress:this.selltoken.auctionPaymail,
          address: this.escrowAddress,
          ouruserwallet: this.selltoken.bsvAddress.address,
          satoshi: this.selltokenCoins,
          type:1,
          percentage:this.selltoken.runart.percentage,
          feeowneraddress:this.selltoken.runart.feeowneraddress,
          donateAddress: this.selltoken.donateAddress? this.selltoken.donateAddress:'',

        }
      });
      ref.onClose.subscribe((response) => {
        if (response) {
          this.selltoken.status = SelltokenStatus.TOKEN_TRANSFERED;
          //this.selltoken.isShowBoard = false;
          this.SelltokenService.createOrUpdateselltoken(this.selltoken);
        }
      });
    }else {
      var amount = this.selltoken.orderAmount;
      for (var i  = 0; i < this.selltoken.runnft.decimals; i++) {
        amount *= 10
      }
      const ref = this.dialogService.open(SelltokenTransferDialogComponent, {
        header: this.translateService.instant('selltokens.detail.confirmation'),
        width: 'auto',
        data: {
          isMB: false,
          isArt:false,
          amountReal:this.selltoken.orderAmount,
          amount:amount,
          type:0,
          location:this.selltoken.runnft.location,
          buyerAddress:this.selltoken.auctionPaymail,
          address: this.escrowAddress,
          ouruserwallet: this.selltoken.bsvAddress.address,
          satoshi: this.selltokenCoins,
          donateAddress: this.selltoken.donateAddress? this.selltoken.donateAddress:'',

        }
      });
      ref.onClose.subscribe((response) => {
        if (response) {
          this.selltoken.status = SelltokenStatus.TOKEN_TRANSFERED;
          //this.selltoken.isShowBoard = false;
          this.SelltokenService.createOrUpdateselltoken(this.selltoken);
        }
      });
    }
  }
  openCloseDialog(): void {
      console.log('Auction address is:', this.selltoken?.bsvAddress?.address)
      const ref = this.dialogService.open(SelltokenCloseDialogComponent, {
        header: this.translateService.instant('selltokens.detail.confirmation'),
        width: 'auto',
        data: {
          type: this.selltoken.tokenType,
          status: this.selltoken.status,
          asset: this.selltoken.asset?.paymailAlias + "@moneybutton.com",
          billinguser: this.selltoken.auctionPaymail,
          amount: this.selltoken.orderAmount,
          bsvAddress: this.user.bsvAddress.address
        }
      });

      ref.onClose.subscribe((response) => {
        if (response) {
          console.log("return");
          this.stateService.changeState('loading');
          if ( this.selltoken?.bsvAddress?.privateKey &&
            this.user?.bsvAddress.address &&
            this.selltoken?.bsvAddress?.address
          ) {
            console.log("test");
            this.userService.getUserPaymail(this.user).then(
              (res) =>
              {
                if ( res['address'] )
                {
                  var address = res['address'];
                  this.withdrawSelltokenCoinsService.checkWalletBalance(this.selltoken.bsvAddress.address,true)
                  .pipe(switchMap(
                    res => {
                      this.withdrawBalance = (res.confirmed + res.unconfirmed);
                      console.log('withdrawBalance', this.withdrawBalance);

                      if (this.withdrawBalance == 0)
                      {
                        this.stateService.changeState('normal');
                        this.toastrService.success(this.translateService.instant('Your auction has been closed'));
                        this.selltoken.status = SelltokenStatus.ENDED;
                        this.selltoken.isShowBoard = false;
                        this.SelltokenService.createOrUpdateselltoken(this.selltoken);
                        return;
                      }
                      return this
                        .withdrawSelltokenCoinsService
                        .sendSelltokensCoinsToUserWallet(
                          this.selltoken.uid,
                          address,
                          this.selltoken.bsvAddress.address
                        );
                    }
                  ))
                  /*
                  .pipe(
                  switchMap(res => {
                    return this.userService
                      .sendWithdrawTransactionToTxt(
                        this.withdrawBalance,
                        this.user.email,
                        res?.tx,
                        this.user.uid,
                        false,
                        window.location.href,
                        this.selltoken?.bsvAddress?.address,
                        address,
                        res.fee,
                        false)
                  })
                )
                */
                .subscribe((res: any) => {
                  console.log(res);
                  this.stateService.changeState('normal');
                  this.toastrService.success(this.translateService.instant('selltokens.detail.coins-has-been-successfully-sent-to-your-user-wallet'));
                  this.selltoken.status = SelltokenStatus.ENDED;
                  this.selltoken.isShowBoard = false;
                  this.SelltokenService.createOrUpdateselltoken(this.selltoken);
                }, (err) => {
                  console.log(err);
                  this.stateService.changeState('normal');
                  this.toastrService.error(this.translateService.instant('selltokens.detail.coins-were-not-sent-to-your-user-wallet-due-to-error'));
                });
                }else {
                  this.toastrService.error("Can't get paymail address!");
                  this.stateService.changeState('normal');
                }
                this.stateService.changeState('normal');

              }
            ).catch(err =>
              {
                this.toastrService.error("Can't get paymail address");
                this.stateService.changeState('normal');
              })

          }else{
            this.toastrService.error(this.translateService.instant('Unexpected error occurs!'));
            this.stateService.changeState('normal');
            //this.selltoken.status = SelltokenStatus.ENDED;
            //this.selltoken.isShowBoard = false;
            //this.SelltokenService.createOrUpdateselltoken(this.selltoken);
          }
        }
      });
  }

  bidOnToken(): void {
    console.log("countdownTime:", this.countdownTime);
    this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.toastrService.info("You should login first in order to bid");
          //this.router.navigate(['auth/login']);
          this.authService.getShell().actionLogin();
        }
        else{
          let notifications = []
          this.offerHistory.forEach(element => {
            if (element.senderUid && element.senderUid != this.user.uid) {
              notifications.push(element.senderUid)
            }
          });
          this.bidHistory.forEach(element => {
            if (element.senderUid && element.senderUid != this.user.uid) {
              notifications.push(element.senderUid)
            }
          });
          notifications.push(this.selltoken.userId)
          console.log("noti: ", notifications)
          const ref = this.dialogService.open(BidDialogComponent, {
            header: 'Bid',
            baseZIndex: 10,
            style: {
              background: 'white'
            },
            data: {
              totalBidCount: this.selltoken?.totalBidCount? this.selltoken.totalBidCount : 0,
              tokenPrice: this.selltoken?.currentTokenPrice,
              selltokenId: this.selltoken?.uid,
              selltokenOwner: this.selltoken?.userId,
              donateAddress: this.donateAddress,
              collectionId: this.selltoken?.collection,
              increment: this.increment,
              countdownTime: this.intervalTime,
              notifications: notifications,
              collection_id: this.collection_id
            }
          });
        }
      })
    ).subscribe( data=>{
      console.log(data);
      this.stateService.changeState('normal');

    }

    );
  }

  offerToken(): void {
    this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.toastrService.info("You should login first in order to bid");
          //this.router.navigate(['auth/login']);
          this.authService.getShell().actionLogin();
        }
        else{
          var notifications = []
          this.offerHistory.forEach(element => {
            if (element.senderUid && element.senderUid != this.user.uid) {
              notifications.push(element.senderUid)
            }
          });
          this.bidHistory.forEach(element => {
            if (element.senderUid && element.senderUid != this.user.uid) {
              notifications.push(element.senderUid)
            }
          });
          notifications.push(this.selltoken.userId)
          console.log("noti: ", notifications)
          const ref = this.dialogService.open(OfferDialogComponent, {
            header: 'Offer',
            baseZIndex: 10,
            style: {
              background: 'white'
            },
            data: {
              uid: this.selltoken.uid,
              notifications: notifications,
              collection_id: this.collection_id,
              owner_mb:this.selltoken.userId
            }
          });
        }
      })
    ).subscribe( data=>{
      console.log(data);
      this.stateService.changeState('normal');
    });
  }


  buyNowOnToken(): void {
    this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        this.stateService.changeState('normal');
        if (!loggedIn) {
          this.toastrService.info("You should login first in order to buy");
          this.authService.getShell().actionLogin();
        }else{
          const ref = this.dialogService.open(BuyNowDialogComponent, {
            header: this.selltoken?.title,
            baseZIndex: 10,
            style: {
              background: 'white'
            },
            data: {
              totalBidCount: this.selltoken?.totalBidCount? this.selltoken.totalBidCount : 0,
              tokenPrice: this.selltoken?.currentTokenPrice,
              buyNowPrice: this.selltoken?.buyNowPrice,
              selltokenId: this.selltoken?.uid,
              selltokenOwner: this.selltoken?.userId,
              auctionBsvAddress: this.selltoken.bsvAddress.address,
              percentage: this.selltoken?.runart?.percentage?this.selltoken?.runart?.percentage:0,
              donateAddress: this.donateAddress,
              feeowneraddress: this.selltoken?.runart?.feeowneraddress?this.selltoken?.runart?.feeowneraddress:'',

            }
          });
        }
      })
    ).subscribe( data=>{
      console.log("BUYNOW token exit dialog", data);

      //this.selltoken.status = SelltokenStatus.APPROVED;
      //this.SelltokenService.createOrUpdateselltoken(this.selltoken);

      this.stateService.changeState('normal');
    }
    );
  }

  buyNowOnTokenOffer(): void {
    this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        this.stateService.changeState('normal');
        if (!loggedIn) {
          this.toastrService.info("You should login first in order to buy");
          this.authService.getShell().actionLogin();
        }else{
          const ref = this.dialogService.open(BuyNowDialogComponent, {
            header: this.selltoken?.title,
            baseZIndex: 10,
            style: {
              background: 'white'
            },
            data: {
              totalBidCount: this.selltoken?.totalBidCount? this.selltoken.totalBidCount : 0,
              tokenPrice: this.selltoken?.currentTokenPrice,
              buyNowPrice: this.selltoken?.offerPrice,
              selltokenId: this.selltoken?.uid,
              selltokenOwner: this.selltoken?.userId,
              auctionBsvAddress: this.selltoken.bsvAddress.address,
              percentage: this.selltoken?.runart?.percentage?this.selltoken?.runart?.percentage:0,
              donateAddress: this.donateAddress,
              feeowneraddress: this.selltoken?.runart?.feeowneraddress?this.selltoken?.runart?.feeowneraddress:'',

            }
          });
        }
      })
    ).subscribe( data=>{
      console.log("BUYNOW token exit dialog", data);

      //this.selltoken.status = SelltokenStatus.APPROVED;
      //this.SelltokenService.createOrUpdateselltoken(this.selltoken);

      this.stateService.changeState('normal');
    }
    );
  }

  handleEvent($event): void {
    if ($event.action == "done")
    {
      this.isAuctionExpired = true;
      this.updateTimeline();
    }
  }
  openDonationsDialog(): void {
    const ref = this.dialogService.open(DonationsTableComponent, {
      header: this.translateService.instant('selltokens.detail.contributions'),
      width: '90%',
      height: '100%',
      baseZIndex: 10,
      style: {
        background: 'white'
      },
      data: {
        selltokenId: this.selltoken?.uid,
        selltokenOwner: this.selltoken?.userId
      }
    });
  }

  showReturnDialog(): void {
    const ref = this.dialogService.open(WithDrawDialogComponent, {
      header: 'WithDraw',
      width: '50%',
      baseZIndex: 10,
      style: {
        background: 'white'
      },
      data: {
        preferredAddress: this.user?.withdrawalBsvAddress,
        satoshi: this.selltokenCoins,
        address: this.escrowAddress,
        bidHistoryID: this.lastBidHistory.id,
        sellTokenID: this.selltoken.uid,
        bidHistory: this.lastBidHistory,
        paymail: this.selltoken.auctionPaymail,
        userWalletAddress: this.user.bsvAddress.address
      }

    });
    ref.onClose.subscribe((response) => {
      if (response) {
        // update  remove address.

      }
    });
  }

  goToDonatePage(): void {
      this.router.navigate(['auction',this.selltoken.uid, 'buy']);
  }

  onInput(event): void {
    this.totalAmount = event.value;
  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
    clearInterval(this.interval)
  }


  formatDate({ date, formatStr, timezone }): string {
    var dateV =  new Date(date);
    var strR = "<div class='css-1minwi3'>";
    var isNew = false;
    if (dateV.getUTCMonth() != 0)
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>"+ dateV.getUTCMonth() +"</div> <div class='css-hswzdu'>Months</div> </div>"
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
    if (dateV.getUTCSeconds() != 0 || isNew == true)
    {
      strR += "<div class='css-vurnku'> <div class='css-rivphl'>" +  dateV.getUTCSeconds()  + "</div> <div class='css-hswzdu'>Seconds</div> </div>"
      isNew = true;
    }
    strR += "</div>";
    return strR;
  }



  getRealSupply(supply:number, decimal:number)
  {
    var su = supply;
    for (var i  = 0; i < decimal; i++) {
          su /= 10
     }

     return su.toFixed(decimal);
  }
  setDefault(): void {
    if (this.myCarousel)
    {
      var defaultId = this.myCarousel.activeId;
      defaultId = defaultId.replace("ngb-slide-", "");
      this.SelltokenService.updateDefaultSelect(this.selltoken.uid, defaultId).then(response => {
        console.log(response);
        this.toastrService.info("Changed the default showing info","Success");
      });
    }
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
  setFavoriteselltoken($event): void{
    if (this.user){
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

  comment() {
    this.authService.user$.pipe(
      take(1),
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          this.toastrService.info("You should login first in order to bid");
          //this.router.navigate(['auth/login']);
          this.authService.getShell().actionLogin();
        }
        else{
          const ref = this.dialogService.open(CommentDialogComponent, {
            header: 'Comment',
            baseZIndex: 10,
            style: {
              background: 'white'
            },
            data: {
              uid: this.selltoken.uid,
              owner_mb: this.selltoken.userId
            }
          });
        }
      })
    ).subscribe( data=>{
      console.log(data);
      this.stateService.changeState('normal');
    });
  }
}
