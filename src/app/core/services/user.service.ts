import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { ArxUser } from '@app/models/user.model';
import { HttpClientService } from 'app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import { CheckoutService } from '@app/core/services/checkout.service';
import { ConsentService } from '@app/core/services/consent.service';
import { Microservice } from '@app/config/microservice.constant';
import { ProfileModel } from '@app/models';
import { CookieService } from 'ngx-cookie-service';
import { Response } from '@angular/http';
import { resolve } from 'url';

const CONST = {
  profileServiceUrl: '/svc/profiles/',
  headerURL: '/rx-profile/csrf-disabled/header',
  successCode: 'WAG_I_LOGOUT_1000',
  alreadyLogOutCode: 'WAG_I_LOGOUT_1002',
  logoutUrl: '/profile/csrf-disabled/logout',
  cartInfoURL: '/rx-checkout/csrf-disabled/svc/getInCartRedisCount'
};

// User specific actions.
@Injectable()
export class UserService {
  user: ArxUser;

  accountLocked = false;

  selectedSecurityQuestion: string;

  selectedSecuritQuestionCode: string;
  sso_prime_id: string;
  sso_user = false;
  prev_url: string;
  loaderState = false;
  loaderOverlay = false;
  resetState = true;
  baseDomain: string;
  checkConsentStatusOnLogin = false;

  constructor(
    private _httpService: HttpClientService,
    private _router: Router,
    private _appContext: AppContext,
    private _common: CommonUtil,
    private _checkout: CheckoutService,
    private _cookieService: CookieService,
    private _consentService: ConsentService
    ) {
      let domain  = window.location.host;
      if ( domain.split('.').length > 2 ) {
        domain = domain.substring( domain.indexOf('.'), domain.length ).split(':')[0];
      }
      this.baseDomain = domain;
      console.log("baseDomain: ", this.baseDomain);
    }

  /**
   * Request to initialize user for session.
   *
   * @param {string} userId
   * @param {boolean} isReg
   * @param {string} route
   * @param {boolean} doRefresh
   * @returns {Promise<any>}
   */

  initUser1(
    userId?: string,
    isReg: boolean = false,
    route: string = null,
    doRefresh: boolean = false
  ): Promise<any> {
    return this.fetchUserInformations1(userId, route, doRefresh, isReg);
  }

  // To get transactionId to save the credit card
  getCCToken(cardPayload) {
    const creditCardDetails = cardPayload.creditCard[0];
    const ccReqData = {
      creditCardDetails: [
        {
          creditCardType: creditCardDetails.creditCardType,
          expiryDate: creditCardDetails.expDate
            ? creditCardDetails.expDate
            : creditCardDetails.expiryMonth +
              '/' +
              creditCardDetails.expiryYear.substr(-2),
          piEncryptedValue: creditCardDetails.ccTokenNumber,
          subfid9B: creditCardDetails.subfid9B,
          zipCode: creditCardDetails.zipCode
            ? creditCardDetails.zipCode
            : creditCardDetails.deliveryInfo.zip
        }
      ]
    };
    if (creditCardDetails.rxType) {
      ccReqData.creditCardDetails[0]['rxType'] = creditCardDetails.rxType;
    }
    return this._httpService.postData(Microservice.get_ccToken, ccReqData);
  }

  updateCartRxCount() {
    // get cartInfo service response.
    this.getCartInfoService().subscribe(response => {
      // updating cart count.
      try {
        sessionStorage.setItem(
          AppContext.CONST.key_rx_count,
          response.inCartRedisCount
        );
        const rxCount = document.getElementsByClassName('rx__count') || [];
        if (Number(response.inCartRedisCount) !== 0) {
          if (window.innerWidth > 767) {
            rxCount[0]['style'].display = '';
          } else {
            rxCount[1]['style'].display = '';
          }
        }
        if (window.innerWidth > 767) {
          rxCount[0].innerHTML = response.inCartRedisCount;
        } else {
          rxCount[1].innerHTML = response.inCartRedisCount;
        }
      } catch (e) {}
    });
  }

