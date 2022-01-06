import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartnerComponent } from './partner.component';
import { ManageCollectionsComponent } from './manage-collections/manage-collections.component';

const routes: Routes = [
    {
        path: '',
        component: PartnerComponent,
        children: [
            {
                path: 'manage-collections',
                component: ManageCollectionsComponent,
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PartnerRoutingModule { }
