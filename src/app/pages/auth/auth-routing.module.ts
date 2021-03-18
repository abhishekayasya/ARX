import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SsoComponent } from './sso/sso.component';
import { ForgotUsernameComponent } from './forgot-username/base/base.component';
import { RetrieveUsernameComponent } from './forgot-username/retrieve-username/retrieve-username.component';
import { UsernameSentComponent } from './forgot-username/username-sent/username-sent.component';
import { ROUTES } from '@app/config';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: ROUTES.sso.route,
    component: SsoComponent
  },
  {
    path: ROUTES.forgotUsername.route,
    component: ForgotUsernameComponent,
    children: [
      {
        path: '',
        component: RetrieveUsernameComponent
      },
      {
        path: ROUTES.usernameSent.route,
        component: UsernameSentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
