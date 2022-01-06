import {Component, OnDestroy, OnInit, HostListener} from '@angular/core';
import {SelltokenService} from '../../../selltokens/services/selltoken.service';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {of, Subscription} from 'rxjs';
import {AppStateService} from '../../services/app-state.service';
import {
  faCat,
  faFutbol,
  faGift,
  faGraduationCap,
  faMagic,
  faMusic,
  faPlane,
  faRobot,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {IpAddressService} from '../../services/ip-address.service';
import {switchMap} from 'rxjs/operators';
import {FilterService} from '../../../selltokens/services/filter.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {ICategory} from '../../../selltokens/models/category.model';
import {CategoriesService} from '../../../shared/services/categories.service';
import {FavoritesActivatedService} from '../../../selltokens/services/favorites-activated.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {CollectionsService} from '../../services/collections.service';
import {ICollection} from 'src/app/selltokens/models/collection.model';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [FilterService]
})
export class LandingPageComponent implements OnInit, OnDestroy {

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

  slideConfig = {
    'slidesToShow': 4,
    'slidesToScroll': 1,
    'dots': true,
  };

  innerWidth: any;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.innerWidth = window.innerWidth;
    console.log('width: =====>', this.innerWidth);
    this.resize();
  }

  constructor(private SelltokenService: SelltokenService,
              private stateService: AppStateService,
              private categoriesService: CategoriesService,
              private collectionsService: CollectionsService,
              private router: Router,
              private paginationService: PaginationService,
              private favoritesActivatedService: FavoritesActivatedService,
              private ipService: IpAddressService,
              private filterService: FilterService,
              private toastrService: ToastrService,
              private authService: AuthService,
              public activatedRoute: ActivatedRoute,
              private translateService: TranslateService,
              private afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.resize();
    this.$categories = this.categoriesService.currentCategories.subscribe(res => {
      console.log('this is test! =====>');
      this.categories.push(...res);
    });
    this.authService.user$.subscribe((res) => {
      this.user = res;
    });

    this.$collections = this.collectionsService.currentCategories.subscribe(res => {
      console.log('this is test! =====>');
      this.featuredSellTokens = [...res];
    });
    this.authService.user$.subscribe((res) => {
      this.user = res;
    });
  }

  resize() {
    if (this.innerWidth < 1150 && this.innerWidth > 832) {
      this.slideConfig = {
        'slidesToShow': 3,
        'slidesToScroll': 1,
        'dots': true,
      };
    } else if (this.innerWidth < 832 && this.innerWidth > 640) {
      this.slideConfig = {
        'slidesToShow': 2,
        'slidesToScroll': 1,
        'dots': true,
      };
    } else if (this.innerWidth < 640) {
      this.slideConfig = {
        'slidesToShow': 1,
        'slidesToScroll': 1,
        'dots': true,
      };
    } else {
      this.slideConfig = {
        'slidesToShow': 4,
        'slidesToScroll': 1,
        'dots': true,
      };
    }
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
    console.log('click heart!!! =====>');
    if (this.user && this.user?.favoritesselltokens?.length > 0) {
      this.heart = !this.heart;
      this.favoritesActivatedService.changeState(this.heart);
    } else if (this.user && !this.user?.favoritesselltokens) {
      this.toastrService.error('There is no favorites =====>');
    } else if (!this.user) {
      this.toastrService.error(this.translateService.instant('selltokens.public-selltokens-page.you-must-be-logged-in'));
    } else if (this.user?.favoritesselltokens?.length === 0) {
      this.toastrService.error(this.translateService.instant('selltokens.donate-page.you-have-no-favorite-selltokens'));
    }
  }

  allCollections(): void {
    this.router.navigate(['/collections']);
  }

}