  fetchUserInformations1(
    userId: string,
    route: string,
    doRefresh: boolean,
    isReg: boolean
  ): Promise<boolean> {
    localStorage.setItem(AppContext.CONST.uidStorageKey, userId);
    if(this.hasJWT() && userId && !route){
      //this scenario means the user is logging in to the app,
      //neeed to check consent
      this.checkConsentStatusOnLogin = true
    }
    const promise = new Promise<boolean>((resolve, reject) => {
      // get header service response.
      this.getProfileInd()
        .toPromise()
        .then(response => {
          // userInfo call
          this._httpService
            .postAuthData(Microservice.userInfo, {
              isTNCRequired: false,
              extSystemIds: false,
              flow: 'ARX'
            })
            .toPromise()
            .then(response1 => {
              if (response1.messages !== undefined) {
                if (response1.messages[0].code === 'WAG_E_NOT_LOGGED_IN_1002') {
                  this.logoutSession();
                }
              }
              if (userId !== response1.profileId) {

                userId = response1.profileId;
                localStorage.setItem(AppContext.CONST.uidStorageKey, userId);
              }
              // check and update sso status.
              if (this._appContext.ssoContent !== undefined) {
                this.user = new ArxUser(userId, true);
              } else {
                this.user = new ArxUser(userId);
              }
              this.user.profile = <ProfileModel>{};
              if (response1 !== undefined) {
                this.user.profile.basicProfile = response1.basicProfile;
                this.processUserInformation(response1);
              }
              if (response1.basicProfile.email) {
                this.user.email = response1.basicProfile.email;
              }
              if (response1.basicProfile.dateOfBirth) {
                this.user.dateOfBirth = response1.basicProfile.dateOfBirth;
              }

              if (response1.basicProfile.userType) {
                this.user.userType = response1.basicProfile.userType;
              }

              if (response1.basicProfile.firstName) {
                this.user.firstName = response1.basicProfile.firstName;
              }
              if (response1.basicProfile.lastName) {
                this.user.lastName = response1.basicProfile.lastName;
              }
              if (response1.basicProfile.gender) {
                this.user.gender = response1.basicProfile.gender;
              }
              if (response1.basicProfile.phone) {
                this.user.phoneNumber = response1.basicProfile.phone[0].number;
                this.user.phoneType = response1.basicProfile.phone[0].type;
              }
              if (response1.basicProfile.homeAddress) {
                this.user.address = response1.basicProfile.homeAddress;
              }

              if (response1.acctStatus === 'ACTIVE') {
                this.user.userName = 'ACTIVE';
                this.user.loggedIn = 'true';
              }
              if (response.auth_ind && response.auth_ind === 'Y') {
                this.user.isRxAuthenticatedUser = true;
              } else {
                this.user.isRxAuthenticatedUser = false;
              }
              if (response.hipaa_ind && response.hipaa_ind === 'Y') {
                this.user.isRxHIPAAUser = true;
              } else {
                this.user.isRxHIPAAUser = false;
              }
              if (response.rx_user && response.rx_user === 'Y') {
                this.user.isRxUser = true;
              } else {
                this.user.isRxUser = false;
              }
              if (response.qr_user && response.qr_user === 'Y') {
                this.user.isQRUser = true;
              } else {
                this.user.isQRUser = false;
              }
              if (response.pat_id) {
                this.user.isPatIdExists = true;
              } else {
                this.user.isPatIdExists = false;
              }
              // updating cart count.
              try {
                sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
              } catch (e) {}
            })
            .then(() => {
              this.resetState = true;
              if (isReg) {
                //If {isNewRegistrationFlow} is found true then voiding redirection to verify identity page.
                if ( !this._appContext.isNewRegistrationFlow ) {
                  this._common.navigate(ROUTES.identity.absoluteRoute);
                }
                resolve(false);
                return;
              } else if (!this.user.isRxUser) {
                if (!route) {
                  route = ROUTES.address.absoluteRoute;
                  sessionStorage.setItem('u_reg_st', 'address');
                      this.resetState = false;
                }
                sessionStorage.setItem('userData', JSON.stringify(this.user));
                sessionStorage.setItem('rx_user', 'true');
                  localStorage.removeItem(AppContext.CONST.uidStorageKey);
                  this.postLoginRedirection(route, doRefresh).then(status => {
                    resolve(status);
                    return;
                  });
              } else if (this.user.isRxAuthenticatedUser === false && ROUTES.identity.absoluteRoute.indexOf(this._router.url) === -1) {
                //If user is not authorized then redirecting to identity verify directly.
                this._common.navigate(ROUTES.identity.absoluteRoute);
                resolve(false);
                return;
              } else {
                localStorage.setItem('lite_user', 'false');
                this.postLoginRedirection(route, doRefresh).then(status => {
                  resolve(status);
                  return;
                });
              }
            })
            .catch(err => {
              console.error("InitUser1 Error: FetchUserInformations1")
              reject(err)
            })
        });
    });
    return promise;
  }
  /**
   * Getting user information from services and validating users's state.
   *
   * checking registration state for user from response from header service.
   * redirecting to respective route on successfull validation.
   *
   * @param {string} userId
   * @param {string} route
   * @param {boolean} doRefresh
   * @param {boolean} isReg
   * @returns {Promise<boolean>}
   */

