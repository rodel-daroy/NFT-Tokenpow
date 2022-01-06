import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminPageComponent} from './pages/admin-page/admin-page.component';
import {SelltokenApprovalsComponent,} from './components/selltoken-approvals/selltoken-approvals.component';
import {DonateRequestsComponent} from './components/donate-requests/donate-requests.component';
import {SelltokenListComponent,} from './components/selltoken-list/selltoken-list.component';
import {IbanWithdrawalRequestsComponent} from './components/iban-withdrawal-requests/iban-withdrawal-requests.component';
import {PerkRequestsComponent} from './components/perk-requests/perk-requests.component';
import {UserListComponent} from './components/user-list/user-list.component';
import { ManageRefundsComponent } from './components/manage-refunds/manage-refunds.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'selltoken-approvals',
        component: SelltokenApprovalsComponent,
      },
      {
        path: 'donate-requests',
        component: DonateRequestsComponent
      },
      {
        path: 'selltoken-list',
        component: SelltokenListComponent,
      },
      {
        path: 'eur-withdrawals',
        component: IbanWithdrawalRequestsComponent
      },
      {
        path: 'perk-requests',
        component: PerkRequestsComponent
      },
      {
        path: 'user-list',
        component: UserListComponent
      },
      {
        path: 'refund-coins',
        component: ManageRefundsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
