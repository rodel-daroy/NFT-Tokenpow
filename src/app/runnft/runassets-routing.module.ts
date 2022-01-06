import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../shared/guards/auth.guard';
import {PublicRunNftPageComponent} from './pages/public-runnft-page/public-runnft-page.component'
import { NftDetailComponent } from './pages/nft-detail/detail-nft';
const routes: Routes = [
  {
    path: 'myassets',
    component: PublicRunNftPageComponent
  },
  {
    path: 'detail',
    component: NftDetailComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./modules/create-runnft/create-runnft.module').then(m => m.CreateRunNftModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunNftRoutingModule { }
