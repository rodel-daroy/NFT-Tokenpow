import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-runtoken-steps-page',
  templateUrl: './create-runtoken-steps-page.component.html',
  styleUrls: ['./create-runtoken-steps-page.component.scss']
})
export class CreateRunTokenStepsPageComponent implements OnInit {

  items: MenuItem[];
  mobileItems: MenuItem[];

  constructor(
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.mobileItems = [
      {
        label: '',
        routerLink: 'create'
      },
      {
        label: '',
        routerLink: 'preview',
      },
    ];
    this.items = [
      {
        label: this.translateService.instant('selltokens.create-selltoken-steps-page.create'),
        routerLink: 'create'
      },
      {
        label: this.translateService.instant('selltokens.create-selltoken-steps-page.preview'),
        routerLink: 'preview',
      },
    ];
  }

}
