import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../shared/guards/auth.guard';
import {PublicRunTokenPageComponent} from './pages/public-runtoken-page/public-runtoken-page.component'
import {PublicOwnRunTokenPageComponent} from './pages/public-ownruntoken-page/public-ownruntoken-page.component'

import {MintRunTokenPageComponent} from './pages/mint-runtoken-page/mint-runtoken-page.component'
import { TokenDetailComponent } from './pages/token-detail/detail-token';

const routes: Routes = [
  {
    path: 'myassets',
    component: PublicRunTokenPageComponent
  },
  {
    path: 'myownedassets',
    component: PublicOwnRunTokenPageComponent
  },
  {
    path: 'detail',
    component: TokenDetailComponent
  },
  {
    path: 'mint',
    component: MintRunTokenPageComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./modules/create-runtoken/create-runtoken.module').then(m => m.CreateRunTokenModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunTokenRoutingModule { }
