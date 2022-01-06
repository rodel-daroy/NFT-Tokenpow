import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-assets-steps-page',
  templateUrl: './create-assets-steps-page.component.html',
  styleUrls: ['./create-assets-steps-page.component.scss']
})
export class CreateAssetsStepsPageComponent implements OnInit {

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
