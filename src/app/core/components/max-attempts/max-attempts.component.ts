import { Component } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { Router } from '@angular/router';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-login-maxattempts',
  templateUrl: './max-attempts.component.html',
  styleUrls: ['./max-attempts.component.scss']
})
export class MaxAttemptsComponent {
  ROUTES = ROUTES;

  constructor(
    public _appContext: AppContext,
    private _userService: UserService,
    private _router: Router,
    private _common: CommonUtil
  ) {
    if (!_userService.accountLocked) {
      this._router.navigateByUrl(ROUTES.login.absoluteRoute);
    }
  }

  gotoResetPassword() {
    this._common.navigate(ROUTES.forgotPassword.absoluteRoute);
  }
}
