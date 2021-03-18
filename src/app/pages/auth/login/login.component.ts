import { OnInit, Component, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { LoginData } from '@app/models/login-data.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { CommonUtil } from '@app/core/services/common-util.service';
import { LoginContext } from '@app/pages/auth/login/login.context';
import { ROUTES, Microservice, KEYS } from '@app/config';
import { ActivatedRoute, Router } from '@angular/router';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CookieService } from 'ngx-cookie-service';
import { DeviceDetectorService } from 'ngx-device-detector';

declare var pageContext: LoginContext;

const RESPONSE_SUCCESS = 'WAG_W_REG_1046';

@Component({
  selector: 'arxrf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  showLoader = false;

  emailPattern: string;

  accountLocked = false;

  @Input('ssoLogin')
  ssoLogin = false;

  @Input('showArxLogo')
  showArxLogo = true;

  @Input('heading')
  heading = 'Sign in';

  routes = ROUTES;

  invalidLogin = false;

  status: string;
  invalidLoginError =
    'Unable to authenticate, please try again after some time.';

  isPasswordVisible = false;

  fjsdata = '';
  errorMessage: string;
  queryParam: string;
  deviceInfo = null;
  isMobile = false;
  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClientService,
    private _userService: UserService,
    protected _appContext: AppContext,
    private _commonUtil: CommonUtil,
    private _route: ActivatedRoute,
    private _checkout: CheckoutService,
    private _router: Router,
    private _cookieService: CookieService,
    private deviceService: DeviceDetectorService
  ) {
    this._route.queryParams.subscribe(params => {
      this.status = params['status'];
    });
    this.emailPattern = CoreConstants.PATTERN.EMAIL;
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.deviceDetection();
    this.processLoginContext();
  }

  deviceDetection() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    localStorage.setItem('isMobile', this.isMobile.toString());
    // const isTablet = this.deviceService.isTablet();
    // const isDesktopDevice = this.deviceService.isDesktop();
  }

  ngOnInit() {
    if (this._userService.isSSOSessionActive()) {
      // If user comes back from SSO registration page, then we will find registration state as address.
      if ( this._appContext.getRegistrationState() === ROUTES.address.route ) {
        // reseting sso session flag and registration state.
        this._userService.removeSSOSession();
        this._appContext.resetRegistrationState();
      } else {
        this.ssoLogin = true;
        this.heading = 'Sync your account';
      }
    }

    // if (CoreConstants.RESETPASSWORD.status) {
    //   this._messageService.addMessage(
    //     new Message(
    //       CoreConstants.RESETPASSWORD.message,
    //       CoreConstants.RESETPASSWORD.messageType
    //     )
    //   );
    // }
    localStorage.setItem('frst_reg_user', 'false');
    localStorage.removeItem(AppContext.CONST.uInfoStorageKey);
    localStorage.removeItem('ca-state');
    localStorage.removeItem('ca-path');
    this.showHarmonyMessage();
  }

  /**
   * Sending login request for user.
   */
  validUserFunction() {
    if (!this.loginForm.valid) {
      this._commonUtil.validateForm(this.loginForm);
      return;
    }
    this.showLoader = true;
    let data = new LoginData(
      this.loginForm.value.username,
      this.loginForm.value.password,
      ''
    );

    //Validating Wheather the entered user is legacy use or not
    const validateLegacyUser = !this.validateEmail(
      this.loginForm.value.username
    );
    localStorage.setItem(
      'validateLegacyUser',
      JSON.stringify(validateLegacyUser)
    );

    // Creating new login request data in case of SSO Login.
    if (this.ssoLogin) {
      this._userService.setsamlResponse(
        JSON.parse(sessionStorage.getItem(AppContext.CONST.sso_response))
      );
      const _body = this._userService.getsamlResponse();
      let epId;
      if (_body._body !== undefined) {
        const prefillData = JSON.parse(_body._body);
        if (prefillData.EnterprisePersonId) {
          epId = prefillData.EnterprisePersonId;
        }
      }
      data = new LoginData(
        this.loginForm.value.username,
        this.loginForm.value.password,
        epId
      );
    }

    this._checkout.resetCheckoutStatus();

    const getDeviceInfo = sessionStorage.getItem('deviceinfo');
    const promise = this._httpClient.doPostLogin(
      CoreConstants.RESOURCE.login,
      data,
      getDeviceInfo
    );
    /* let promise = this._httpClient.doPost(
       CoreConstants.RESOURCE.login,
       data
     );*/
    promise.then(res => {
      this.showLoader = false;
      if (res.ok) {
        const body = res.json();
        if (body.maxAttempts) {
          this._messageService.addMessage(
            new Message(
              `<b>Account locked for 15 minutes.</b> For immediate assistance, please call 877-250-5823 or\n<a href="/password" class="no_underline" title="reset your password"><strong>reset your password</strong></a>`,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          this.invalidLogin = true;
        } else if (body.messages) {
          if (body.messages[0].code === 'WAG_W_LOGIN_1024') {
            this._userService.accountLocked = true;
            this._router.navigate([ROUTES.max_attempts.absoluteRoute]);
          } else if (body.messages[0].code === 'WAG_I_LOGIN_1000') {
            this._userService
              .logoutSession()
              .then(request => {
                this.validUserFunction();
              })
              .catch(error => {
                this.validUserFunction();
              });
          } else if (body.messages[0].code === 'WAG_E_PROFILE_2009') {
            this._userService.updateJwtCookie();
            this._route.queryParams.subscribe(
              param => (this.queryParam = param.origin)
            );
            if (this.queryParam === 'jahia') {
              localStorage.setItem('jahiapage', '/new-year');
            }
            const refId = body.links[0].href.split('=')[1];
            localStorage.setItem('refId', refId);
            this.getUserInfo(refId)
              .then(response => {
                this._commonUtil.navigate(
                  ROUTES.securityIformation.children.two_fa.absoluteRoute
                );
              })
              .catch(error => {
                // this._userService.loginErrorHandler();
                console.error('error', error);
              });
          } else if (body.messages[0].code === 'WAG_I_PROFILE_2004') {
            this._userService.updateJwtCookie();
            //console.log(`Is legacy user : ${body.isLegacyUser}`);
            this._route.queryParams.subscribe(
              param => (this.queryParam = param.origin)
            );
            if (this.queryParam === 'jahia') {
              localStorage.setItem('jahiapage', '/new-year');
            }
            localStorage.setItem('lite_user', 'false');
            this._userService.initUser1('76756756744', false);
            // this._checkout.fetchInsuranceStatusData();
          } else {
            this._messageService.addMessage(
              // new Message(body.messages[0].message, body.messages[0].type)
              new Message(
                body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
            this.invalidLogin = true;
          }
        } else {
          this.showLoader = true;
          this._userService.initUser1(body.profileId, false);
          // this._checkout.fetchInsuranceStatusData();
        }
      }
    });

    promise.catch(err => {
      localStorage.removeItem('validateLegacyUser');
      this.errorMessage = ARX_MESSAGES.ERROR.wps_cto;
      if (err.status === 401) {
        const body = err.json();
        if (body.messages) {
          if (body.messages[0].message) {
            this.errorMessage = body.messages[0].message;
          }
        }
      }
      this.showLoader = false;
      this._messageService.addMessage(
        new Message(this.errorMessage, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
      );
      console.error(err);
    });
  }

  getUserInfo(refid: string): Promise<any> {
    return this._httpClient.doPost(Microservice.profile_UserInfo, {
      refId: refid
    });
  }

  /**
   * checking SSO state and if sso source is configured.
   *
   * @returns {boolean}
   */
  canProcessSSO() {
    let canDo = false;
    if (
      localStorage.getItem(AppContext.CONST.ssoStorageKey) !== null &&
      this._appContext.ssoSource !== ''
    ) {
      canDo = true;
    }
    return canDo;
  }

  /**
   *
   */
  processLoginContext() {
    try {
      if (
        sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) != null
      ) {
        this._appContext.loginPostSuccess = sessionStorage.getItem(
          AppContext.CONST.login_callback_urlkey
        );
      } else {
        if (pageContext && pageContext.success_url) {
          this._appContext.loginPostSuccess = pageContext.success_url;
        }
      }

      if (sessionStorage.getItem(AppContext.CONST.login_prefill_username_key) != null ) {
        this.loginForm.patchValue({
          username: sessionStorage.getItem(
            AppContext.CONST.login_prefill_username_key
          )
        });
      }
    } catch (e) {
      this._appContext.loginPostSuccess = ROUTES.account.absoluteRoute;
    }
  }

  ngAfterViewInit(): void {
    // adding invalid login error in case status found.
    if (this.status === 'error') {
      this._messageService.addMessage(
        new Message(this.invalidLoginError, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
      );
    }

    this.processResetPasswordInfo();
  }

  /**
   * Processing information for rest password success.
   * if available in session store, message will be displayed and
   * username will be populated in username field.
   */
  processResetPasswordInfo() {
    if (sessionStorage.getItem(AppContext.CONST.resetContentKey) != null) {
      const resetInfoString = sessionStorage.getItem(
        AppContext.CONST.resetContentKey
      );
      const resetInfo = JSON.parse(resetInfoString);

      if (resetInfo['username'] !== undefined) {
        this.loginForm.patchValue({ username: resetInfo['username'] });
      }

      if (resetInfo['message'] !== undefined) {
        this._messageService.addMessage(
          new Message(
            resetInfo['message'],
            ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
            false,
            false,
            true
          )
        );
      }
    }
  }

  validateEmail(email) {
    // tslint:disable-next-line: max-line-length
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  showHarmonyMessage() {
    if (sessionStorage.getItem(KEYS.harmony_failure_flag)) {
      this._messageService.addMessage(
        new Message(
          'To sign in, use the same username and password as your Walgreens account.',
          ARX_MESSAGES.MESSAGE_TYPE.INFO
        )
      );
    }
    sessionStorage.removeItem(KEYS.harmony_failure_flag);
  }
}
