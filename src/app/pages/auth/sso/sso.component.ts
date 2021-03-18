import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { REG_CONST } from '@app/config/registration.constant';
import { RegistrationService } from '@app/core/services/registration.service';

import { SsoService } from '@app/core/services/sso.service';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';

@Component({
  selector: 'arxrf-sso',
  styleUrls: ['./sso.component.scss'],
  templateUrl: './sso.component.html'
})
export class SsoComponent implements OnInit {
  ssoService: SsoService;

  constructor(
    private _router: Router,
    private _ssoService: SsoService,
    private _appContext: AppContext,
    private _regService: RegistrationService,
    private _userService: UserService,
    private _common: CommonUtil
  ) {
    this._ssoService.ssoServiceError = false;
    this._ssoService.ssoFailMessage = '';
    this._ssoService.ssoWait = true;
    this.ssoService = _ssoService;
  }

  ngOnInit(): void {
    //start sso if ssoContent is received
    if (this._appContext.ssoContent !== undefined) {
      const logoutResult = this._userService.preSSOPurge1(); // logout pre-existing user-session, if any

      logoutResult.then(
        () => {
          // initiate the login regardless of result
          this.ssoService.initSSOLogin(this._appContext.ssoContent); // init sso
        },
        () => {
          this.ssoService.initSSOLogin(this._appContext.ssoContent); // init sso
        }
      );
    }
  }

  /**
   * Action in case create new account selected.
   */
  createAccountAction() {
    this._common.navigate(`${ROUTES.address.absoluteRoute}?user=prime_sso`);
  }

  /**
   * Action in case use existing account is selected.
   */
  useExistingAction() {
    this._common.navigate(`${ROUTES.login.absoluteRoute}?user=prime_sso`);
  }
}
