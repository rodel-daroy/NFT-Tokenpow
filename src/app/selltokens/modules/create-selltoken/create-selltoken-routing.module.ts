import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateSelltokenStepsPageComponent,} from './pages/create-selltoken-steps-page/create-selltoken-steps-page.component';
import {CreateSelltokenPageComponent} from './pages/create-selltoken-page/create-selltoken-page.component';
import {CreatePreviewSelltokenComponent} from './pages/create-preview-selltoken/create-preview-selltoken.component';
import {ThankYouPageComponent} from './pages/thank-you-page/thank-you-page.component';
import { CreateApproveSelltokenComponent } from './pages/create-approve-selltoken/create-approve-selltoken.component';
import { CreateAuctionSelltokenComponent } from './pages/create-auction-selltoken/create-auction-selltoken.component';

const routes: Routes = [
  {
    path: '',
    component: CreateSelltokenStepsPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'make',
        component: CreateSelltokenPageComponent
        //pathMatch: 'full'
      },
      {
        path: 'make',
        component: CreateSelltokenPageComponent
      },
      {
        path: 'preview',
        component: CreatePreviewSelltokenComponent
      },
      {
        path: 'approve',
        component: CreateApproveSelltokenComponent
      },
      //{
      //  path: 'pauction',
      //  component: CreateAuctionSelltokenComponent
      //},
    ]
  },
  {
    path: 'thank-you',
    component: ThankYouPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateSelltokenRoutingModule { }
 