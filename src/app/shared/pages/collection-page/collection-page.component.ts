import {Component, OnDestroy, OnInit} from '@angular/core';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {of, Subscription} from 'rxjs';
import {AppStateService} from '../../services/app-state.service';
import {faCat, faFutbol, faGift, faGraduationCap, faMagic, faMusic, faPlane, faRobot, faUsers} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {IpAddressService} from '../../services/ip-address.service';
import {switchMap} from 'rxjs/operators';
import {FilterService} from '../../../selltokens/services/filter.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {ICategory} from '../../../selltokens/models/category.model';
import {CategoriesService} from '../../services/categories.service';
import {FavoritesActivatedService} from '../../../selltokens/services/favorites-activated.service';
import {PaginationService} from '../../services/pagination.service';
import {ToastrService} from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import { CollectionsService } from '../../services/collections.service';
import { ICollection } from 'src/app/selltokens/models/collection.model';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { environment } from "../../../../environments/environment"


@Component({
  selector: 'app-collection-page',
  templateUrl: './collection-page.component.html',
  styleUrls: ['./collection-page.component.scss'],
  providers: [FilterService]
})
export class CollectionPageComponent implements OnInit, OnDestroy {

  /*popularselltokens: ISelltoken[] = [];
  newselltokens: ISelltoken[] = [];
  nearselltokens: ISelltoken[] = [];
  subs$: Subscription[] = [];
  user: User;
  */

  featuredSellTokens: ICollection[] = [];

  categories: ICategory[] = [];
  $categories: Subscription;
  $collections: Subscription;

  display = false;
  selectedCategories: any[] = [];
  activatedFilter = [];
  filterTextVisibility: boolean;
  user: User;
  heart = false;

  // icons
  faCat = faCat;
  faGraduationCap = faGraduationCap;
  faUsers = faUsers;
  faGift = faGift;
  faMusic = faMusic;
  faFutbol = faFutbol;
  faRobot = faRobot;
  faPlane = faPlane;
  faMagic = faMagic;

  idFeature: string;
  selectedCollection: ICollection;

  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = environment.baseUrl;

  constructor(private SelltokenService: SelltokenService,
              private stateService: AppStateService,
              private categoriesService: CategoriesService,
              private collectionsService: CollectionsService,
              private router: Router,
              private route: ActivatedRoute,
              private paginationService: PaginationService,
              private favoritesActivatedService: FavoritesActivatedService,
              private ipService: IpAddressService,
              private filterService: FilterService,
              private toastrService: ToastrService,
              private authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private translateService: TranslateService,
              private afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.idFeature =   this.route.snapshot.params.id;
    this.value += "/" + this.idFeature + "/collection"
    this.$categories = this.categoriesService.currentCategories.subscribe(res =>
      {
        this.categories.push(...res);
      });
    this.authService.user$.subscribe((res) => {
      this.user = res;
      this.$collections = this.collectionsService.currentCategories.subscribe(res =>
      {
          res.forEach(collection => {
            if ( this.idFeature != collection.id)
              this.featuredSellTokens.push(collection)
            else {
              this.selectedCollection = collection;
              console.log("user++", this.user)
              console.log("selectedCollection: ", this.selectedCollection)
              let notifications
              let uid = this.user?.uid
              if (this.selectedCollection.notifications && this.selectedCollection.notifications.includes(uid)) {
                console.log("UPDATEONTI")
                notifications = this.selectedCollection.notifications.filter(function(value, index, arr){ 
                  return value != uid;
                });
                console.log("notification: ", notifications)
                this.SelltokenService.updateNotificationForCollection(this.selectedCollection.documentId, notifications).then(() => {})
              }
            }
          });
      });
    });
    
    // this.authService.user$.subscribe((res) => {
    //   this.user = res;
    // });  
  }
  startAuction(): void {
    this.user ? this.router.navigate(['auction/create']) : this.router.navigate(['auth/login']);
  }
  scroll(el: HTMLElement): void {
    el.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
  toggleSidebar(): void {
    this.display = !this.display;
  }
  ngOnDestroy(): void {
    this.$categories.unsubscribe();
  }
  async onFilterCategoriesClick(): Promise<void> {
    this.activatedFilter = [];
    await this.selectedCategories.forEach(val => this.activatedFilter.push(val.id));
    this.filterService.changeState(this.activatedFilter);
    console.log(this.activatedFilter);
    if (this.activatedFilter.length > 0) {
      if (!this.heart) {
        this.paginationService.getInitFilteredData(this.activatedFilter);
      }
    } else if (!this.heart) {
      this.paginationService.getRealInitData();
    } else {
      this.paginationService.getUserFavoritesselltokens(this.user.favoritesselltokens);
    }
    this.display = false;
  }

  filterFavoriteselltokens(): void {
    console.log("click heart!!!");
    if (this.user && this.user?.favoritesselltokens?.length > 0) {
      this.heart = !this.heart;
      this.favoritesActivatedService.changeState(this.heart);
    }else if (this.user && !this.user?.favoritesselltokens) {
      this.toastrService.error("There is no favorites");
    }
    else if (!this.user) {
      this.toastrService.error(this.translateService.instant('selltokens.public-selltokens-page.you-must-be-logged-in'));
    }
    else if (this.user?.favoritesselltokens?.length === 0) {
      this.toastrService.error(this.translateService.instant('selltokens.donate-page.you-have-no-favorite-selltokens'));
    }
  }

}
