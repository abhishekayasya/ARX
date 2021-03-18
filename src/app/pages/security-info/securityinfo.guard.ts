import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SecurityInfoService } from '@app/pages/security-info/securityinfo.service';
import { ROUTES } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';

@Injectable()
export class SecurityinfoGuard implements CanActivate {
  constructor(
    private _securityInfo: SecurityInfoService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem(AppContext.CONST.isUserVerified) != null) {
      return true;
    } else {
      this._router.navigateByUrl(
        `${ROUTES.securityIformation.children.verify.absoluteRoute}?type=${route.routeConfig.path}`
      );
    }
  }
}
