import { Component, OnInit } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { PasswordCheckData } from '@app/models';
import { AppContext } from '@app/core/services/app-context.service';
import { CoreConstants, ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { REG_MAP } from '@app/content-mapping/register-content-mapping';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import { SecurityQuestion2faComponent } from '@app/pages/security-info/components/security-question-2fa/security-question-2fa.component';

const RESPONSE_SUCCESS = 'WAG_W_REG_1046';
const RESPONSE_EXIST = 'WAG_W_REG_1047';

@Component({
  selector: 'arxrf-signup-basic',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;

  wpExist = false;

  showDeclarationError = false;
  litefirstName: string;
  litelastName: string;
  liteEmail: string;
  litepassword: string;
  liteRegFlag: boolean;


  wpExistPopupStyle = {
    visibility: 'visible',
    opacity: 1,
    display: 'block',
    'pointer-events': 'auto'
  };

  PHONE_TYPES = ['Cell', 'Home', 'Work'];
  selectedPhoneType: string;

  questions: any[];
  inputType = 'password';
  passwordCheckMessage: string;
  dobCheckMessage: string;
  showDobCheckMessage: boolean = false;
  emailCheckStatus = true;
  emailCheckMessage = '';
  passwordInFocus = false;
  declarationStatus = false;
  firstNameBlurred = false;
  lastNameBlurred = false;
  loginBlurred = false;
  passwordBlurred = false;
  dobBlurred = false;
  phoneNumberBlurred = false;
  phoneTypeBlurred = false;
  securityQuestionBlurred = false;
  securityAnswerBlurred = false;
  duplicateAccountMsg = false;
  loginTooltip = false;
  passwordTooltip = false;
  dobTooltip = false;
  phoneNumberTooltip = false;
  securityQuestionTooltip = false;
  securityQuestionAnswerTooltip = false;

  // Object structure for request data.
  registrationRequestData = {
    emailOptInInd: false,
    regSource: 'rx'
  };
  wgText: string;

  reg_login_content;

  isLikelyDesktop = true;

  randomNumber: number = Math.floor(Math.random() * Math.random() * 100000000);
  
  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClientService,
    private router: Router,
    private _datePipe: DatePipe,
    private _messageService: MessageService,
    public _registrationService: RegistrationService,
    private _appContext: AppContext,
    private _userService: UserService,
    private _commonUtil: CommonUtil,
    private _gaService: GaService,
    public _contentService: JahiaContentService
  ) {
    this.getRegLoginContent();
    this.wgText = this._appContext.isSpsite ? '' : ' and walgreens.com';

    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;

    this.initialiseForm(dateConfig);
    this.getQuestions();

    const userAgent = window.navigator.userAgent;
  }


  ngOnInit() {
    /**
     * Handling/ Updating registration state for user after validating current registration state.
     * handling back button cases for address and identity state.
     *
     * For address state - reseting registration state and prefilling the form.
     * For identiy state - redirecting user back to identity page as, user is already logged in.
     */
    switch( this._appContext.getRegistrationState() ) {
      // if pressed back from address/additon infromation step.
      case ROUTES.address.route:
        this._appContext.resetRegistrationState();
        this.populateCachedInformation();
        this.signUpForm.controls['password'].setValue("");
        this.signUpForm.controls['securityQuestionAnswer'].setValue("");
        break;

      // If pressed back from identiy verification step,
      // user will be redirected back to identity verfication page.
      case ROUTES.identity.route:
        this._commonUtil.navigate( ROUTES.identity.absoluteRoute );
        break;

      // Default case for registration flow.
      default:
       this.setLiteRegValues();
       this.selectedPhoneType='Cell'
       this.signUpForm.controls['phoneType'].setValue(
         'Cell'
       );
       break;
    }

    const deviceInfo = sessionStorage.getItem('deviceinfo');
    if(deviceInfo){
      const parsedData = JSON.parse(deviceInfo);
      const touchSupport = parsedData.touchSupport
      if(touchSupport){
        this.isLikelyDesktop = !touchSupport[1]
      }
    }
  }

  /**
   * Populating signup form with cached data.
   */
  private populateCachedInformation() {
    if (Object.keys(this._registrationService.signupDataCache).length) {
      this.signUpForm.patchValue(this._registrationService.signupDataCache);
    }
    if ( this._registrationService.signupDataCache.phoneType ) {
      this.selectedPhoneType = this._registrationService.signupDataCache.phoneType;
    }
  }

  setLiteRegValues() {
    if (localStorage.getItem('frst_reg_user') !== 'true') {
      const liteRegValue = JSON.parse(
        localStorage.getItem(AppContext.CONST.uInfoStorageKey)
      );

      if (liteRegValue !== null) {
        this.liteRegFlag = true;
        this.litefirstName = liteRegValue.basicProfile.firstName;
        this.litelastName = liteRegValue.basicProfile.lastName;
        this.liteEmail = liteRegValue.basicProfile.email;
        this.signUpForm.patchValue({
          firstName: this.litefirstName,
          lastName: this.litelastName,
          login: this.liteEmail
        });
      }
      localStorage.removeItem('frst_reg_user');
    }
  }

  initialiseForm(dateConfig: DateConfigModel) {
    this.signUpForm = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(CoreConstants.PATTERN.NAME), this._commonUtil.onlyWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.pattern(CoreConstants.PATTERN.NAME), this._commonUtil.onlyWhitespaceValidator]],
      dateOfBirth: ['', [Validators.required, ValidateDate(dateConfig)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(CoreConstants.PATTERN.PHONE)]],
      phoneType: ['',Validators.required],
      login: ['', [Validators.required, Validators.pattern(CoreConstants.PATTERN.EMAIL)]],
      password: ['', Validators.required],
      securityQuestionCode: ['', Validators.required],
      securityQuestionAnswer: ['', [Validators.required, this._commonUtil.onlyWhitespaceValidator]],
      declaration: ['', Validators.required]
    });
  }

  checkboxFlag() {
    this.inputType === 'text' ? this.inputType = "password" : this.inputType = 'text';
  }

  updatePhoneType(e){
    let newPhoneType = e.target.value;
    if (newPhoneType.indexOf("'") > -1) {
      newPhoneType = newPhoneType.slice(1)
    };
    this.selectedPhoneType = newPhoneType
    this.signUpForm.controls['phoneType'].setValue(
      this.selectedPhoneType
    );
  }

  // This method is called after component is initiated.
  // This will fetch list of security questions.
  getQuestions() {
    const promise = this._httpClient
      .doGet(this._registrationService.SERVICES.sequrityQuestions)
      .then(res => {
        if (res.ok) {
          this.questions = res.json().securityQuestions.map((val) => ({
            key: val.code,
            value: val.question
          }));
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  toggleCaps(show){
    this.showTooltip('password');
    this.passwordInFocus = show;
  }

  // This method will be called on password field blur.
  // This will send a request with required data to check password service.
  checkPassword(event) {
    this.blurField('password');
    this.toggleCaps(false)
    if (this.signUpForm.value.password !== '') {
      const data = new PasswordCheckData(
        this.signUpForm.value.firstName,
        this.signUpForm.value.lastName,
        this.signUpForm.value.login,
        this.signUpForm.value.password
      );

      const promise = this._httpClient
        .doPost(this._registrationService.SERVICES.checkPassword, data)
        .then(res => {
          // For valid response checkiing the response message and updating password check message.
          if (res.ok) {
            const body = res.json();
            if (body.messages) {
              if( body.messages[0].message.indexOf("30") > -1 || body.messages[0].message.indexOf("8") > -1){
                this.passwordCheckMessage = "Must contain between 8 and 30 characters.";
              } else if( body.messages[0].message.indexOf("numbers") > -1  ){
                this.passwordCheckMessage = "Must contain both numbers and letters.";
              } else if (this.signUpForm.value.login === this.signUpForm.value.password) {
                this.passwordCheckMessage = "The password you entered is the same as your name or email address. Please try again.";
              } else if (body.messages[0].type === ARX_MESSAGES.MESSAGE_TYPE.WARN) {
                this.passwordCheckMessage = body.messages[0].message;
              } else {
                this.passwordCheckMessage = '';
              }
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    } else {
      this.passwordCheckMessage = null;
    }
  }

  // This method will be called on password field blur.
  // This will send a request with required data to check password service.
  checkEmail(event) {
    this.blurField('login');
      if (this.signUpForm.value.login !== '') {
        const emailData = { userName: this.signUpForm.value.login };
        const promise = this._httpClient.doPost(
          this._registrationService.SERVICES.checkEmail,
          emailData
        );
        // For valid response checkiing the response message and updating email check message.
        promise
          .then(res => {
            if (res.ok) {
              const body = res.json();
              if (body.messages) {
                this.emailCheckStatus = false;
                if( body.messages[0].code === "WAG_W_REG_1009" || body.messages[0].code === "WAG_E_PRIME_SAML_1020"){
                  this.duplicateAccountMsg = true;
                } else {
                  this.duplicateAccountMsg = false;
                }
              } else {
                this.duplicateAccountMsg = false;
                this.emailCheckStatus = true;
                this.emailCheckMessage = null;
              }
            }
          })
          .catch(err => {
            console.error(err);
          });
      }
  }


  checkDOB(dateOfBirth: string) {
    this.showDobCheckMessage = false;
    this.blurField(dateOfBirth);
    const dobControl = this.signUpForm.controls.dateOfBirth;
    if (dobControl.errors && 
      this.signUpForm.controls.dateOfBirth.value.length > 0 && 
      this.signUpForm.controls.dateOfBirth.value.length < 10
    ) {
      this.showDobCheckMessage = true;
      this.dobCheckMessage = 'Please enter a complete date of birth.'
    } else if (dobControl.errors && dobControl.errors.required) {
      this.showDobCheckMessage = true;
      this.dobCheckMessage = 'Please enter your date of birth.'
    } else if (dobControl.errors && dobControl.errors.validDate) {
      this.showDobCheckMessage = true;
      this.dobCheckMessage = 'Please enter valid date.'
    } else if (dobControl.value) {
      const currentYear = new Date().getFullYear();
      const yearOfBirth = this.signUpForm.controls.dateOfBirth.value.slice(-4);
      if (currentYear - yearOfBirth < 13) {
        this.showDobCheckMessage = true;
        this.dobCheckMessage = 'Account holders must be 13 years of age or older.';
      }
    }
  }

  declarationReadAndAgreeToPolicy(event) {
    this.declarationStatus = event.target.checked;
    if (this.declarationStatus) {
      this.showDeclarationError = false;
    } else {
      this.showDeclarationError = true;
    }
  }

  scrollToError() {
    window.setTimeout(function() {
      if (document.querySelector(".input__error")) {
        document
          .querySelector(".input__error")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  submitDetails(force: boolean) {
    if (!this.declarationStatus) {
      this.showDeclarationError = true;
      this._commonUtil.validateForm(this.signUpForm);
      this.scrollToError();
      return;
    }
    if (!this.signUpForm.valid) {
      this._commonUtil.validateForm(this.signUpForm);
      this.scrollToError();
      return;
    }
    this._registrationService.showCircularLoader.next(true);
    if (force && this.wpExist) {
      this.registrationRequestData['forceReg'] = true;
      this.wpExist = false;
    }

    const originalPhone = this.signUpForm.value.phoneNumber;
    const formattedPhone = this._commonUtil.convertToDigitsOnlyPhoneNumber(
        this.signUpForm.value.phoneNumber
      );
    //adding digits only in local store so that
    localStorage.setItem('phone', formattedPhone);
    Object.assign(this.registrationRequestData, this.signUpForm.value);
    delete this.registrationRequestData['declaration'];

    if (this.registrationRequestData['securityQuestionCode'] === -1) {
      this.securityQuestionBlurred = true;
      return;
    };

    this.registrationRequestData['dateOfBirth'] = this._datePipe.transform(
      this.signUpForm.value.dateOfBirth,
      'MM/dd/yyyy'
    );
    this.registrationRequestData['phoneNumber'] = formattedPhone;

    const promise = this._httpClient.doPost(
      this._registrationService.SERVICES.registration,
      this.registrationRequestData
    );

    this._registrationService.signupDataCache = this.registrationRequestData;
    window.localStorage.setItem('signupDataCache', JSON.stringify(this.registrationRequestData));

    //reformat phone in case user clicks back
    this.registrationRequestData['phoneNumber'] = originalPhone;

    //mark terms as accepted in case reg flow is abandoned,
    //we can set it as accepted later
    localStorage.setItem(AppContext.CONST.reg2_consent_pending, "true");
    localStorage.setItem(AppContext.CONST.reg2_HIPAA_pending, "true");

    //mark reg service as termsCheckboxAccepted accepted in state
    //so we only mark them as consented on confirmation page accordingly
    this._appContext.setTermsCheckboxAccepted("true");

    // For form submission
    promise
      .then(res => {
        this._registrationService.showCircularLoader.next(false);
        if (res.ok) {
          const body = res.json();
          if (body.messages && !this.wpExist) {
            let item = body.messages[0].code;
            if (sessionStorage.getItem('rx_user')) {
              item = RESPONSE_SUCCESS;
            }
            switch (item) {
              case RESPONSE_SUCCESS:
                this._gaService.sendEvent(this.gaEvent());
                this._registrationService.endureState();
                this.router.navigateByUrl(
                  this._registrationService.nextRoute()
                );
                break;

              case RESPONSE_EXIST:
                this._registrationService.showCircularLoader.next(false);
                this.wpExist = true;
                break;

              default:
                // ARXDIGITAL-8249 START
                let message = body.messages[0].message;
                if (body.messages[0].code == "WAG_W_REG_1009") {
                  message = message.replace('login.jsp', 'login');
                }
                this._messageService.addMessage(
                  new Message(message, body.messages[0].type)
                );
                // ARXDIGITAL-8249 END
                break;
            }
          } else if (body.profileId !== undefined && !force) {
            this._userService.initUser1(body.profileId, true).then(response => {
              this._registrationService.registrationState =
                ROUTES.identity.route;
              this.router.navigate([this._registrationService.nextRoute()]);
            });
            //Clicking 'No' on thePossible matching account modal
            //should lead to this block:
          } else if (body.links.length !== 0) {
            body.links.map(item => {
              if (
                item.rel === 'redirect' &&
                item.href ===
                  this._registrationService.getRegistrationAddBypass()
              ) {
                this._userService.initUser1('', true).then(response => {
                  this._registrationService.registrationState =
                    ROUTES.identity.route;
                  this.router.navigate([this._registrationService.nextRoute()]);
                });
              }
            });
          }
        }
      })
      .catch(err => {
        this._registrationService.showCircularLoader.next(false);
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
  }

  udpatePopupStyle() {
    return this.wpExistPopupStyle;
  }

  sendToLogin() {
    this.router.navigate(['/login']);
  }

  preparePhoneNumber(phNumber: string) {
    const removeSpaceFromPhone = phNumber.replace(/\D/g, '');
    return removeSpaceFromPhone;
  }

  // remove previous service error message for email
  resetPreviousErrorMsg() {
    this.emailCheckMessage = '';
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.signup;
    return event;
  }

  get signupCtl() {
    return this.signUpForm.controls;
  }
  getrxStatus() {
    return false;
  }

  blurField(field){
       switch (field) {
        case 'firstName':
          this.firstNameBlurred = true
          break;
        case 'lastName':
          this.lastNameBlurred =  true
          break;
        case 'login':
          this.loginBlurred = true
          this.loginTooltip= false
          break;
        case 'password':
          this.passwordBlurred = true
          this.passwordTooltip = false
          this.toggleCaps(false);
          break;
        case 'dateOfBirth':
          this.dobBlurred = true
          this.dobTooltip = false
          break;
        case 'phoneNumber':
          this.phoneNumberBlurred = true
          this.phoneNumberTooltip = false
          break;
        case 'securityQuestion':
          this.securityQuestionBlurred = true
          this.securityQuestionTooltip = false
          break;
        case 'securityQuestionAnswer':
          this.securityAnswerBlurred = true
          this.securityQuestionAnswerTooltip = false
          break;
    }
  }

  showTooltip(field){
    switch (field) {
      case 'login':
        this.loginTooltip = true
        break;
      case 'password':
        this.passwordTooltip = true
        break;
      case 'dateOfBirth':
        this.dobTooltip = true
        break;
      case 'phoneNumber':
        this.phoneNumberTooltip = true
        break;
      case 'securityQuestion':
        this.securityQuestionTooltip = true
        break;
      case 'securityQuestionAnswer':
        this.securityQuestionAnswerTooltip = true
        break;
    }
  }

  updateSelectValue(value) {
    this.signUpForm.patchValue({
      'securityQuestionCode': value !== -1 ? value : ''
    });
    this.blurField('securityQuestion');
  }

  /**
   * Functon to check if continue button should be enabled or not.
   * Checking for form validation.
   * disclamer selection
   * password validation
   * duplicate message for email.
   */
  canSubmit() {
    return (this.signUpForm.valid && this.declarationStatus && !this.passwordCheckMessage && !this.duplicateAccountMsg);
  }

  getRegLoginContent() {
    this._contentService.getContent(REG_MAP.signin_message.path).subscribe(
      response => {
        this.reg_login_content = response.text
          ? response.text
          : REG_MAP.signin_message.default;

        this.reg_login_content = this._commonUtil.decodeHtml(this.reg_login_content);
      },

      error => {
        this.reg_login_content =  REG_MAP.signin_message.default;
        this.reg_login_content = this._commonUtil.decodeHtml(this.reg_login_content);
      }
    );
  }
}
