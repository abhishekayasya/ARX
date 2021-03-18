import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { RegistrationService } from '@app/core/services/registration.service';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';

// Handling state of registration steps to block direct access.
@Injectable()
export class RegistrationGuard implements CanActivateChild {
  constructor(
    private _router: Router,
    private _registrationService: RegistrationService,
    private _appContext: AppContext,
    private common: CommonUtil,
    private _userService: UserService
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // sso condition when creating new account.
    if (this._userService.isSSOSessionActive()) {
      if (childRoute.routeConfig.path === ROUTES.address.route) {
        this._appContext.setRegistrationState(ROUTES.address.route);
        return true;
      } else if (childRoute.routeConfig.path === '') {
        this._appContext.setRegistrationState(ROUTES.address.route);
        this._router.navigateByUrl(ROUTES.address.absoluteRoute);
        return true;
      }
    }

    // blocking access to registration steps for logged in(registered) user and redirecting to account page
    if (
      localStorage.getItem('uid') &&
      this._appContext.getRegistrationState() === '' &&
      localStorage.getItem('lite_user') &&
      localStorage.getItem('lite_user') !== 'true'
    ) {
      this.common.navigate(ROUTES.account.absoluteRoute);
    }

    // blocking access to registration step if trying to access step other then the state.
    // checking state for registration. And if not found then redirecting to registration first step
    // otherwise redirecting to state found for registration.
    if (childRoute.routeConfig.path !== '') {
      if (this._appContext.getRegistrationState() === '') {
        this._router.navigateByUrl(ROUTES.registration.absoluteRoute);
        return false;
      } else if (
        childRoute.routeConfig.path.indexOf(
          this._appContext.getRegistrationState()
        ) === -1
      ) {
        this._router.navigateByUrl(
          `${
            ROUTES.registration.absoluteRoute
          }/${this._appContext.getRegistrationState()}`
        );
        return false;
      }
    }
    return true;
  }
}
