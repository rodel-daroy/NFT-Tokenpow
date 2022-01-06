import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelltokenService} from '../../../../services/selltoken.service';
import {ISelltoken} from '../../../../models/selltoken.model';
import {PhotoUrlService} from '../../../../services/photo-url.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {AppStateService} from '../../../../../shared/services/app-state.service';
import {AuthService} from '../../../../../auth/services/auth.service';
import {User} from '../../../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {CategoriesService} from '../../../../../shared/services/categories.service';
import {map, tap} from 'rxjs/operators';
import {ICategory} from '../../../../models/category.model';
import * as firebase from 'firebase/app';
import {CreateSelltokenDataService} from '../../services/create-selltoken-data.service';
import {SelltokenCountriesService} from '../../services/selltoken-countries.service';
import {CategoryAdapter} from '../../../../../shared/adapters/category-mapper.adapter';
import {SelltokenStatus} from '../../../../enums/selltoken-status.enum';
import {ThumbnailUrlService} from '../../../../services/thumbnail-url.service';
import {BsvPriceService} from '../../services/bsv-price.service';
import {CryptoService} from '../../../../../shared/services/crypto.service';
import {TranslateService} from '@ngx-translate/core';
import {AssetServices} from '../../../../../moneyassets/services/assets.service';
import {UserService} from '../../../../../user/services/user.service';
import {RunNftServices} from 'src/app/runnft/services/runnft.service';
import {IRunNft} from 'src/app/runnft/models/runnft.model';
import {DomSanitizer} from '@angular/platform-browser';
import {SelltokenType} from '../../../../enums/selltoken-type.enum';
import {IRunToken} from 'src/app/runtoken/models/runtoken.model';
import {RunTokenService} from 'src/app/runtoken/services/runtoken.service';
import {CollectionsService} from '../../../../../shared/services/collections.service';
import {ICollection} from 'src/app/selltokens/models/collection.model';
import {switchMap} from 'rxjs/operators';
import * as moment from 'moment';
import {OwnerGuard} from '../../../../../shared/guards/owner.guard';
import {IAssets} from '../../../../../moneyassets/models/assets.model';

@Component({
  selector: 'app-create-selltoken-page',
  templateUrl: './create-selltoken-page.component.html',
  styleUrls: ['./create-selltoken-page.component.scss'],
})
export class CreateSelltokenPageComponent implements OnInit, OnDestroy {
  $subs: Subscription[] = [];
  tokens: ISelltoken[] = [];
  nftart: IRunNft[] = [];
  nfttokens: IRunToken[] = [];

  url;
  thumbnailUrl;
  user: User;
  countries = [];
  categories: [];
  selltoken: ISelltoken = {};
  todayDate: Date = new Date();
  currentBsvPrice: number;
  isEditing = false;
  totalRecords: number;
  loadingToken: boolean;
  loadingNft: boolean;
  loadingNftToken: boolean;
  isNftLocked: boolean;
  isNftTokenLocked: boolean;
  selectedToken: ISelltoken;
  selectedArt: IRunNft;
  selectedRunToken: IRunToken;

  totalPrice: number;
  tokenType: SelltokenType;

  collections = [];
  selectedCollection: ICollection;

  constructor(
    private SelltokenService: SelltokenService,
    private userService: UserService,
    private photoUrlService: PhotoUrlService,
    private thumbnailUrlService: ThumbnailUrlService,
    private router: Router,
    private categoriesService: CategoriesService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private stateService: AppStateService,
    private authService: AuthService,
    private createselltokenDataService: CreateSelltokenDataService,
    private bsvPriceService: BsvPriceService,
    private toastrService: ToastrService,
    private cryptoService: CryptoService,
    private assetServices: AssetServices,
    private runnftServices: RunNftServices,
    private runtokenServices: RunTokenService,
    private selltokenCountriesService: SelltokenCountriesService,
    public translateService: TranslateService,
    private collectionService: CollectionsService) {
  }

