import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SecurityInfoRoutingModule } from './security-info-routing.module';

import { SecurityInfoComponent } from './components/security-info/security-info.component';
import { VerifyIdentityComponent } from './components/verify-identity/verify-identity.component';
import { UsernamePasswordComponent } from './components/username-password/username-password.component';
import { SecurityQuesComponent } from './components/security-ques/security-ques.component';
import { BaseComponent } from './components/base/base.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';
import { SecurityInfoService } from '@app/pages/security-info/securityinfo.service';
import { SecurityinfoGuard } from '@app/pages/security-info/securityinfo.guard';
import { TwoFaVerifyIdentityComponent } from './components/2fa-verify-identity/2fa-verify-identity.component';
import { SecurityQuestion2faComponent } from './components/security-question-2fa/security-question-2fa.component';
import {NgxPopperModule} from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    SecurityInfoRoutingModule,
    NgxPopperModule
  ],
  declarations: [
    SecurityInfoComponent,
    VerifyIdentityComponent,
    UsernamePasswordComponent,
    SecurityQuesComponent,
    BaseComponent,
    TwoFaVerifyIdentityComponent,
    SecurityQuestion2faComponent
  ],
  providers: [SecurityInfoService, SecurityinfoGuard]
})
export class SecurityInfoModule {}
