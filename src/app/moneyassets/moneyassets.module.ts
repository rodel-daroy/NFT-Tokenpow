import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicAssetsPageComponent } from './pages/public-assets-page/public-assets-page.component';
import { MoneyAssetsRoutingModule } from './moneyassets-routing.module';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { ModifyAssetsDataService } from './modules/create-assets/services/modify-assets-data.service';
import { MintAssetsPageComponent } from './pages/mint-assets-page/mint-assets-page.component'
import {PublicOwnAssetsPageComponent} from './pages/public-ownassets-page/public-ownassets-page.component'
import {TabViewModule} from 'primeng/tabview';

const components = [
  PublicAssetsPageComponent,
  PublicOwnAssetsPageComponent
];

const modules = [
  CommonModule,
  TableModule,
  ButtonModule,
  InputTextModule,
  TranslateModule,
  MoneyAssetsRoutingModule,
  TabViewModule
];

@NgModule({
  declarations: [...components, MintAssetsPageComponent],
  imports: [...modules],
  exports: [
  ],
  providers: []
})
export class MeneyAssetsModule { }
