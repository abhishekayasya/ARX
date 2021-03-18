import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { SsoComponent } from './sso/sso.component';
import { ForgotUsernameComponent } from './forgot-username/base/base.component';
import { RetrieveUsernameComponent } from './forgot-username/retrieve-username/retrieve-username.component';
import { UsernameSentComponent } from './forgot-username/username-sent/username-sent.component';
import { ContactUsComponent } from './contact-us/contact-us.component';

@NgModule({
  imports: [CommonModule, AuthRoutingModule, SharedModule],
  declarations: [
    LoginComponent,
    ForgotUsernameComponent,
    UsernameSentComponent,
    RetrieveUsernameComponent,
    SsoComponent
  ]
})

export class AuthModule {}
