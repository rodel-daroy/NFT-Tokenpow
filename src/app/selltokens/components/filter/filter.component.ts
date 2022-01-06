import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ICategory} from '../../models/category.model';
import {AppStateService} from '../../../shared/services/app-state.service';
import {PaginationService} from '../../../shared/services/pagination.service';
import {FilterService} from '../../services/filter.service';
import {Subscription} from 'rxjs';
import {CategoriesService} from '../../../shared/services/categories.service';
import {FavoritesActivatedService} from '../../services/favorites-activated.service';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit, OnDestroy {
  @Input() favoritesselltokens: string[] = [];
  categories: ICategory[] = [{id: 'all',
    name: 'All',
    nameEN: 'All',
    marked: true}];
  activatedFilter: string[] = [];
  subs$: Subscription[] = [];
  isFavoriteActivated = false;

  constructor(private paginationService: PaginationService,
              private stateService: AppStateService,
              public categoriesService: CategoriesService,
              private favoritesActivatedService: FavoritesActivatedService,
              private activatedRoute: ActivatedRoute,
              private filterService: FilterService,
              public translateService: TranslateService) { }

  ngOnInit(): void {
    this.subs$.push(this.categoriesService.currentCategories.subscribe(res => {
      this.categories.push(...res);
      if (this.activatedRoute.snapshot.queryParams.category) {
        this.onCategoryClick(
          this.activatedRoute.snapshot.queryParams.category,
          res.find(x => x.id === this.activatedRoute.snapshot.queryParams.category)
        );
      }
    }));
    this.subs$.push(this.favoritesActivatedService.currentState.subscribe(res => {
      if (res !== this.isFavoriteActivated) {
        if (res === true) {
          console.log('TU SOM');
          this.paginationService.filterUserFavoritesselltokens(this.favoritesselltokens, this.activatedFilter);
        } else {
          if (this.activatedFilter.length > 0) {
            this.paginationService.getInitFilteredData(this.activatedFilter);
          } else {
            this.paginationService.getRealInitData();
          }
        }
      }

      this.isFavoriteActivated = res;
    }));

  }

  onCategoryClick(categoryId: string, category?: ICategory): void {
    console.log(categoryId);
    if (!this.isFavoriteActivated && category) {
      if (category?.id !== 'all') {
        category.marked = !category.marked;
        if (category.marked) {
          this.activatedFilter.push(category.id);
          this.filterService.changeState(this.activatedFilter);
        } else {
          this.activatedFilter = this.activatedFilter.filter(cat => cat !== category.id);
          this.filterService.changeState(this.activatedFilter);
        }

        if (this.activatedFilter.length > 0) {
          this.paginationService.getInitFilteredData(this.activatedFilter);
          this.categories.find(x => x.id === 'all').marked = false;
        } else {
          this.paginationService.getRealInitData();
          this.categories.find(x => x.id === 'all').marked = true;
        }
      } else if (category.id === 'all') {
        this.categories.find(x => x.id === 'all').marked = true;
        this.activatedFilter = [];
        this.filterService.changeState(this.activatedFilter);
        this.paginationService.getRealInitData();
        this.categories.map(cat => {
          if (cat.id !== 'all') {
            cat.marked = false;
          }
        });
      }
    } else if (category) {
      if (category.id !== 'all') {
        category.marked = !category.marked;
        if (category.marked) {
          this.activatedFilter.push(category.id);
          this.filterService.changeState(this.activatedFilter);
        } else {
          this.activatedFilter = this.activatedFilter.filter(cat => cat !== category.id);
          this.filterService.changeState(this.activatedFilter);
        }

        if (this.activatedFilter.length > 0) {
          this.paginationService.filterUserFavoritesselltokens(this.favoritesselltokens, this.activatedFilter);
          this.categories.find(x => x.id === 'all').marked = false;
        } else {
          console.log('ALL FAV');
          this.paginationService.getUserFavoritesselltokens(this.favoritesselltokens);
          this.categories.find(x => x.id === 'all').marked = true;
        }

      } else {
        console.log('ALL FAV');
        this.categories.find(x => x.id === 'all').marked = true;
        this.activatedFilter = [];
        this.filterService.changeState(this.activatedFilter);
        this.paginationService.getUserFavoritesselltokens(this.favoritesselltokens);
        this.categories.map(cat => {
          if (cat.id !== 'all') {
            cat.marked = false;
          }
        });
      }
    }

  }

  ngOnDestroy(): void {
    this.subs$.forEach(sub => sub.unsubscribe());
  }

}
