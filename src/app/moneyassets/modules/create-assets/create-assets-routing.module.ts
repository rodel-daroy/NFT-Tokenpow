import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAssetsStepsPageComponent } from './pages/create-assets-steps-page/create-assets-steps-page.component'
import { ModifyAssetsPageComponent } from './pages/modify-assets-page/modify-assets-page.component'
import { CreateAssetsPageComponent } from './pages/create-assets-page/create-assets-page.component'
import { CreatePreviewAssetComponent } from './pages/create-preview-assets/create-preview-assets.component'
import { ThankYouPageAssetsComponent } from './pages/thank-you-page-assets/thank-you-page.component'
const
 routes: Routes = [
    {
      path: '',
      component: CreateAssetsStepsPageComponent,
      children: [
        {
          path: '',
          redirectTo: 'create',
          pathMatch: 'full'
        },
        {
          path: 'create',
          component: CreateAssetsPageComponent
        },
        {
          path: 'preview',
          component: CreatePreviewAssetComponent
        },
      ]
    },
    {
      path: 'thank-you',
      component: ThankYouPageAssetsComponent
    },
    {
      path: 'modify',
      component: ModifyAssetsPageComponent

    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAssetsRoutingModule { }
