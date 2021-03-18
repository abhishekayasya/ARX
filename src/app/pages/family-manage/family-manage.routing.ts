import { Routes } from '@angular/router';
import { FmBaseComponent } from './components/fm-base/fm-base.component';
import { FmHomeComponent } from '@app/pages/family-manage/components/fm-home/fm-home.component';
import { ROUTES } from '@app/config';
import { ManageAccessComponent } from '@app/pages/family-manage/components/manage-access/manage-access.component';
import { AddAdultFormComponent } from '@app/pages/family-manage/adult/add-form/add-form.component';
import { AdultAdditionalInfoComponent } from '@app/pages/family-manage/adult/additional-info/additional-info.component';
import { AdultInviteComponent } from '@app/pages/family-manage/adult/invite/invite.component';
import { AdultChildFoundComponent } from '@app/pages/family-manage/adult/child-found/child-found.component';
import { FamilyInsuranceComponent } from '@app/pages/family-manage/components/insurance/insurance.component';

import { AddChildFormComponent } from './child/add-child-form/add-child-form.component';
import { ConfirmChildComponent } from './child/confirm-child/confirm-child.component';
import { InviteChildComponent } from './child/invite-child/invite-child.component';
import { FmGuard } from '@app/pages/family-manage/fm.guard';
import { FamilyInvitePageComponent } from '@app/pages/family-manage/components/invite-page/invite-page.component';
import { MemberAuthComponent } from '@app/pages/family-manage/components/member-auth/member-auth.component';

export const routes: Routes = [
  {
    path: '',
    component: FmBaseComponent,
    children: [
      { path: '', component: FmHomeComponent },
      {
        path: ROUTES.family_management.children.manage_access.route,
        component: ManageAccessComponent
      },
      {
        path: ROUTES.family_management.children.adult.add.route,
        component: AddAdultFormComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.adult.search_additional.route,
        component: AdultAdditionalInfoComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.adult.invite.route,
        component: AdultInviteComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.adult.child_found.route,
        component: AdultChildFoundComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.health_update.route,
        component: FamilyInsuranceComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.child.add.route,
        component: AddChildFormComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.child.confirm.route,
        component: ConfirmChildComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.child.invite.route,
        component: InviteChildComponent,
        canActivate: [FmGuard]
      },
      {
        path: ROUTES.family_management.children.invite.route,
        component: FamilyInvitePageComponent
      },
      {
        path: ROUTES.family_management.children.verify.route,
        component: MemberAuthComponent
      }
    ]
  }
];
