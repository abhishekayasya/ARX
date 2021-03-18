import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
// tslint:disable-next-line: import-blacklist
import {Observable} from 'rxjs';
import {UserService} from '@app/core/services/user.service';

/**
 * Guard for un secured routes.
 */
@Injectable()
export class PublicRouteGuard implements CanActivate {

  constructor(
    private _userService: UserService
  ) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this._userService.updateUsernameInHeader();
    return true;
  }


}
