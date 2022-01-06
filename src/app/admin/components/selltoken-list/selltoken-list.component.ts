import {Component, OnInit} from '@angular/core';
import {SelltokenStatus} from '../../../selltokens/enums/selltoken-status.enum';
import {ISelltoken} from '../../../selltokens/models/selltoken.model';
import {AdminSelltokenPaginationService} from '../../services/admin-selltoken-pagination.service';

@Component({
  selector: 'app-selltoken-list',
  templateUrl: './selltoken-list.component.html',
  styleUrls: ['./selltoken-list.component.scss'],
  providers: [AdminSelltokenPaginationService]
})
export class SelltokenListComponent implements OnInit {

  data: ISelltoken[] = [];
  currentStatus = SelltokenStatus.APPROVED;

  constructor(public page: AdminSelltokenPaginationService) { }

  ngOnInit(): void {
    this.page.init();
    this.page.$data.subscribe(res => this.data = res);
  }

  onScroll(): void {
    this.page.nextPage(this.data[this.data.length - 1], this.currentStatus);
  }

  onTabPanelClick(event): void {
    switch (event) {
      case 0:
        this.currentStatus = SelltokenStatus.APPROVED;
        this.page.getDataByStatus(this.currentStatus);
        break;
      case 1:
        this.currentStatus = SelltokenStatus.TOKEN_TRANSFERED;
        this.page.getDataByStatus(this.currentStatus);
        break;
      //case 2:
      //  this.currentStatus = SelltokenStatus.NOT_APPROVED;
      //  this.page.getDataByStatus(this.currentStatus);
      //  break;
      case 2:
        this.currentStatus = SelltokenStatus.ENDED;
        this.page.getDataByStatus(this.currentStatus);
        break;
    }
  }
}
