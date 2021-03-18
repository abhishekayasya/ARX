import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {AppContext} from '@app/core/services/app-context.service';
import {ROUTES} from '@app/config';
import {Injectable} from '@angular/core';

@Injectable()
export class FmGuard implements CanActivate {

  constructor(private _router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem(AppContext.CONST.uidStorageKey) != null) {
      return true;
    } else {
      this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
    }
    return true;
  }

}
