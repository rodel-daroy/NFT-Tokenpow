import {Component, Input, OnInit} from '@angular/core';
import {PaginationService} from '../../../shared/services/pagination.service';
import {FilterService} from '../../services/filter.service';

@Component({
  selector: 'app-selltoken-grid',
  templateUrl: './selltoken-grid.component.html',
  styleUrls: ['./selltoken-grid.component.scss']
})
export class SelltokenGridComponent implements OnInit {

  @Input() isFavoritesFilterActivated: boolean;
  @Input() collectionId: string = 'none';

  currentFilter: string[];
  data: any[] = [];

  constructor(public page: PaginationService,
              private filterService: FilterService) {
  }

  ngOnInit(): void {
    console.log('load selltoke grid =====>');
    this.filterService.currentFilter.subscribe(res => {
      this.currentFilter = res;
    });

    if (this.collectionId === 'none') {
      this.page.initHomePage();
      this.page.$data.subscribe(res => {
        this.data = res;
        console.log('data1: =====>', this.data);
      });
    } else {
      this.page.initCollectionPage(this.collectionId);
      this.page.$data.subscribe(res => {
        this.data = res;
        console.log('data2 =====>', this.data);
      });
    }
  }

  onUp(): void {
    console.log('uppage occurs =====>');
  }

  onScroll(): void {
    console.log('load next page!!! =====>');
    if (!this.isFavoritesFilterActivated) {
      console.log('come1 =====>');

      if (this.data.length !== 0) {
        console.log('come2 =====>');

        if (this.currentFilter.length > 0) {
          console.log('come3 =====>');
          this.page.nextCollectionPage(this.collectionId, this.data[this.data.length - 1], this.currentFilter);
        } else {
          console.log('come4 =====>');
          this.page.nextCollectionPage(this.collectionId, this.data[this.data.length - 1]);
        }
      }
    }
  }
}
