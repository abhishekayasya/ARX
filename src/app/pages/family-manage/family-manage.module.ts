import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { routes } from '@app/pages/family-manage/family-manage.routing';
import { SharedModule } from '@app/shared/shared.module';
import { FmBaseComponent } from '@app/pages/family-manage/components/fm-base/fm-base.component';
import { FmHomeComponent } from '@app/pages/family-manage/components/fm-home/fm-home.component';
import { ManageAccessComponent } from '@app/pages/family-manage/components/manage-access/manage-access.component';
import { AddAdultFormComponent } from '@app/pages/family-manage/adult/add-form/add-form.component';
import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { NgxPopperModule } from 'ngx-popper';
import { AdultAdditionalInfoComponent } from '@app/pages/family-manage/adult/additional-info/additional-info.component';
import { AdultInviteComponent } from '@app/pages/family-manage/adult/invite/invite.component';
import { AdultChildFoundComponent } from '@app/pages/family-manage/adult/child-found/child-found.component';
import { FamilyInsuranceComponent } from '@app/pages/family-manage/components/insurance/insurance.component';

import { AddChildFormComponent } from './child/add-child-form/add-child-form.component';
import { ConfirmChildComponent } from './child/confirm-child/confirm-child.component';
import { InviteChildComponent } from './child/invite-child/invite-child.component';
import { ChildService } from '@app/pages/family-manage/child/child.service';
import { FmGuard } from '@app/pages/family-manage/fm.guard';
import { FamilyInvitePageComponent } from '@app/pages/family-manage/components/invite-page/invite-page.component';
import { MemberAuthComponent } from '@app/pages/family-manage/components/member-auth/member-auth.component';
import { MemberAuthService } from '@app/pages/family-manage/components/member-auth/auth.service';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(routes), NgxPopperModule],
  declarations: [
    FmBaseComponent,
    FmHomeComponent,
    ManageAccessComponent,
    AddAdultFormComponent,
    AdultAdditionalInfoComponent,
    AdultInviteComponent,
    AdultChildFoundComponent,
    FamilyInsuranceComponent,
    AddChildFormComponent,
    ConfirmChildComponent,
    InviteChildComponent,
    FamilyInvitePageComponent,
    MemberAuthComponent
  ],
  providers: [AdultService, ChildService, FmGuard, MemberAuthService]
})
export class FamilyManageModule {}
