import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SsoData } from '@app/models';
import { HttpClientService } from './http.service';
import { SamlRequestData } from '@app/models';
import { UserService } from './user.service';
import { AppContext } from './app-context.service';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { CookieService } from 'ngx-cookie-service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';

const CONST = {
  SAML_URL: '/sso/csrf-disabled/saml',
  ROUTE_SIGNUP: '/registration',

  ERROR: {
    CASE_LOGIN: 'WAG_I_PRIME_SAML_1009',
    PROMPT_CASE_1: 'WAG_I_PRIME_SAML_1012',
    PROMPT_CASE_2: 'WAG_I_PRIME_SAML_1014',
    CASE_SUCCESS: 'WAG_I_PRIME_SAML_1015'
  }
};

@Injectable()
export class SsoService {
  ssoWait = true;

  ssoServiceError = false;
  ssoFailMessage = '';

  ssoData: SsoData = <SsoData>{};

  samlRequestData: SamlRequestData = {
    samlContent: '',
    affiliateId: 'prime',
    target: 'ArxWp',
    flow: 'ARX'
  };

  constructor(
    private _httpService: HttpClientService,
    private _router: Router,
    private _cookieService: CookieService,
    private _userService: UserService,
    private _common: CommonUtil
  ) {}

  callRefreshToken() {
    this._httpService
      .doPost('/profile/v1/token/refresh', {})
      .then(response => {
        const _body = response.json();
        this._userService.updateJwtCookie();
      });
      //.catch(error => {});
  }

  // Send sso data to saml service and fetch user status
  initSSOLogin(ssoContent: string): Promise<any> {
    this.samlRequestData.samlContent = ssoContent;

    //Sending request for sso validation.
    return this._httpService
      .doPost(CONST.SAML_URL, this.samlRequestData)
      .then(response => {
        const _body = response.json();
        this._userService.setsamlResponse(response);

        if (_body.messages !== undefined) {
          const code = _body.messages[0].code;
          switch (code) {
            /**
             * Logging in user in case of success response
             */
            case CONST.ERROR.CASE_SUCCESS:
              //set prime id
              this._userService.setPrimeID(_body.EnterprisePersonId);

              this._userService.initUser1('', false).then(() => {
                this._common.navigate(ROUTES.account.absoluteRoute);
              }); // navigate the user to account home
              break;

            /**
             * Logging in user in case another active session
             */
            case CONST.ERROR.PROMPT_CASE_2:
              //set prime id
              this._userService.setPrimeID(_body.EnterprisePersonId);

              this._userService.initUser1('', false).then(() => {
                this._common.navigate(ROUTES.account.absoluteRoute);
              }); // navigate the user to account home
              break;

            /**
             * Prompting option for user to login or register in order to sync.
             */
            // case CONST.ERROR.PROMPT_CASE_1:
            case CONST.ERROR.CASE_LOGIN:
              this.processSsoResponse();
              this.ssoWait = false;
              break;

            default:
              this.ssoServiceError = true;
              this.ssoWait = false;
              try {
                localStorage.removeItem(AppContext.CONST.ssoStorageKey);
              } catch (e) {}

              this.ssoFailMessage = _body.messages[0].message;
              break;
          }
        } else {
          if (_body.MemberId !== undefined) {
            this._userService.initUser1(_body.MemberId);
          }
        }
      })
      .catch(error => {
        this.ssoWait = false;
        this.ssoServiceError = true;
        this.ssoFailMessage = ARX_MESSAGES.ERROR.wps_cto;
      });
  }

  processSsoResponse(): void {
    this.ssoData.isFirstTime = true;
    try {
      document.getElementsByClassName('rx__user-status')[0]['style'].display =
        'none';
    } catch (e) {
      console.error(e);
    }
    this._userService.setSSOSession();
  }
}
