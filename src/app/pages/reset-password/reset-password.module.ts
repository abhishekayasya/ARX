/**
 * Module declaration for reset password.
 */
import {NgModule} from '@angular/core';
import {SharedModule} from '@app/shared/shared.module';
import {Components} from '@app/pages/reset-password/components';
import {ResetPasswordRoutingModule} from '@app/pages/reset-password/reset-password-routing.module';
import {CommonModule} from '@angular/common';
import {ResetPasswordGuard} from '@app/pages/reset-password/services/reset-password.guard';
import {ResetPasswordService} from '@app/pages/reset-password/services/reset-password.service';
import {NgxPopperModule} from 'ngx-popper';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ResetPasswordRoutingModule,
    NgxPopperModule
  ],
  declarations : [
    ...Components
  ],
  providers: [
    ResetPasswordGuard,
    ResetPasswordService
  ]
})
export  class ResetPasswordModule {

}