  checkValidUserInfo(userid: string): boolean {
    let userInfo = <ProfileModel>{};
    userInfo = JSON.parse(
      localStorage.getItem(AppContext.CONST.uInfoStorageKey)
    );
    if (userInfo == null) {
      return false;
    }
    if (userid !== this.user.id) {
      return false;
    }

    if (userid !== userInfo.profileId) {
      return false;
    }
    return true;
  }

  /**
   * Update user information based on response got from profile call.
   * Also update user information in local store.
   *
   *
   * @param response
   */
  processUserInformation1(response1: any, response2: any) {
    this.user.profile = <ProfileModel>{};
    const { basicProfile, acctStatus } = response1;
    if (basicProfile) {
      this.user.profile.basicProfile = basicProfile;
    }
    if (basicProfile.email) {
      this.user.email = basicProfile.email;
    }
    if (basicProfile.dateOfBirth) {
      this.user.dateOfBirth = basicProfile.dateOfBirth;
    }
    if (basicProfile.firstName) {
      this.user.firstName = basicProfile.firstName;
    }
    if (basicProfile.lastName) {
      this.user.lastName = basicProfile.lastName;
    }
    if (basicProfile.gender) {
      this.user.gender = basicProfile.gender;
    }
    if (basicProfile.phone) {
      this.user.phoneNumber = basicProfile.phone[0].number;
      this.user.phoneType = basicProfile.phone[0].type;
    }
    if (basicProfile.homeAddress) {
      this.user.address = basicProfile.homeAddress;
    }

    if (acctStatus === 'ACTIVE') {
      this.user.userName = 'ACTIVE';
      // this.user.headerInfo.profileInfo.loggedIn = 'true';
      this.user.loggedIn = 'true';
    }

    const { auth_ind, hipaa_ind, rx_user, qr_user, pat_id } = response2;

    if (auth_ind === 'Y') {
      this.user.isRxAuthenticatedUser = true;
    } else {
      this.user.isRxAuthenticatedUser = false;
    }
    if (hipaa_ind === 'Y') {
      this.user.isRxHIPAAUser = true;
    } else {
      this.user.isRxHIPAAUser = false;
    }
    if (rx_user === 'Y') {
      this.user.isRxUser = true;
    } else {
      this.user.isRxUser = false;
    }
    if (qr_user === 'Y') {
      this.user.isQRUser = true;
    } else {
      this.user.isQRUser = false;
    }
    if (pat_id) {
      this.user.isPatIdExists = true;
    } else {
      this.user.isPatIdExists = false;
    }
    // this.updateUsernameInHeader();
    try {
      if (this.user) {
        if (this.user.firstName) {
          document.getElementsByClassName(
            'ex__user-info'
          )[0].innerHTML = `Hi, ${this.user.firstName}`;
          document.getElementsByClassName(
            'ex__user-info'
          )[1].innerHTML = `Hi, ${this.user.lastName}`;
        }
      } else {
        if (localStorage.getItem(AppContext.CONST.uInfoStorageKey) != null) {
          const fName = JSON.parse(
            localStorage.getItem(AppContext.CONST.uInfoStorageKey)
          );
          if (fName.firstName) {
            document.getElementsByClassName(
              'ex__user-info'
            )[0].innerHTML = `Hi, ${fName.firstName}`;
            document.getElementsByClassName(
              'ex__user-info'
            )[1].innerHTML = `Hi, ${fName.lastName}`;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Update user information based on response got from profile call.
   * Also update user information in local store.
   *
   *
   * @param response
   */
  processUserInformation(response: any) {
    // storing user information in session store for later use.

    localStorage.setItem(
      AppContext.CONST.uInfoStorageKey,
      JSON.stringify(response)
    );

    const { basicProfile, acctStatus } = response;
    this.user.profile = <ProfileModel>{};
    if (this.user !== undefined) {
      this.user.profile.basicProfile = basicProfile;
    }
    if (basicProfile.email) {
      this.user.email = basicProfile.email;
    }
    if (basicProfile.dateOfBirth) {
      this.user.dateOfBirth = basicProfile.dateOfBirth;
    }
    if (basicProfile.firstName) {
      this.user.firstName = basicProfile.firstName;
    }
    if (basicProfile.lastName) {
      this.user.lastName = basicProfile.lastName;
    }
    if (basicProfile.gender) {
      this.user.gender = basicProfile.gender;
    }
    if (basicProfile.phone) {
      this.user.phoneNumber = basicProfile.phone[0].number;
      this.user.phoneType = basicProfile.phone[0].type;
    }
    if (basicProfile.homeAddress) {
      this.user.address = basicProfile.homeAddress;
    }
    if (acctStatus === 'ACTIVE') {
      this.user.userName = 'ACTIVE';
      this.user.loggedIn = 'true';
    }
    this.updateUsernameInHeader();
  }

  updateUsernameInHeader() {
    try {
      const exUserInfo = document.getElementsByClassName('ex__user-info') || [];
      if (this.user) {
        if (this.user.firstName && exUserInfo.length > 0) {
          exUserInfo[0].innerHTML = `Hi, ${this.user.firstName}`;
          exUserInfo[1].innerHTML = `Hi, ${this.user.lastName}`;
        }
      } else {
        if (localStorage.getItem(AppContext.CONST.uInfoStorageKey)) {
          const fName = JSON.parse(
            localStorage.getItem(AppContext.CONST.uInfoStorageKey)
          );
          if (fName.firstName && exUserInfo.length > 0) {
            exUserInfo[0].innerHTML = `Hi, ${fName.firstName}`;
            exUserInfo[1].innerHTML = `Hi, ${fName.lastName}`;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * User profile information service request.
   *
   * @param {string} userId
   * @returns {Promise<any>}
   */
  profileCall(userId: string, force: boolean = false): Promise<any> {
    if (this.checkValidUserInfo(userId) && !force) {
      return new Promise<any>(resolve => {
        resolve(
          JSON.parse(localStorage.getItem(AppContext.CONST.uInfoStorageKey))
        );
      });
    } else if (localStorage.getItem('refId') != null) {
      return this.getUserInfo(localStorage.getItem('refId'));
    } else {
      return this._httpService
        .postAuthData(Microservice.userInfo, {
          isTNCRequired: false,
          extSystemIds: false
        })
        .toPromise();
    }
  }

  /**
   * User header information service request.
   *
   * @returns {Promise<any>}
   */
  getProfileInd(): Observable<any> {
    return this._httpService.postData(CONST.headerURL, { flow: 'ARX' });
  }

  getCartInfoService(): Observable<any> {
    return this._httpService.getData(CONST.cartInfoURL);
  }

  getUserInfoService(): Observable<any> {
    return this._httpService.postData(CONST.headerURL, { flow: 'ARX' });
  }

  /**
   * Logout User
   *
   * @returns {Promise<any>}
   */
  // tslint:disable-next-line: deprecation
  doLogout(): Promise<Response> {
    return this._httpService.doPost(CONST.logoutUrl, {});
  }

  consentCheckRequest() {
    return this._httpService.postData(
      '/account/csrf-disabled/commpref/consent',
      {}
    );
  }

  consentPromise = () => {
    return new Promise<boolean>((resolve, reject) => {
      this.consentCheckRequest().subscribe(
        response => {
          //Check consent status
          if (response && response.CONSENT_PROMPT_IND === 'N') {
            this.user.isRxConsentUser = true;
          } else {
            this.user.isRxConsentUser = false;
          }

          //if user already passed OVR, consent, and HIPAA and is reg1 user
          //they can go straight to login
          if(
            this.user.isReg1ExceptionUser
              && this.user.isRxAuthenticatedUser
              && this.user.isRxConsentUser
              && this.user.isRxHIPAAUser
            ) {
            resolve(true);
          }

          //if Online Verification complete, route reg1 users to hipaa or consent page
          if(this.user.isReg1ExceptionUser){
            if(!this.user.isRxAuthenticatedUser){
              this._appContext.setRegistrationState(ROUTES.verify_identity.route);
              resolve(true);
            }
            if(!this.user.isRxHIPAAUser){
              this._appContext.setRegistrationState(ROUTES.hippa.route);
              resolve(true);
            }
            if(!this.user.isRxConsentUser){
              this._appContext.setRegistrationState(ROUTES.consent.route);
              resolve(true);
            }
          }
          
          //if user already passed online verification and is reg2 user
          //they can go straight to login
          if(this.user.isReg2ExceptionUser && this.user.isRxAuthenticatedUser) {
            resolve(true);
          }
          //this scenario should never be hit, but is a catch all in case:
          resolve(false);
        },
        errorMsg => {
          //if consent service return 500, allow user to go to home page
          console.log("consent observable error block reached:", errorMsg)
          resolve(true);
        },
        () => {
          console.log("consent call failed; intercept service returned Observable.empty but user can continue")
          //if consent service return 500, allow user to go to home page
          resolve(true);
        }
      );
    });
  };

  /**
   * Checking registration state for user.
   *
   * @returns {boolean}
   */
  checkRegStatus(): Promise<boolean> {
    //ARXDIGITAL-7887 verification, hipaa, consent exception flow
    let status = false;
    const reg2consentPending = localStorage.getItem(AppContext.CONST.reg2_consent_pending);
    const reg2hipaaPending = localStorage.getItem(AppContext.CONST.reg2_HIPAA_pending);
    if (reg2hipaaPending || reg2consentPending){
      this.user.isReg2ExceptionUser = true;
    } else {
      this.user.isReg1ExceptionUser = true;
    }
    if (this.user.userType === 'LITE') {
      status = true;
    } else if (!this.user.isRxUser) {
      status = false;
    } else if (this.checkConsentStatusOnLogin) {
      this.checkConsentStatusOnLogin = false;
      return this.consentPromise();
    } else if (!this.user.isRxAuthenticatedUser || !this.user.isPatIdExists) {
      this._appContext.setRegistrationState(ROUTES.identity.route);
      const isRefillReminder = window.sessionStorage.getItem(
        AppContext.CONST.registration_callback_urlkey
      );

      if (
        isRefillReminder &&
        isRefillReminder.indexOf(ROUTES.home_delivery_refill_reminder.route) >
          -1
      ) {
        // if HD refill reminder then add a flag
        window.sessionStorage.setItem(
          AppContext.CONST.hd_rr_unauth_user,
          'true'
        );
      }
      status = false;
    } else {
      status = true;
    }

    return new Promise<boolean>((resolve, reject) => {
      resolve(status);
    });
  }

  logoutSession(): Promise<any> {
    return this._httpService
      .doPost(CONST.logoutUrl, {})
      .then(resp => {
        this.logoutCleanUp();
      })
      .catch(err => {
        this.logoutCleanUp();
      });
  }

  /**
   * Process user redirection after login based on configurations.
   *
   * @param {string} route
   * @param {boolean} doRefresh
   */
  postLoginRedirection(route: string, doRefresh: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.user.userName !== 'ACTIVE') {
        this.user.loggedIn = 'false';
        this.logoutSession()
          .then(response => {
            this._common.navigate(ROUTES.login.absoluteRoute);
            resolve(true);
          })
          .catch(error => {
            this._common.navigate(ROUTES.login.absoluteRoute);
            resolve(true);
          });
      } else {
        this.checkRegStatus().then(status => {
          if (!status) {
            // In case of in complete registration user should be redirected to registration page.
            // In redirect to registration page incase trying to access any other route.
            if (route) {
              if (
                route !==
                ROUTES.registration.absoluteRoute +
                  '/' +
                  this._appContext.getRegistrationState()
              ) {
                route =
                  ROUTES.registration.absoluteRoute +
                  '/' +
                  this._appContext.getRegistrationState();
                this._common.navigate(route);
                resolve(false);
              }
              resolve(true);
            } else {
              // redirecting user to specific registration step based on reg status.
              this._common.navigate(
                `${
                  ROUTES.registration.absoluteRoute
                }/${this._appContext.getRegistrationState()}`
              );
              resolve(false);
            }
          } else {
            //mark reg2 abandoned users who completed verification as consented
            if( this.user.isReg2ExceptionUser ) {
              if ( !this.user.isRxHIPAAUser && !this.user.isRxConsentUser ) {
                // If both hipaa and consent are not recorded.
                Promise.all([this._consentService.initiateHipaCall(true), this._consentService.initiateConsentCall(true)])
              } else if ( !this.user.isRxHIPAAUser && this.user.isRxConsentUser ) {
                // If only hipaa is not recorded.
                Promise.resolve( this._consentService.initiateHipaCall(true) );
              } else if ( !this.user.isRxConsentUser && this.user.isRxHIPAAUser ) {
                // If only consent is not recorded.
                Promise.resolve( this._consentService.initiateConsentCall(true) );
              }
            }
            if (window.sessionStorage.getItem('prev_url_registration')) {
              this.prev_url = window.sessionStorage.getItem(
                'prev_url_registration'
              );
            } else if (window.sessionStorage.getItem('prev_url')) {
              const FMurl = window.sessionStorage.getItem('prev_url');
              if (FMurl.includes('family-management/account-invite')) {
                this.prev_url = window.sessionStorage.getItem('prev_url');
              }
            }

            // removing sso session after success full sync.
            if (this.isSSOSessionActive()) {
              this.removeSSOSession();
            }
            sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);
            sessionStorage.removeItem(
              AppContext.CONST.registration_callback_urlkey
            );

            // removing reset password flag if present.
            if (
              sessionStorage.getItem(AppContext.CONST.resetContentKey) != null
            ) {
              sessionStorage.removeItem(AppContext.CONST.resetContentKey);
            }
            if (this.resetState) {
            this._appContext.resetRegistrationState();
            }
            if (route) {
              if (doRefresh) {
                this._common.navigate(route);
              } else {
                this._router.navigateByUrl(route);
              }
            } else {
              if (this.prev_url != null) {
                this._appContext.loginPostSuccess = this.prev_url;
              }
              if (localStorage.getItem('jahiapage')) {
                route = localStorage.getItem('jahiapage');
                localStorage.removeItem('jahiapage');
                this._common.navigate(route);
              } else {
                this._common.navigate(this._appContext.loginPostSuccess);
              }
            }
            resolve(true);
          }
        })
        .catch(errMsg =>{
          console.error('InitUser1 Error: CheckRegStatus')
          reject('InitUser1 Error: PostLoginRedirection')
        })
      }
    });
  }

  /**
   * Pre SSO Purge -
   */
  preSSOPurge(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this._cookieService.check('jwt')) {
        // logout and delete cookie if session found
        // end server session
        this.doLogout().then(
          res => {
            if (res.status === 200) {
              resolve('logout completed');
            } else {
              reject('logout not completed');
            }
          },
          () => {
            reject('logout not completed');
          }
        );
      } else {
        //purge local storage keys
        localStorage.removeItem(AppContext.CONST.uInfoStorageKey);
        localStorage.removeItem(AppContext.CONST.uidStorageKey);
        localStorage.removeItem(AppContext.CONST.insuranceOnData);

        // purge session storage keys
        sessionStorage.removeItem(AppContext.CONST.sso_response);
        sessionStorage.removeItem(AppContext.CONST.key_rx_count);
        sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);

        // no session to logout of, proceed with sso
        reject('no session to logout');
      }
    });
  }

  preSSOPurge1(): Promise<any> {
    // Return a new promise
    return new Promise(function(resolve, reject) {
      // run the logout call
      const logout = this._httpService.doPost(CONST.logoutUrl, {});
      logout.subscribe(res => {
        // check status
        if (res.status === 200) {
          // Resolve the promise with the response text
          resolve(res.status);
        } else {
          // Otherwise purge local storage keys and
          // reject with the status text
          localStorage.removeItem(AppContext.CONST.uInfoStorageKey);
          localStorage.removeItem(AppContext.CONST.uidStorageKey);
          localStorage.removeItem(AppContext.CONST.insuranceOnData);

          //purge session storage keys
          sessionStorage.removeItem(AppContext.CONST.sso_response);
          sessionStorage.removeItem(AppContext.CONST.key_rx_count);
          sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);

          // Reject the promise with the response text
          reject(res.status);
        }
      });
    });
  }

  /**
   * Action to lean up user information after logout..
   */
  logoutCleanUp() {
    const redirect_url_back = sessionStorage.getItem(
      AppContext.CONST.login_callback_urlkey
    );

    const consentPending = localStorage.getItem(AppContext.CONST.reg2_consent_pending);
    const hippaPending = localStorage.getItem(AppContext.CONST.reg2_HIPAA_pending);
    localStorage.removeItem(AppContext.CONST.uidStorageKey);
    localStorage.removeItem(AppContext.CONST.ssoStorageKey);
    localStorage.clear();
    if(consentPending){
      localStorage.setItem(AppContext.CONST.reg2_consent_pending, "true");
    }
    if(hippaPending){
      localStorage.setItem(AppContext.CONST.reg2_HIPAA_pending, "true");
    }

    if (sessionStorage.getItem('prev_url_registration') && sessionStorage.getItem('prev_url_registration').indexOf('&type')
    && sessionStorage.getItem('prev_url_registration').indexOf('&utm_source')
    && sessionStorage.getItem('prev_url_registration').indexOf(ROUTES.home_delivery_refill_reminder.route)) {
      sessionStorage.removeItem(AppContext.CONST.registration_callback_urlkey);
    }

    // save registration callback URL and add back to session
    const regCallBack = sessionStorage.getItem(
      AppContext.CONST.registration_callback_urlkey
    );

    sessionStorage.removeItem(AppContext.CONST.memberActiveKey);
    sessionStorage.removeItem(AppContext.CONST.uInfoStorageKey);
    sessionStorage.clear();
    
    this._checkout.resetCheckoutStatus();

    // add back the registration callback URL
    if (regCallBack) {
      sessionStorage.setItem(
        AppContext.CONST.registration_callback_urlkey,
        regCallBack
      );
    }
    if (redirect_url_back != null) {
      sessionStorage.setItem(
        AppContext.CONST.login_callback_urlkey,
        redirect_url_back
      );
    }
    sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);
    
    this.user = undefined;

    this.deleteWAGCookies();
  }

