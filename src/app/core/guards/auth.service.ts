import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpClientService } from 'app/core/services/http.service';
import {UserService} from '@app/core/services/user.service';
import {AppContext} from '@app/core/services/app-context.service';
import {ROUTES} from '@app/config';
import {CommonUtil} from '@app/core/services/common-util.service';

// Authentication/ Authorization service to be used for security check.
// permissions and roles check to logged user.

const CONST = {
  unauthorizedAccess : 'WAG_RXCHECKOUT_WRONG_USER'
};

@Injectable()
export class AuthService {

  constructor(
    private _httpClient: HttpClientService,
    private _userService: UserService,
    private _router: Router,
    private _appContext: AppContext,
    private _common: CommonUtil
  ) {

  }

  // Function for check security for a route after checkin state of user.
  canAccessRoute(route: RouterStateSnapshot): Promise<boolean> {
    let promise = null;
      promise = new Promise<boolean>((resolve, reject) => {

        // if ( this._userService.user == undefined ) {
        //   console.log("inside user not found");
        //   this._userService.initUser(localStorage.getItem(AppContext.CONST.uidStorageKey));
        //   resolve(false);
        // } else if ( this._userService.user !== undefined && !this._userService.checkRegStatus() ) {
        //   this._router.navigate([ROUTES.registration.absoluteRoute]);
        //   resolve(false);
        // } else {
        //   if ( this._appContext.regStatus == "" && this._userService.user.profile !== undefined) {
        //     resolve(true);
        //   } else {
        //     this._router.navigateByUrl("/login");
        //     resolve(false);
        //   }
        // }

        if ( this._userService.user === undefined ) {
          this._common.navigate(ROUTES.login.absoluteRoute);
          resolve(false);
        } else {
          resolve(true);
        }

      });

    return promise;
  }

}
