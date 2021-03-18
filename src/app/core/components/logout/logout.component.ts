import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpClientService } from '../../services/http.service';
import { UserService } from '../../services/user.service';
import { RegistrationService } from '../../services/registration.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';

const CONST = {
  successCode: 'WAG_I_LOGOUT_1000',
  alreadyLogOutCode: 'WAG_I_LOGOUT_1002'
};

@Component({
  selector: 'arxrf-logout',
  templateUrl: './logout.component.html'
})
export class LogoutComponent {
  logoutUrl = '/profile/csrf-disabled/logout';
  constructor(
    private _httpService: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil
  ) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      if (name.indexOf('_session_alert') > -1) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    }
    this.sendLogoutRequest();
  }

  sendLogoutRequest() {
    /* Sending logout request to logout service to handle cookie and
    // updating user status at client end by removing all information
     in local store. */
    this._httpService.postData(this.logoutUrl, {}).subscribe(
      data => {
        this._userService.logoutCleanUp();
        this._common.navigate(ROUTES.login.absoluteRoute);
      },
      error => {
        this._userService.logoutCleanUp();
        this._common.navigate(ROUTES.login.absoluteRoute);
      }
    );
  }
}
