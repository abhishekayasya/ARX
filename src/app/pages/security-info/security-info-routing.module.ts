import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import {SecurityInfoComponent} from '@app/pages/security-info/components/security-info/security-info.component';
import {ROUTES} from '@app/config';
import {UsernamePasswordComponent} from '@app/pages/security-info/components/username-password/username-password.component';
import {SecurityQuesComponent} from '@app/pages/security-info/components/security-ques/security-ques.component';
import {VerifyIdentityComponent} from '@app/pages/security-info/components/verify-identity/verify-identity.component';
import {SecurityinfoGuard} from '@app/pages/security-info/securityinfo.guard';
import { TwoFaVerifyIdentityComponent } from './components/2fa-verify-identity/2fa-verify-identity.component';
import { SecurityQuestion2faComponent } from '@app/pages/security-info/components/security-question-2fa/security-question-2fa.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      { path: '', component: SecurityInfoComponent },
      {
        path: ROUTES.securityIformation.children.userinfo.route,
        component: UsernamePasswordComponent,
        canActivate: [SecurityinfoGuard]
      },
      {
        path: ROUTES.securityIformation.children.security_question.route,
        component: SecurityQuesComponent,
        canActivate: [SecurityinfoGuard]
      },
      {
        path: ROUTES.securityIformation.children.verify.route,
        component: VerifyIdentityComponent
      },
      {
        path: ROUTES.securityIformation.children.two_fa.route,
        component: TwoFaVerifyIdentityComponent
      },
      {
        path: ROUTES.securityIformation.children.code_sent.route,
        component: TwoFaVerifyIdentityComponent
      },
      {
        path: ROUTES.securityIformation.children.security_question_2fa.route,
        component: SecurityQuestion2faComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecurityInfoRoutingModule { }
