import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from '../../../shared/services/categories.service';
import {ICategory} from '../../models/category.model';
import {Subscription} from 'rxjs';
import {FilterService} from '../../services/filter.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {UserService} from '../../../user/services/user.service';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {ToastrService} from 'ngx-toastr';
import {FavoritesActivatedService} from '../../services/favorites-activated.service';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-public-selltokens',
  templateUrl: './public-selltokens-page.component.html',
  styleUrls: ['./public-selltokens-page.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('0.35s ease-in-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('0.35s ease-in-out',
              style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class PublicSelltokensPageComponent implements OnInit, OnDestroy {
  categories: ICategory[] = [];
  $categories: Subscription;
  display = false;
  selectedCategories: any[] = [];
  activatedFilter = [];
  filterTextVisibility: boolean;
  user: User;
  heart = false;

  constructor(private categoriesService: CategoriesService,
              private filterService: FilterService,
              private cookieService: CookieService,
              private paginationService: PaginationService,
              private favoritesActivatedService: FavoritesActivatedService,
              private userService: UserService,
              private toastrService: ToastrService,
              public activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private translateService: TranslateService) {
    this.filterTextVisibility = false;
  }

  ngOnInit(): void {
    this.$categories = this.categoriesService.currentCategories.subscribe(res => this.categories.push(...res));
    this.authService.user$.subscribe((res) => {
      this.user = res;
    });
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
      this.paginationService.getInitData();
    } else {
      this.paginationService.getUserFavoritesselltokens(this.user.favoritesselltokens);
    }
    this.display = false;
  }

  filterFavoriteselltokens(): void {
    if (this.user && this.user?.favoritesselltokens?.length > 0) {
      this.heart = !this.heart;
      this.favoritesActivatedService.changeState(this.heart);
    } else if (!this.user) {
      this.toastrService.error(this.translateService.instant('selltokens.public-selltokens-page.you-must-be-logged-in'));
    }
    else if (this.user?.favoritesselltokens?.length === 0) {
      this.toastrService.error(this.translateService.instant('selltokens.donate-page.you-have-no-favorite-selltokens'));
    }
  }
}