  loginErrorHandler() {
    this.logoutSession()
      .then(response => {
        this._common.navigate(ROUTES.login.absoluteRoute);
      })
      .catch(error => {
        this._common.navigate(ROUTES.login.absoluteRoute);
      });
  }

  /**
   * fetching user profile data from services and storing in session store.
   *
   * @returns {Promise<void>}
   */
  async updateUserCachedInfo() {
    this.profileCall(this.user.id, true).then(response => {
      this.processUserInformation(response);
    });
  }
  setPrimeID(value: string) {
    this.sso_prime_id = value;
  }
  getPrimeID() {
    return this.sso_prime_id;
  }
  setsamlResponse(value) {
    sessionStorage.setItem(
      AppContext.CONST.sso_response,
      JSON.stringify(value)
    );
  }
  getsamlResponse() {
    return JSON.parse(sessionStorage.getItem(AppContext.CONST.sso_response));
  }
  isSSOSessionActive() {
    return (
      sessionStorage.getItem(AppContext.CONST.sso_session_state_key) != null
    );
  }

  setSSOSession() {
    sessionStorage.setItem(AppContext.CONST.sso_session_state_key, 'true');
  }

  removeSSOSession() {
    sessionStorage.removeItem(AppContext.CONST.sso_session_state_key);
  }

