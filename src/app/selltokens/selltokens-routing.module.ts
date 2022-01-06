import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent} from './pages/detail/detail.component';
import { PublicSelltokensPageComponent } from './pages/public-selltokens-page/public-selltokens-page.component';
import { AuthGuard } from '../shared/guards/auth.guard';
import { DonatePageComponent } from './pages/donate-page/donate-page.component';

const routes: Routes = [
  {
    path: '',
    component: PublicSelltokensPageComponent
  },
  {
    path: 'create',
    loadChildren: () => import('./modules/create-selltoken/create-selltoken.module').then(m => m.CreateSelltokenModule),
    canActivate: [AuthGuard]
  },
  {
    path: ':id',
    component: DetailComponent,
  },
  {
    path: ':id/buy',
    component: DonatePageComponent
  }
  // {
  //   path: 'create', component: CreateselltokenPageComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelltokensRoutingModule { }
