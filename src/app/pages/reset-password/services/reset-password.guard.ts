import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { ROUTES } from '@app/config';

@Injectable()
export class ResetPasswordGuard implements CanActivateChild {
  constructor(
    private _passwordService: ResetPasswordService,
    private _router: Router
  ) {}

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (
      childRoute.routeConfig.path === '' ||
      childRoute.routeConfig.path === ROUTES.forgotPasswordCheck.route
    ) {
      return true;
    }
    if (
      this._passwordService.state !== '' &&
      this._passwordService.state === childRoute.routeConfig.path
    ) {
      return true;
    } else {
      this._router.navigate([ROUTES.forgotPassword.absoluteRoute]);
    }
    return true;
  }
}
