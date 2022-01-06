import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './pages/profile/profile.component';
import {UserSelltokenGridComponent} from './components/user-selltoken-grid/user-selltoken-grid.component';
import {ProfileSectionHeaderComponent} from './components/profile-section-header/profile-section-header.component';
import {EurWithdrawalsComponent} from './pages/eur-withdrawals/eur-withdrawals.component';
import { UserSelltokenGridBuyComponent } from './components/user-selltoken-grid-buy/user-selltoken-grid-buy.component';
import { UserSelltokenGridAuctionComponent } from './components/user-selltoken-grid-auction/user-selltoken-grid-auction.component';

const routes: Routes = [
  {
    path: '', component: ProfileComponent,
    children: [
      {
        path: 'tokens', component: UserSelltokenGridComponent
      },
      {
        path: 'mybuys', component: UserSelltokenGridBuyComponent
      },
      {
        path: 'myauctions', component: UserSelltokenGridAuctionComponent
      },
      {
        path: 'withdrawals', component: ProfileSectionHeaderComponent
      },
      {
        path: 'eur-withdrawals', component: EurWithdrawalsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
