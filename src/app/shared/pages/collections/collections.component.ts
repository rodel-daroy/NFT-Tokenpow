import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {faCat, faFutbol, faGift, faGraduationCap, faMagic, faMusic, faPlane, faRobot, faUsers} from '@fortawesome/free-solid-svg-icons';
import {AuthService} from '../../../auth/services/auth.service';
import {User} from '../../../auth/models/user.model';
import {FilterService} from '../../../selltokens/services/filter.service';
import {ICategory} from '../../../selltokens/models/category.model';
import {CategoriesService} from '../../services/categories.service';
import {ActivatedRoute} from '@angular/router';
import { CollectionsService } from '../../services/collections.service';
import { ICollection } from 'src/app/selltokens/models/collection.model';


@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  providers: [FilterService]
})
export class CollectionsComponent implements OnInit, OnDestroy {

  featuredSellTokens: ICollection[] = [];

  $collections: Subscription;
  collections: any = []

  user: User;
  pageSize = 8
  count = 0

  constructor(
              private categoriesService: CategoriesService,
              private collectionsService: CollectionsService,
              private authService: AuthService,
              public activatedRoute: ActivatedRoute,
        ) { }

  ngOnInit(): void {
    this.authService.user$.subscribe((res) => {
      this.user = res;
    });
    
    this.$collections = this.collectionsService.currentCategories.subscribe(res =>
    {
        this.collections = res
        console.log("collections: ", this.collections)
        // res.forEach((collection, i) => {
        //   this.featuredSellTokens.push(collection)
        // });
        // console.log("this++", this.featuredSellTokens)
        for (let i = (this.pageSize * this.count); i < this.pageSize * (this.count + 1); i++) {
          if (this.collections[i]) {
            this.featuredSellTokens.push(this.collections[i])
          }
        }
    });
    this.authService.user$.subscribe((res) => {
      this.user = res;
    });  }
  ngOnDestroy(): void {

  }
  onScroll() {
    console.log("scrolled")
    this.count++;
    for (let i = (this.pageSize * this.count); i < this.pageSize * (this.count + 1); i++) {
      if (this.collections[i]) {
        this.featuredSellTokens.push(this.collections[i])
      }
    }
  }

}