  ngOnInit(): void {
    this.totalPrice = 0;
    // TODO: set id of selltoken to localstorage and check of editing by local storage
    this.$subs.push(
      this.bsvPriceService.getCurrentBsvPriceInBsv().subscribe((res) => (this.currentBsvPrice = (1 / res.rate)))
    );
    window.scrollTo(0, 0);
    if (this.activatedRoute.snapshot.queryParams.id) {
      console.log('QUERY =====>');
      this.isEditing = true;
      this.SelltokenService.getSingleselltoken(
        this.activatedRoute.snapshot.queryParams.id
      ).subscribe((res) => {
        this.createselltokenDataService.changeState(res);
        this.photoUrlService.changeUrl(res.photo_url);
        this.thumbnailUrlService.changeUrl(res.thumbnail_url);
        this.$subs.push(
          this.createselltokenDataService.currentselltokenData.subscribe((result) => (this.selltoken = result))
        );
      });
    } else {
      this.$subs.push(
        this.createselltokenDataService.currentselltokenData.subscribe((res) => {
          this.selltoken = res;
        })
      );
    }
    this.stateService.changeState('loading');
    this.$subs.push(
      this.categoriesService.currentCategories
        .pipe(
          map((categories: ICategory[]) => {
            return CategoryAdapter.fromDtoMultipleCategories(categories).filter(
              (cat: ICategory) => cat.visibleInCreationProcess === true
            );
          }),
          tap(console.log)
        )
        .subscribe((categories) => {
          this.categories = categories;
          this.stateService.changeState('normal');
        })
    );

    this.$subs.push(
      this.collectionService.currentCategories.subscribe((collections) => {
        this.collections = [...collections];
        this.stateService.changeState('normal');
      })
    );

    this.$subs.push(
      this.photoUrlService.currentUrl.subscribe((res) => (this.url = res))
    );
    this.$subs.push(
      this.thumbnailUrlService.currentUrl.subscribe((res) => (this.thumbnailUrl = res))
    );

    this.loadingToken = true;

    this.$subs.push(
      this.authService.user$.subscribe((res) => (this.user = res))
    );

    this.tokenType = SelltokenType.RUNART;

    this.assetServices.getWalletsAsset()
      .then((res) => {
        console.log('CreateSelltokenPage getWalletsAsset then =====>', res);
        for (let i = 1; i < res.length; i++) {
          if (res[i].asset_id === this.selltoken.asset_id) {
            this.selectedToken = res[i];
          }
          this.tokens.push(res[i]);
        }
        this.totalRecords = this.tokens.length;
        this.loadingToken = false;
      })
      .catch((err) => {
        this.toastrService.error(err.message);
      });

    this.loadingNft = true;
    this.loadingNftToken = true;
    this.isNftLocked = false;
    this.isNftTokenLocked = false;

    if (this.loadingNft && !this.isNftLocked) {
      this.isNftLocked = true;
      this.runnftServices.getRunNft1()
        .then(async (res) => {
          console.log('CreateSelltokenPage getRunNft1 then =====>', res);
          if (res.length === 0) {
            this.loadingNft = false;
          }
          for (let i = 0; i < res.length; i++) {
            res[i].id = i;
            await this.SelltokenService.getbyRunNft(res[i].origin, this.user.uid).subscribe(nft => {
              if (nft.length === 0) {
                this.nftart.push(res[i]);
                if (i === res.length - 1) {
                  this.totalRecords = this.nftart.length;
                  this.loadingNft = false;
                }
              } else {
                let count = 0;
                nft.forEach((element, j) => {
                  if (element.status === 4 && !element.auctionPaymail) {
                    count++;
                  }
                });
                if (count === nft.length) {
                  this.nftart.push(res[i]);
                }
              }
            });
          }
        })
        .catch((err) => {
          this.toastrService.error(err.message);
        });

    }

    /*
    this.$subs.push(this.authService.user$
    .pipe(
      switchMap((user) => {
        this.user = user;
        return this.userService.getUserselltokens(user.uid);
      })
    ).subscribe((res) => {
      let hash = {};
      res.forEach(element => {
          hash[element.assetId] = true;
      });
      this.assetServices.getWalletsAsset().then( res => {
        for ( let i=0; i < res.length; i++)
        {
          if ( !hash[res[i].id])
          {
            res[i].description = res[i].description.split('/newLineSeparator/').join('\n\n')
            this.assets.push(
              res[i]
            )
          }
        }
        this.totalRecords = this.assets.length;
        this.loading = false;
        //this.stateService.changeState('normal');
      }).catch(err => {
        this.toastrService.error(err.message);
      });;
    })
    );
     */
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getRealAmount(amount: number, decimal: number) {
    let am = amount;
    for (let i = 0; i < decimal; i++) am *= 10;
    return am;
  }

  async nextStep(): Promise<void> {
    console.log('IS EDITING =====>', this.isEditing);
    this.selltoken.categoriesIds = [];
    await this.selltoken.categories.forEach((category: any) => {
      this.selltoken.categoriesIds.push(category.id);
    });
    if (!this.selltoken.title || this.selltoken.title.length === 0) {
      this.toastrService.error('You need to type title.');
      return;
    }
    if (this.tokenType === SelltokenType.MBASSET &&
      (this.selltoken?.orderAmount <= 0 || this.selltoken?.orderAmount > parseInt(this.selectedToken.amount))) {
      console.log('this.selectedToken.amount =====>', this.selectedToken.amount);
      this.toastrService.error(' Amount of tokens sold should be more than (' + this.selectedToken.amount + ')');
      return;
    }
    if (this.tokenType === SelltokenType.RUNTOKEN && (this.selltoken?.orderAmount < 0 ||
      this.getRealAmount(this.selltoken?.orderAmount, this.selectedRunToken.decimals) > this.selectedRunToken.supply)) {
      this.toastrService.error('You don\'t have enough amount');
      return;
    }
    if (this.selltoken?.categories?.length > 0) {
      if (this.tokenType === SelltokenType.MBASSET) {
        this.selltoken.orderAmount = Math.floor(this.selltoken.orderAmount);
      }
      this.selltoken.currentTokenPrice = this.selltoken.orderAmount * this.selltoken.targetInEur;
      this.stateService.changeState('loading');
      this.selltoken.tokenType = this.tokenType;
      if (this.selltoken.tokenType === SelltokenType.MBASSET) {
        this.selltoken = Object.assign(this.selltoken, this.selectedToken);
        this.selltoken.assetEmited = 'moneybutton.com';
        this.selltoken.assetProtocol = 'SFP@0.1';
        this.selltoken.assetSentFrom = 'https://www.moneybutton.com';
      } else if (this.selltoken.tokenType === SelltokenType.RUNART) {
        this.selltoken.runart = {};
        this.selltoken.runart = this.selectedArt;
        this.selltoken.runart.name = this.selectedArt.name;
        this.selltoken.runart.author = this.selectedArt.author;
        this.selltoken.runart.image = this.selectedArt.image;
        this.selltoken.runart.location = this.selectedArt.location;
        this.selltoken.runart.origin = this.selectedArt.origin;
        this.selltoken.runart.percentage = this.selectedArt.percentage;
        this.selltoken.runart.feeowneraddress = this.selectedArt.feeowneraddress;
        this.selltoken.runart.editionNo = this.selectedArt.editionNo;
        this.selltoken.assetEmited = 'run.network';
        this.selltoken.assetProtocol = 'RUN@0.1';
        this.selltoken.assetSentFrom = 'https://run.netowrk';
      } else {
        this.selltoken.runnft = {};
        this.selltoken.runnft = this.selectedRunToken;
        this.selltoken.runnft.name = this.selectedRunToken.name;
        this.selltoken.runnft.supply = this.selectedRunToken.supply;
        this.selltoken.runnft.decimals = this.selectedRunToken.decimals;
        if (this.selectedRunToken?.avatar) {
          this.selltoken.runnft.avatar = this.selectedRunToken.avatar;
        }
        if (this.selectedRunToken?.image) {
          this.selltoken.runnft.image = this.selectedRunToken.image;
        }
        this.selltoken.assetEmited = 'run.network';
        this.selltoken.assetProtocol = 'RUN@0.1';
        this.selltoken.assetSentFrom = 'https://run.netowrk';
      }
      this.selltoken.description = this.selltoken.description;
      this.selltoken.photo_url = this.url;
      this.selltoken.status = SelltokenStatus.CREATION;
      this.selltoken.isShowBoard = false;
      if (this.user.roles.admin || this.user.roles.partner) {
        this.selltoken.status = SelltokenStatus.APPROVED;
        this.selltoken.isShowBoard = true;
      }
      this.selltoken.updatedAt = firebase.firestore.FieldValue.serverTimestamp();

      if (Number.isNaN(this.selltoken.orderAmount) || typeof this.selltoken.currentTokenPrice === 'undefined' ||
        Number.isNaN(this.selltoken.currentTokenPrice) || this.selltoken.orderAmount === 0 || this.selltoken.currentTokenPrice <= 0) {
        this.toastrService.error(' Please input price and amount');
        this.stateService.changeState('normal');
        return;
      }
      if (this.selectedCollection) {
        this.selltoken.collection = this.selectedCollection.id;
      } else {
        this.selltoken.collection = 'none';
      }
      if (!this.selltoken.description) {
        this.selltoken.description = null;
      }
      if (!this.isEditing) {
        console.log('TU SOM =====>');
        this.selltoken.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        this.selltoken.creators = 0;
        if (this.user.email) {
          this.selltoken.userEmail = this.user.email;
        }
        this.selltoken.userId = this.user.uid;
        this.selltoken.userName = this.user.firstName + ' ' + this.user.lastName;
        this.selltoken.userPhotoUrl = this.user.photoUrl;
        this.selltoken.totalSatoshisDonated = 0;
        this.selltoken.likes = 0;
        this.selltoken.totalContributions = 0;
        this.selltoken.currentDonation = 0;
        this.selltoken.userDescription = this.user?.description ? this.user.description : '';
        this.selltoken.userFacebook = this.user.facebookUrl ? this.user.facebookUrl : '';
        this.selltoken.userTwitter = this.user.twitterUrl ? this.user.twitterUrl : '';
        this.selltoken.bsvAddress = {};
        this.selltoken.bsvAddress.address = this.user.bsvAddress.address;
        this.selltoken.bsvAddress.privateKey = this.user.bsvAddress.privateKey;
        this.selltoken.bsvAddress.publicKey = this.user.bsvAddress.publicKey;

        // Create address for selltoken
        await this.SelltokenService.generateAddressForselltoken().subscribe((res) => {
            console.log('generateAddressForselltoken =====>', res);
            this.selltoken.bsvAddress = {};
            this.selltoken.bsvAddress.address = res.address;
            this.selltoken.bsvAddress.privateKey = this.cryptoService.set(res.privateKey);
            this.selltoken.bsvAddress.publicKey = res.publicKey;
          }
        );
      }

      await this.createselltokenDataService.changeState(this.selltoken);
      this.router.navigate(['auction/create/preview'])
        .then(() => this.stateService.changeState('normal'));
    } else {
      this.toastrService.error(
        this.translateService.instant('selltokens.create-selltoken-page.form-is-invalid')
      );
    }
  }

  ngOnDestroy(): void {
    this.$subs.forEach((sub) => sub.unsubscribe());
  }

  getRealSupply(supply: number, decimal: number) {
    let su = supply;
    for (let i = 0; i < decimal; i++) {
      su /= 10;
    }
    return su.toFixed(decimal);
  }

  onTabPanelClick(event): void {
    console.log('tab clicked =====>', event);
    switch (event) {
      case 1:
        this.tokenType = SelltokenType.MBASSET;
        break;
      case 0:
        this.selltoken.orderAmount = 1;
        this.tokenType = SelltokenType.RUNART;
        break;
      case 2:
        this.tokenType = SelltokenType.RUNTOKEN;
        if (this.loadingNftToken && !this.isNftTokenLocked) {
          this.isNftTokenLocked = true;
          this.runtokenServices
            .getWalletsAsset()
            .then((res) => {
              console.log('debug wallet assets!!! =====>');
              for (let i = 0; i < res.length; i++) {
                res[i].id = i;
                this.nfttokens.push(res[i]);
              }
              this.totalRecords = this.nfttokens.length;
              this.loadingNftToken = false;
            })
            .catch((err) => {
              this.toastrService.error(err.message);
            });
        }
        break;
    }
  }
}
