import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRunNftStepsPageComponent } from './pages/create-runnft-steps-page/create-runnft-steps-page.component'
//import { ModifyRunNftPageComponent } from './pages/modify-runnft-page/modify-runnft-page.component'
import { CreateRunNftPageComponent } from './pages/create-runnft-page/create-runnft-page.component'
import { CreatePreviewRunNftComponent } from './pages/create-preview-runnft/create-preview-runnft.component'
import { ThankYouPageAssetsComponent } from './pages/thank-you-page-runnft/thank-you-page.component'
const
 routes: Routes = [
    {
      path: '',
      component: CreateRunNftStepsPageComponent,
      children: [
        {
          path: '',
          redirectTo: 'create',
          pathMatch: 'full'
        },
        {
          path: 'create',
          component: CreateRunNftPageComponent
        },
        {
          path: 'preview',
          component: CreatePreviewRunNftComponent
        },
      ]
    },
    {
      path: 'thank-you',
      component: ThankYouPageAssetsComponent
    },
    /*{
      path: 'modify',
      component: ModifyRunNftPageComponent

    }*/
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRunNftRoutingModule { }
