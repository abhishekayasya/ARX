import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';

import {ROUTES} from '@app/config';
import {SendSecurityCodeComponent} from '@app/pages/reset-password/components/send-security-code/send-security-code.component';
import {SubmitSecurityCodeComponent} from '@app/pages/reset-password/components/submit-security-code/submit-security-code.component';
import {NewPasswordComponent} from '@app/pages/reset-password/components/new-password/new-password.component';
import {ValidatorComponent} from '@app/pages/reset-password/components/validator/validator.component';
import {ResetPasswordComponent} from '@app/pages/reset-password/components/reset-password/reset-password.component';
import {ForgotPasswordComponent} from '@app/pages/reset-password/components/base/base.component';
import {ResetPasswordGuard} from '@app/pages/reset-password/services/reset-password.guard';

const routes: Routes = [
  {
    path: '', component: ForgotPasswordComponent,
    children : [
      { path : '', component : ResetPasswordComponent},
      { path : ROUTES.forgotPasswordCheck.route, component : ValidatorComponent},
      { path : ROUTES.sendSecurityCode.route, component : SendSecurityCodeComponent},
      { path : ROUTES.submitSecurityCode.route, component : SubmitSecurityCodeComponent},
      { path : ROUTES.newPassword.route, component : NewPasswordComponent }
    ],
    canActivateChild: [ResetPasswordGuard]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetPasswordRoutingModule {

}