  isSSOSuccess() {
    return sessionStorage.getItem('sso_success') != null;
  }

  setSSOSuccess() {
    sessionStorage.setItem('sso_success', 'true');
  }

  removeSSOSuccess() {
    sessionStorage.removeItem('sso_success');
  }

  // tslint:disable-next-line: member-ordering
  static isLoggedIn(): boolean {
    return localStorage.getItem(AppContext.CONST.uidStorageKey) != null;
  }

  getActiveMemberId() {
    let activeMemberId;
    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey) == null) {
      if (this.user && this.user.id) {
        activeMemberId = this.user.id;
      }
    } else {
      activeMemberId = JSON.parse(
        sessionStorage.getItem(AppContext.CONST.memberActiveKey)
      ).active;
    }

    return activeMemberId;
  }

  getActiveMemberName() {
    const activeMemberId = this.getActiveMemberId();
    const members = localStorage.getItem('members');
    let activememberName = '';
    if (members) {
      const member = JSON.parse(members).find(
        item => item.profileId === activeMemberId
      );
      activememberName = member.firstName + ' ' + member.lastName;
    }
    return activememberName;
  }

  getUserInfo(refid: string): Promise<any> {
    return this._httpService.doPost(Microservice.userInfo, { refId: refid });
  }

  callRefreshToken() {
      console.log("UserService.callRefreshToken()");
    this._httpService
      .doPost('/profile/v1/token/refresh', {})
      .then(() => { this.updateJwtCookie() });
      //.catch(error => {});
  }

  getDrugObj(type, item) {
    const obj = {};
    if (type === 'Drug Allergies' && item.allergyCode) {
      obj['allergyCode'] = item.allergyCode;
    } else {
      obj['ids'] = item.drugId;
    }
    return obj;
  }

  deleteDrugObj(type, id, allergyCode) {
    const obj = {};
    if (type === 'Drug Allergies' && typeof id === 'undefined' && allergyCode) {
      obj['allergyCode'] = allergyCode;
    } else {
      obj['ids'] = id;
    }
    return obj;
  }

  //Add the Cookie
  updateCookie(event) {
    document.cookie = `${event}=false;domain=${this.baseDomain};path=/;max-age=31536000`;
  }

  deleteWAGCookies() {

    // these come from WAG services and are normally cleared on a call to the logout service
    // but in the case of a timeout or if the JWT is expired the logout call will fail so
    // including this code to manually remove the cookies
    this._cookieService.delete('encLoyaltyId', '/', this.baseDomain);
    this._cookieService.delete('3s', '/', this.baseDomain);
    this._cookieService.delete('FirstName', '/', this.baseDomain);
    this._cookieService.delete('WAG_3S_TOKEN', '/', this.baseDomain);
    this._cookieService.delete('mal', '/', this.baseDomain);
    this._cookieService.delete('profileId', '/', this.baseDomain);
    this._cookieService.delete('myWagId', '/', this.baseDomain);
    this._cookieService.delete('jwt', '/', this.baseDomain);
    this._cookieService.delete('session_id', '/', this.baseDomain);

    // dynatrace cookies
    this._cookieService.delete('dtCookie', '/', this.baseDomain);
    this._cookieService.delete('dtLatC', '/', this.baseDomain);
    this._cookieService.delete('dtPC', '/', this.baseDomain);
    this._cookieService.delete('dtSa', '/', this.baseDomain);
    this._cookieService.delete('rxvt', '/', this.baseDomain);
    this._cookieService.delete('rxVisitor', '/', this.baseDomain);

    // the only cookies which should remain post session are GA, 2FA, and 4C (surveys)

  }

  hasJWT() {
    return this._cookieService.check('jwt');
  }

  //Validate the Cookie
  checkCookie(cookieName) {
    let result = false;
    document.cookie.split(';').forEach(element => {
      const cookieEle = element.split('=');
      if (cookieEle[0].includes(cookieName)) {
        result = true;
      }
    });
    return result;
  }

  /**
   * Updating JWT cookie to convert it to a session cookie.
   */
  public updateJwtCookie() {
    let jwt = this._cookieService.get('jwt');
    if ( jwt ) {
      document.cookie = `jwt=${jwt}; path=/; domain=${this.baseDomain}`;
    }
  }
}
