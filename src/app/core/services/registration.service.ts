import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppContext } from './app-context.service';
import { UserService } from './user.service';
import { ROUTES, CoreConstants, KEYS } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { Subject } from 'rxjs';

// Service to handle Registration Form Flow.
@Injectable()
export class RegistrationService {
  static ROUTES = {
    signUp: '/register',
    addressInfo: 'address',
    identityInfo: 'identity',
    consent: 'consent',
    hippa: 'hipaa',
    insuranceInfo: 'insurance',
    success: 'success'
  };
  regLoader = false;

  SERVICES = {
    sequrityQuestions: '/register/common/SecurityQuestions',
    checkPassword: CoreConstants.RESOURCE.checkPassword,
    checkEmail: '/account/csrf-disabled/userNameCheck',
    registration: '/register/csrf-disabled/signup',
    consent: '/account/csrf-disabled/commpref/consent',

    authOptions: function() {
      return '/rx-profile/csrf-disabled/options';
    },

    verifyByPhone: function() {
      return '/rx-profile/csrf-disabled/phone';
    },

    onlineQuestionsFirstSet: function() {
      return '/rx-profile/csrf-disabled/kba/1';
    },

    onlineQuestionSubmision: function() {
      return '/rx-profile/csrf-disabled/kba/2';
    }
  };
  showCircularLoader = new Subject();

  registrationState = '';

  public showFourDotProgressBar = false;

  public signupDataCache = <any>{};

  public insuranceInfo = {
    msEnrollInsuranceBeanForm: {
      msInsProvider: '',
      msInsChId: '',
      msInsGroupNbr: '',
      msInsCardholderName: '',
      msInsCardholderBirthMonth: 0,
      msInsCardholderBirthDay: 0,
      msInsCardholderBirthYear: 0
    },

    AllergyList: [],
    HealthConditionList: [],
    submitService: true
  };

  //flag to check state of verification method selection.
  public verificationSelected: Boolean;

  registrationTitle = 'Create your account';

  public verificationTypePreselect: string;
  
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _appContext: AppContext,
    private _common: CommonUtil
  ) {
    const signupCacheSessionData = window.localStorage.getItem('signupDataCache');
    if(!!signupCacheSessionData) {
      try {
        this.signupDataCache = JSON.parse(signupCacheSessionData);
      } catch(error) {
        console.error('SIGNUPCACHEDATA IS NOT IN JSON FORMAT')
      }
    }
  }

  /**
   * Checking registration state from session store and changing state based on step.
   */
  endureState(): void {
    const regState = this._appContext.getRegistrationState();

    switch (regState) {
      // set registration state to address info of state is blank
      case '':
        this._appContext.setRegistrationState(ROUTES.address.route);
        break;

      // move registration state to identity verification address info is completed
      case ROUTES.address.route:
        if ( this._router.url === ROUTES.registration.absoluteRoute ) {
          // state will be changed if still on register page.
          // If user clicked on back button on address information page.
          this._appContext.setRegistrationState(ROUTES.address.route);
        } else {
          this._appContext.setRegistrationState(ROUTES.identity.route);
        }
        break;

      case ROUTES.identity.route:
        if (sessionStorage.getItem(AppContext.CONST.resetContentKey) != null) {
          // if reset password flag is available in session store then
          // redirecting user to account home, and removing reset password
          // and registration flag.
          sessionStorage.removeItem(AppContext.CONST.resetContentKey);
          this._appContext.setRegistrationState('');
          if ( sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) ) {
            // redirecting to prev url if present in session store.
            this._common.navigate(sessionStorage.getItem(AppContext.CONST.login_callback_urlkey));
            break;
          }
          this._common.navigate(ROUTES.account.absoluteRoute);
        } else {
          // redirecting user to success is case of normal registration flow.
          if (this._userService.isSSOSessionActive()) {
            this._appContext.setRegistrationState(ROUTES.insurance.route);
          } else if (this._userService.user.isReg1ExceptionUser){
              if(!this._userService.user.isRxHIPAAUser){
                this._appContext.setRegistrationState(ROUTES.hippa.route);
              } else if(!this._userService.user.isRxConsentUser) {
                this._appContext.setRegistrationState(ROUTES.consent.route);
              } else {
                this._appContext.setRegistrationState(ROUTES.success.route);
              }
          } else {
            // checking for reset password flow.
            if ( localStorage.getItem(KEYS.reset_flow_flag) &&
                sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) ) {
              localStorage.removeItem(KEYS.reset_flow_flag);
              // redirecting to prev url if present in session store.
              this._common.navigate(sessionStorage.getItem(AppContext.CONST.login_callback_urlkey));
              break;
            }
            this._appContext.setRegistrationState(ROUTES.success.route);
          }
        }
        break;

      case ROUTES.consent.route:
        // checking for reset password flow.
        if ( localStorage.getItem(KEYS.reset_flow_flag) &&
                sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) ) {
          localStorage.removeItem(KEYS.reset_flow_flag);
          // redirecting to prev url if present in session store.
          this._common.navigate(sessionStorage.getItem(AppContext.CONST.login_callback_urlkey));
          break;
        }
        this._appContext.setRegistrationState(ROUTES.success.route);
        break;

      case ROUTES.hippa.route:
        if (this._userService.isSSOSessionActive()) {
          this._appContext.setRegistrationState(ROUTES.insurance.route);
        } else if (this._userService.user.isRxConsentUser){
          // checking for reset password flow.
          if ( localStorage.getItem(KEYS.reset_flow_flag) &&
                sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) ) {
            localStorage.removeItem(KEYS.reset_flow_flag);
            // redirecting to prev url if present in session store.
            this._common.navigate(sessionStorage.getItem(AppContext.CONST.login_callback_urlkey));
            break;
          }
          this._appContext.setRegistrationState(ROUTES.success.route);
        } else {
          this._appContext.setRegistrationState(ROUTES.consent.route);
        }
        break;

      case ROUTES.insurance.route:
        this._appContext.setRegistrationState(ROUTES.success.route);
        break;

      default:
        break;
    }
  }

  nextRoute(): string {
    if (this._appContext.getRegistrationState() !== '') {
      return `${
        ROUTES.registration.route
      }/${this._appContext.getRegistrationState()}`;
    }
    return ROUTES.registration.route;
  }

  enableLoader() {
    this.regLoader = true;
  }

  disableLoader() {
    this.regLoader = false;
  }

  getRegistrationAddBypass() {
    return '/rx-profile/rxAuthentication?reg=acs';
  }
}
