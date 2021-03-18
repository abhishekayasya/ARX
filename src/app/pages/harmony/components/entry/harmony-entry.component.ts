import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {HttpClientService} from "@app/core/services/http.service";
import {KEYS, Microservice, ROUTES} from "@app/config";
import {CommonUtil} from "@app/core/services/common-util.service";
import {AppContext} from "@app/core/services/app-context.service";
import {CookieService} from "ngx-cookie-service";
import {MessageService} from "@app/core/services/message.service";
import {UserService} from "@app/core/services/user.service";

@Component({
  selector: 'arxrf-harmony-entry',
  template: ''
})

export class HarmonyEntryComponent implements OnInit {

  logoutUrl = '/profile/csrf-disabled/logout';
  code;
  errorMessage;
  constructor(
    private _common: CommonUtil,
    private _messageService: MessageService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _http: HttpClientService,
    private _cookieService: CookieService
  ) {
    this._route.queryParams.subscribe(params => {
      this.code = params.authToken;
    })
  }

  ngOnInit() {
    this.getJwt().then(jwt => {
      if (jwt) {
        this._cookieService.set('jwt', jwt.toString(), undefined, '/', 'alliancerxwp.com', true, 'Lax');
        this.callUserInfoService().then(res => {
          localStorage.setItem(AppContext.CONST.uidStorageKey, res.profileId);
          sessionStorage.setItem(KEYS.harmony_success_flag, 'true');
          this._common.navigate(ROUTES.account.route);
        })
      } else {
        this.errorHandler();
      }
    }).catch(() => {
      this.errorHandler();
    });

  }

  callAccessTokenService(auth_code: string) {
    const requestData = {
      client_id: 'arxharmony',
      scope: 'profile',
      transaction_id: Date.now(),
      code: auth_code,
      grant_type: 'authorization_code',
      state: 'state',
      redirect_uri: 'https://alliancerxwp.com/'
    }
    return new Promise((resolve, reject) => {
      this._http.postData(Microservice.harmony_entry, requestData)
        .subscribe(res => res.jwt ? resolve(res.jwt) : reject(res), err => reject(err))
    });
  }

  callUserInfoService() {
    return this._http.postAuthData(Microservice.userInfo, {
      isTNCRequired: false,
      extSystemIds: false,
      flow: 'ARX'
    }).toPromise();
  }

  errorHandler() {
    sessionStorage.setItem(KEYS.harmony_failure_flag, 'true');
    this._common.navigate(ROUTES.login.absoluteRoute);
  }

  async getJwt() {
    return await this.callAccessTokenService(this.code);
  }
}
