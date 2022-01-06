import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRunTokenStepsPageComponent } from './pages/create-runtoken-steps-page/create-runtoken-steps-page.component'
import { ModifyRunTokenPageComponent } from './pages/modify-runtoken-page/modify-runtoken-page.component'
import { CreateRunTokenPageComponent } from './pages/create-runtoken-page/create-runtoken-page.component'
import { CreatePreviewRunTokenComponent } from './pages/create-preview-runtoken/create-preview-runtoken.component'
import { ThankYouPageRunTokenComponent } from './pages/thank-you-page-runtoken/thank-you-page.component'
const
 routes: Routes = [
    {
      path: '',
      component: CreateRunTokenStepsPageComponent,
      children: [
        {
          path: '',
          redirectTo: 'create',
          pathMatch: 'full'
        },
        {
          path: 'create',
          component: CreateRunTokenPageComponent
        },
        {
          path: 'preview',
          component: CreatePreviewRunTokenComponent
        },
      ]
    },
    {
      path: 'thank-you',
      component: ThankYouPageRunTokenComponent
    },
    {
      path: 'modify',
      component: ModifyRunTokenPageComponent

    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRunTokenRoutingModule { }
