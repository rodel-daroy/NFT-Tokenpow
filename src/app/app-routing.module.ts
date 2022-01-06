import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RedirectComponent} from './shared/components/redirect/redirect.component';
import {AdminGuard} from './shared/guards/admin.guard';
import {PartnerGuard} from './shared/guards/partner.guard';
import {UserProfileComponent} from './user/pages/user-profile/user-profile.component';
import {LandingPageComponent} from './shared/pages/landing-page/landing-page.component';
import {AuthGuard} from './shared/guards/auth.guard';
import { CollectionPageComponent } from './shared/pages/collection-page/collection-page.component';
import { CollectionsComponent } from './shared/pages/collections/collections.component';

const routes: Routes = [ 
  {
    path: '',
    component: LandingPageComponent
  },
  {
    path: 'auth', loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'user', loadChildren: () =>
      import('./user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'auction', loadChildren: () =>
      import('./selltokens/selltokens.module').then(m => m.SelltokensModule)
  },
  {
    path: 'mbasset',
    loadChildren: () =>import('./moneyassets/moneyassets.module').then(m => m.MeneyAssetsModule)
  },
  {
    path: 'runnft',
    loadChildren: () =>import('./runnft/runassets.module').then(m => m.RunNftMoudle)
  },
  {
    path: 'rtasset',
    loadChildren: () =>import('./runtoken/runtoken.module').then(m => m.RunTokenModule)
  },
  {
    path: 'profile',
    component: UserProfileComponent,
  },
  {
    path: 'how-it-works',
    loadChildren: () =>
      import('./shared/pages/how-it-works/how-it-works.module').then(m => m.HowItWorksModule)
  },
  {
    path: 'privacy-policy',
    loadChildren: () =>
      import('./shared/pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule)
  },  {
    path: 'terms',
    loadChildren: () =>
      import('./shared/pages/terms-and-conditions/terms-and-conditions.module').then(m => m.TermsAndConditionsModule)
  },
  {
    path:':id/collection',
    component: CollectionPageComponent
  },
  {
    path:'collections',
    component: CollectionsComponent
  },
  {
    path: 'admin', loadChildren: () =>
      import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  {
    path: 'partner', loadChildren: () =>
      import('./partner/partner.module').then(m => m.PartnerModule),
    canActivate: [PartnerGuard]
  },
  {
    path: ':id',
    component: RedirectComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
