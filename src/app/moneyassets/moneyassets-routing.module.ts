import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../shared/guards/auth.guard';
import {PublicAssetsPageComponent} from './pages/public-assets-page/public-assets-page.component'
import {PublicOwnAssetsPageComponent} from './pages/public-ownassets-page/public-ownassets-page.component'
import {MintAssetsPageComponent} from './pages/mint-assets-page/mint-assets-page.component'

const routes: Routes = [
  {
    path: 'myassets',
    component: PublicAssetsPageComponent
  },
  {
    path: 'myownedassets',
    component: PublicOwnAssetsPageComponent
  },
  {
    path: 'mint',
    component: MintAssetsPageComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./modules/create-assets/create-asests.module').then(m => m.CreateAssetsModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoneyAssetsRoutingModule { }
