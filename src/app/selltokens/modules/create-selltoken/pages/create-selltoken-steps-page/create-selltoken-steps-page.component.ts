import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ISelltoken} from '../../../../models/selltoken.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-selltoken-steps-page',
  templateUrl: './create-selltoken-steps-page.component.html',
  styleUrls: ['./create-selltoken-steps-page.component.scss']
})
export class CreateSelltokenStepsPageComponent implements OnInit {

  items: MenuItem[];
  mobileItems: MenuItem[];

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.mobileItems = [
      {
        label: '',
        routerLink: 'make'
      },
      {
        label: '',
        routerLink: 'preview',
      },
      //{
      //  label: '',
      //  routerLink: 'pauction',
      //},
      {
        label: '',
        routerLink: 'approve',
      },
    ];
    this.items = [
      {
        label: this.translateService.instant('selltokens.create-selltoken-steps-page.create'),
        routerLink: 'make'
      },
      {
        label: this.translateService.instant('selltokens.create-selltoken-steps-page.preview'),
        routerLink: 'preview',
      },
      //{
      //  label: this.translateService.instant('Auction'),
      //  routerLink: 'pauction',
      //},
      {
        label: this.translateService.instant('selltokens.create-selltoken-steps-page.approve'),
        routerLink: 'approve',
      },
    ];
  }

}
