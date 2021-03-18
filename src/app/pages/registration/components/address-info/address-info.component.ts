import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { PasswordCheckData } from '@app/models';
import { ROUTES } from '@app/config';
import { CoreConstants } from '@app/config';
import { STATE_US } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import { Microservice } from '@app/config/microservice.constant';
import { ThrowStmt } from '@angular/compiler';
declare const $: any;

const headingView = {
  create: {
    heading: 'Create your account',
  },
  update: {
    heading: 'Update your account',
    subheading: 'Let\'s start with updating your contact information below.'
  },
  identity: {
    heading: 'Verify your identity',
    subheading: 'To access your pharmacy records and health information, please verify your identity below.'
  }
};

@Component({
  selector: 'arxrf-signup-address',
  templateUrl: './address-info.component.html',
  styleUrls: ['./address-info.component.scss']
})
export class AddressInfoComponent implements OnInit {
  addressForm: FormGroup;

  provideOption = false;

  showDeclarationError: boolean;
  disclaimerStatus: boolean;

  STATE_US = STATE_US.map(state => ({
    key: state.short_name,
    value: state.name
  }));
  GENDER = [
    { key: "Male", value: "Male" },
    { key: "Female", value: "Female" }
  ]

  PHONE_TYPES = ['Cell', 'Home', 'Work'];

  inputType = 'password';

  // for sso check
  prefilling = false;
  
  headingMessage = headingView.identity.heading;
  subHeadingMessage = headingView.identity.subheading;

  isUpgrading = false;

  upgradeCancelModel = false;
  useSecurityQuestions = true;
  showIdentitySignUp = false;
  showAddressSection = true;

  isSSO = false;
  questions: any[];

  // email check holders.
  emailCheckStatus = false;
  emailCheckMessage = '';
  passwordCheckMessage: string;
  dobCheckMessage: string;
  showDobCheckMessage: boolean = false;

  additionalInfoData = {
    dateOfBirth: '',
    phoneNumber: '',
    phoneType: '',
    login: '',
    password: '',
    securityQuestionCode: '',
    securityQuestionAnswer: '',
    address: {
      city: '',
      state: '',
      zipCode: '',
      street1: ''
    },
    tncAcceptInd: true,
    smsOptInInd: true,
    emailOptInInd: false,
    gender: ''
  };

  additionalInfoDataExtra = {
    firstName: '',
    lastName: '',
    primeId: ''
  };

  upgrdeRequestData = {
    dateOfBirth: '',
    phoneNumber: '',
    phoneType: '',
    emailOptInInd: false,
    securityQuestionCode: '',
    securityQuestionAnswer: '',
    address: {
      city: '',
      state: '',
      zipCode: '',
      street1: ''
    },
    gender: '',
    status: 'submit',
    regSource: 'rx'
  };

  addressBlurred = false;
  aptSuiteOtherBlurred = false;
  cityBlurred = false;
  stateBlurred = false;
  zipBlurred = false;
  genderBlurred = false;
  passwordInFocus = false;
  selectedPhoneType: string;
  duplicateAccountMsg = false;
  loginBlurred = false;
  passwordBlurred = false;
  loginTooltip = false;
  passwordTooltip = false;
  dobTooltip = false;
  phoneNumberTooltip = false;
  securityQuestionTooltip = false;
  securityQuestionAnswerTooltip = false;
  dobBlurred = false;
  phoneNumberBlurred = false;
  securityAnswerBlurred = false;
  securityQuestionBlurred = false;

  addressform_disabled = false;

  SubmitSuccess = false;
  isLikelyDesktop = true;
  @ViewChild('signupIdentity') signupIdentityElement: ElementRef;

  randomNumber: number = Math.floor(Math.random() * Math.random() * 100000000);
  
  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClientService,
    private router: Router,
    private _messageService: MessageService,
    private _userService: UserService,
    public registrationService: RegistrationService,
    private _appContext: AppContext,
    private _datePipe: DatePipe,
    private _commonUtil: CommonUtil,
    private _gaService: GaService,
    public _contentService: JahiaContentService
  ) {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;
    dateConfig.minAge = 13;
      
    this.addressForm = this._formBuilder.group({
      gender: ['', Validators.required],
      password: [
        this.registrationService.signupDataCache['password'],
        Validators.required
      ],
      city: ['', Validators.compose([Validators.pattern(/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/), Validators.required])],
      state: ['', Validators.required],
      zipCode: ['', Validators.compose([Validators.pattern(/^[0-9]{5,5}$/), Validators.required])],
      street1: ['', [Validators.required, this._commonUtil.onlyWhitespaceValidator]],
      dateOfBirth: [
        (this.registrationService.signupDataCache['dateOfBirth']) ?
            this.registrationService.signupDataCache['dateOfBirth'] : '',
        [
          Validators.required,
          ValidateDate(dateConfig, this._userService.isSSOSessionActive())
        ]
      ],
      phoneNumber: [
        this.registrationService.signupDataCache['phoneNumber'],
        [Validators.required, Validators.pattern(CoreConstants.PATTERN.PHONE)]
      ],
      phoneType: [
        this.registrationService.signupDataCache['phoneType'],
        Validators.required
      ],
      login: [
        this.registrationService.signupDataCache['login'],
        Validators.required
      ],
      aptSuite: ['', this._commonUtil.onlyWhitespaceValidator],
      securityQuestionCode: [
        (this.registrationService.signupDataCache['securityQuestionCode']) ?
              this.registrationService.signupDataCache['securityQuestionCode'] : '',
        Validators.required
      ],
      securityQuestionAnswer: [
        this.registrationService.signupDataCache['securityQuestionAnswer'],
        [Validators.required, this._commonUtil.onlyWhitespaceValidator]
      ],
      disclaimerStatus: []
    });

    this.checkAndProcessHeaderInfo();
    this.checkAndProcessSSO();

    if ( this.isSSO || this.isUpgrading ) {
      this._commonUtil.updateBrowserBack( ROUTES.login.absoluteRoute, false );
      this._commonUtil.enableLeaveSiteConfirmation();
    }
  }

  ngOnInit() {
    this._contentService.showHeaderMsgContent = false;
    this.selectedPhoneType='Cell'
    this.addressForm.controls['phoneType'].setValue(
      'Cell'
    );
    const deviceInfo = sessionStorage.getItem('deviceinfo');
    if(deviceInfo){
      const parsedData = JSON.parse(deviceInfo);
      const touchSupport = parsedData.touchSupport
      if(touchSupport){
        this.isLikelyDesktop = !touchSupport[1]
      }
    }
  }

  scrollToSignUpIdentity() {
    $('html, body').animate({
      scrollTop: $(this.signupIdentityElement.nativeElement).offset().top
    }, 1000);
  }

  submitAdditionalDetails() {
    if (['', -1, undefined].indexOf(this.addressForm.value.state) !== -1) {
      this.stateBlurred = true;
      return;
    };

    if (['', -1, undefined].indexOf(this.addressForm.value.gender) !== -1) {
      this.genderBlurred = true;
      return;
    };

    this._appContext.isNewRegistrationFlow = true;
    if (this.isSSO || this.isUpgrading) {    
      if (!this.addressForm.value.disclaimerStatus) {
        this.showDeclarationError = true;
        this.registrationService.showCircularLoader.next(false);
        return;
      }
    } else {
      this._appContext.isNewRegistrationFlow = true;
    }

    if (!this.addressForm.valid) {
      this._commonUtil.validateForm(this.addressForm);
      return;
    }
    this.registrationService.showCircularLoader.next(true);

    // Adding address spesific details.
    this.additionalInfoData.address.city = this.addressForm.value.city;
    this.additionalInfoData.address.zipCode = this.addressForm.value.zipCode;
    this.additionalInfoData.address.state = this.addressForm.value.state;
    this.additionalInfoData.address.street1 = this.addressForm.value.street1;
    this.additionalInfoData.gender = this.addressForm.value.gender;

    Object.assign(this.additionalInfoData, this.additionalInfoDataExtra);

    Object.assign(
      this.additionalInfoData,
      this.registrationService.signupDataCache
    );

    if ( this.additionalInfoData.phoneNumber ) {
      this.additionalInfoData.phoneNumber = this._commonUtil.convertToDigitsOnlyPhoneNumber(
        this.additionalInfoData.phoneNumber
      );
    }

    localStorage.setItem(
      AppContext.CONST.uInfoStorageKey,
      JSON.stringify(this.additionalInfoData)
    );

    if (this.isSSO) {
      this.additionalInfoData.login = this.addressForm.value.login;
      this.additionalInfoData.dateOfBirth = this._datePipe.transform(
        this.addressForm.value.dateOfBirth,
        'MM/dd/yyyy'
      );
      this.additionalInfoData.securityQuestionAnswer = this.addressForm.value.securityQuestionAnswer;
      this.additionalInfoData.securityQuestionCode = this.addressForm.value.securityQuestionCode;
      this.additionalInfoData.phoneType = this.addressForm.value.phoneType;
      this.additionalInfoData.phoneNumber = this._commonUtil.convertToDigitsOnlyPhoneNumber( this.addressForm.value.phoneNumber );
      this.additionalInfoData.password = this.addressForm.value.password;
    }

    if (this.provideOption) {
      this.additionalInfoData['forceReg'] = true;
    }

    //istanbul ignore else
    if (this.additionalInfoData['regSource'] === undefined) {
      this.additionalInfoData['regSource'] = 'rx';
    }

    if(this.isSSO || this.isUpgrading){
      localStorage.setItem(AppContext.CONST.reg2_consent_pending, "true");
      localStorage.setItem(AppContext.CONST.reg2_HIPAA_pending, "true");
      this._appContext.setTermsCheckboxAccepted("true");
    }
    
    this.registrationService.showCircularLoader.next(true);

    if (this.isUpgrading) {
      //mark terms as accepted in case reg flow is abandoned,
      //we can set it as accepted later
      this.submitUpgradeRequest();
    } else {
      const promise = this._httpClient.doPost(
        this.registrationService.SERVICES.registration,
        this.additionalInfoData
      );

      // For form submission
      promise.then(res => {
        //istanbul ignore else
        if (res.ok) {
          this._commonUtil.disableLeaveSiteConfirmation();
          const body = res.json();
          // this.registrationService.endureState();
          window.localStorage.removeItem('signupDataCache');
          this.processResponse(body);
          
          if (this.isSSO || this.isUpgrading) {
            this.showAddressSection = false;
          }
          this.SubmitSuccess = true;
        }
        this.scrollToSignUpIdentity();
      });

      promise.catch(err => {
        this.onFormSubmissionError();
      });
    }
  }

  submitUpgradeRequest() {
    if (!this.addressForm.value.disclaimerStatus) {
      this.showDeclarationError = true;
      this._commonUtil.validateForm(this.addressForm);
      this.registrationService.showCircularLoader.next(false);
      return;
    }

    this.upgrdeRequestData.dateOfBirth = this._datePipe.transform(
      this.addressForm.value.dateOfBirth,
      'MM/dd/yyyy'
    );

    this.upgrdeRequestData.securityQuestionCode = this.addressForm.value.securityQuestionCode;
    this.upgrdeRequestData.securityQuestionAnswer = this.addressForm.value.securityQuestionAnswer;
    this.upgrdeRequestData.phoneType = this.addressForm.value.phoneType;
    this.upgrdeRequestData.phoneNumber = this._commonUtil.convertToDigitsOnlyPhoneNumber( this.addressForm.value.phoneNumber );
    this.upgrdeRequestData.address = this.additionalInfoData.address;
    this.upgrdeRequestData.gender = this.additionalInfoData.gender;

    //istanbul ignore else
    if (this.provideOption) {
      this.upgrdeRequestData['forceReg'] = true;
    }

    //istanbul ignore else
    if (this._userService.isSSOSessionActive()) {
      //istanbul ignore else
      if (this._appContext.ssoSource !== '') {
        this.upgrdeRequestData.regSource = this._appContext.ssoSource;
      }

      delete this.upgrdeRequestData.securityQuestionCode;
      delete this.upgrdeRequestData.securityQuestionAnswer;
    }
    this._httpClient
      .doPut(
        `/register/csrf-disabled/rxUpgrade`,
        this.upgrdeRequestData
      )
      .then(respose => {
        this._commonUtil.disableLeaveSiteConfirmation();
        window.localStorage.removeItem('signupDataCache');
        if (this.isSSO || this.isUpgrading) {
          this.showAddressSection = false;
        }
        this.processResponse(respose.json());
        this.SubmitSuccess = true;
        this.scrollToSignUpIdentity();
      })
      .catch(error => {
        this.onFormSubmissionError();
      });
  }

  processResponse(body: any) {
    if (body.links !== undefined) {
      this.registrationService.endureState();
      this._gaService.sendEvent(this.gaEvent());
      // remove sso session after upgrade or register sync.
      //istanbul ignore else
      if (this._userService.isSSOSessionActive()) {
        this._userService.removeSSOSession();
      }
      // Initializing user session.
      this._userService.initUser1(
        '',
        true
        // ROUTES.identity.absoluteRoute,
        // true
      ).then(() => {
        this.showIdentitySignUp = true;
        this.headingMessage = headingView.identity.heading;
        this.subHeadingMessage = headingView.identity.subheading;
        this.disableAddressForm();
        this.registrationService.showCircularLoader.next(false);
    });;

      // Registration process increment.
      // this.registrationService.endureState();
      // this.router.navigate([
      //   this.registrationService.nextRoute()
      // ]);
    } else if (sessionStorage.getItem('rx_user')) {
      this.registrationService.endureState();
      this._gaService.sendEvent(this.gaEvent());
      // remove sso session after upgrade or register sync.
      if (this._userService.isSSOSessionActive()) {
        this._userService.removeSSOSession();
      }
      localStorage.setItem('rex_user_identity', 'true');
      // Initializing user session.
      this._userService.initUser1(
        '',
        true
        // ROUTES.identity.absoluteRoute,
        // true
      ).then(() => {
        this.showIdentitySignUp = true;
        this.headingMessage = headingView.identity.heading;
        this.subHeadingMessage = headingView.identity.subheading;
        this.disableAddressForm();
        this.registrationService.showCircularLoader.next(false);
    });
      sessionStorage.removeItem('rx_user');
    } else {
      //istanbul ignore else
      if (body.messages !== undefined) {
        if (body.messages[0].code === 'WAG_W_REG_1047') {
          this.provideOption = true;
        } else {
          this._messageService.addMessage(
            new Message(
              body.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      }
      this.registrationService.showCircularLoader.next(false);
    }
  }

  hideOption(event) {
    //istanbul ignore else
    if (!event) {
      this.provideOption = false;
    }
  }

  // This method will be called on password field blur.
  // This will send a request with required data to check password service.
  checkEmail(event) {
    this.blurField('login');
      if (this.addressForm.value.login !== '') {
        const emailData = { userName: this.addressForm.value.login };
        const promise = this._httpClient.doPost(
          this.registrationService.SERVICES.checkEmail,
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

  checkAndProcessHeaderInfo() {
    //istanbul ignore else
    const userData = sessionStorage.getItem('userData');
    if (
      this._userService.user !== undefined &&
      this._userService.user.headerInfo !== undefined || userData
    ) {
      let user;
      if (userData) { user = JSON.parse(userData); }
      if (!(this._userService && this._userService.user && this._userService.user.headerInfo &&  this._userService.user.headerInfo.profileInd.isRxUser) ||
        user._isRxUser) {

        this.prefilling = true;

        try {
          document.getElementsByName('title')[0].innerHTML =
            'Update Your Account | AllianceRx Walgreens Prime';
        } catch (e) {}
        this.headingMessage = headingView.update.heading;
        this.subHeadingMessage = headingView.update.subheading;

        this.isUpgrading = true;

        this.emailCheckStatus = true;

        this.populateSignUpCache();

        this.getQuestions();

        this.addressForm.patchValue(this.registrationService.signupDataCache);
        //istanbul ignore else
        if (
          this.registrationService.signupDataCache['address'] !== undefined
        ) {
          this.addressForm.patchValue(
            this.registrationService.signupDataCache['address']
          );
        }
        //istanbul ignore else
        if (!this.isSSO) {
          this.addressForm.patchValue({
            password: 'password'
          });
        }
        //istanbul ignore else
        if (this.addressForm.value.phoneType === undefined) {
          this.addressForm.patchValue({ phoneType: 'Cell' });
        }

        delete this.registrationService.signupDataCache['meHshId'];
        delete this.registrationService.signupDataCache['numberOfSiteVisits'];
        delete this.registrationService.signupDataCache['emailId'];
        delete this.registrationService.signupDataCache['profileId'];
        delete this.registrationService.signupDataCache['geoTargetEnabled'];
      } else {
        this.emailCheckStatus = true;
      }
    } else {
      this.emailCheckStatus = true;
    }
  }

  checkAndProcessSSO() {
    //istanbul ignore else
    if (this._userService.isSSOSessionActive()) {
      this.getQuestions();
      this.fetchUserInformationForSSO();
    }
  }

  /**
   * Fetching user detail in case of registration selected on SSO.
   */
  fetchUserInformationForSSO() {
    /**
     * If create new account option is selected on sso options.
     */
    this.emailCheckStatus = false;
    this.isSSO = true;
    this.prefilling = true;
    //istanbul ignore else
    if (!this.isUpgrading) {
      this.headingMessage = headingView.create.heading;
    }

    // let _body = response.json();
    const _body = this._userService.getsamlResponse();
    //istanbul ignore else
    if (_body._body !== undefined) {
      const prefillData = JSON.parse(_body._body);

      //istanbul ignore else
      if (prefillData.FirstName !== undefined) {
        prefillData.firstName = prefillData.FirstName; // Form prefill data
        this.additionalInfoDataExtra.firstName = prefillData.FirstName; // Reg request payload
      }
      //istanbul ignore else
      if (prefillData.LastName !== undefined) {
        prefillData.lastName = prefillData.LastName;
        this.additionalInfoDataExtra.lastName = prefillData.LastName;
      }
      //istanbul ignore else
      if (prefillData.EnterprisePersonId) {
        this.additionalInfoDataExtra.primeId = prefillData.EnterprisePersonId;
      }
      //istanbul ignore else
      if (prefillData.DOB !== undefined) {
        prefillData.dateOfBirth = prefillData.DOB;
        this.addressForm.patchValue({
          dateOfBirth: prefillData.DOB
        });
      }
      //istanbul ignore else
      if (prefillData.Gender !== undefined) {
        let gender;
        if (prefillData.Gender === 'M') {
          gender = 'Male';
        } else if (prefillData.Gender === 'F') {
          gender = 'Female';
        } else {
          gender = '';
        }
        this.addressForm.patchValue({
          gender: gender
        });
      }
      //Don't prefill phoneNumner, set phone type default to cell
      this.addressForm.patchValue({
        phoneType: 'Cell'
      });
      
      if (prefillData.PhoneNumber !== undefined) {
        this.addressForm.patchValue({
          phoneNumber: this._commonUtil.convertToFormattedPhonenumber( prefillData.PhoneNumber )
        });
      } else {
        prefillData.PhoneType = 'Cell';
      }
      //istanbul ignore else
      if (prefillData.PhoneType !== undefined) {
        let phoneType = 'Cell';
        switch (prefillData.PhoneType) {
          case 'CELL':
            phoneType = 'Cell';
            break;
          case 'HOME':
            phoneType = 'Home';
            break;
          case 'WORK':
            phoneType = 'Work';
            break;
          default:
            break;
        }
        this.addressForm.patchValue({
          phoneType: phoneType
        });
      }
      //istanbul ignore else
      if (prefillData.EmailAddress !== undefined && prefillData.EmailAddress !== 'NA') {
        this.addressForm.patchValue({
          login: prefillData.EmailAddress
        });
      }
      //istanbul ignore else
      if (prefillData.Address1 !== undefined) {
        this.addressForm.patchValue({ street1: prefillData.Address1 });
      }
      //istanbul ignore else
      if (prefillData.Address2 !== undefined) {
        this.addressForm.patchValue({
          aptSuite: prefillData.Address2
        });
      }
      //istanbul ignore else
      if (prefillData.City !== undefined) {
        this.addressForm.patchValue({
          city: prefillData.City
        });
      }
      //istanbul ignore else
      if (prefillData.State !== undefined) {
        this.addressForm.patchValue({
          state: prefillData.State
        });
      }
      //istanbul ignore else
      if (prefillData.zip !== undefined) {
        this.zipBlurred = true;
        this.addressForm.patchValue({
          zipCode: prefillData.zip
        });
      }
      //istanbul ignore else
      if (this._appContext.ssoSource !== '') {
        this.additionalInfoData['regSource'] = this._appContext.ssoSource;
      }

      this.registrationService.signupDataCache = prefillData;
    }
  }

  preparePhoneNumber(number: any, areCode: string) {
    if (number) {
      const num = number.replace('-', '');
      return `${areCode}${num}`;
    }
    return '';
  }

  getQuestions() {
    const promise = this._httpClient.doGet(
      this.registrationService.SERVICES.sequrityQuestions
    );

    promise
      .then(res => {
        //istanbul ignore else
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
    //istanbul ignore else
    this.blurField('password');
    this.toggleCaps(false)
    if (this.addressForm.value.password !== '') {
      const data = new PasswordCheckData(
        this.registrationService.signupDataCache['firstname'],
        this.registrationService.signupDataCache['lastname'],
        this.addressForm.value.login,
        this.addressForm.value.password
      );

      const promise = this._httpClient.doPost(
        this.registrationService.SERVICES.checkPassword,
        data
      );

      // For valid response checkiing the response message and updating password check message.
      promise
        .then(res => {
          //istanbul ignore else
          if (res.ok) {
            const body = res.json();
            if (body.messages) {
              if( body.messages[0].message.indexOf("30") > -1 || body.messages[0].message.indexOf("8") > -1){
                this.passwordCheckMessage = "Must contain between 8 and 30 characters.";
              } else if( body.messages[0].message.indexOf("numbers") > -1  ){
                this.passwordCheckMessage = "Must contain both numbers and letters.";
              } else if (this.addressForm.value.login === this.addressForm.value.password && this.addressForm.value.password ) {
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

  checkboxFlag(event) {
    if (event.target.checked === true) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  sendToLogin() {
    if (this.isSSO) {
      this._commonUtil.navigate(`${ROUTES.login.absoluteRoute}?user=prime_sso`);
    } else {
      this._commonUtil.navigate(ROUTES.login.absoluteRoute);
    }
  }

  checkdata() {}

  dobUpdater(event) {
    this.addressForm.patchValue({
      dateOfBirth: event.target.value
    });
  }

  populateSignUpCache() {
    //istanbul ignore else
    if (localStorage.getItem(AppContext.CONST.uInfoStorageKey) != null) {

      this.registrationService.signupDataCache = JSON.parse(
        localStorage.getItem(AppContext.CONST.uInfoStorageKey)
      );
      this.registrationService.signupDataCache[
        'firstName'
      ] = this.registrationService.signupDataCache.basicProfile.firstName;
      this.registrationService.signupDataCache[
        'lastName'
      ] = this.registrationService.signupDataCache.basicProfile.lastName;
const number = localStorage.getItem('phone');
      this.registrationService.signupDataCache[
        'phoneNumber'
      ] = number;
      // this.preparePhoneNumber(
      //   number,
      //   this.registrationService.signupDataCache.areaCode
      // );
    } else {
      if ( this._userService.user && this._userService.user.headerInfo ) {
        this.registrationService.signupDataCache = this._userService.user.headerInfo.profileInfo;
      } else {
        // If no information found for header info means the flow is not valid.
        // reseting sso and upgrade flags to display normal form before redirection.
        this.isSSO = false;
        this.isUpgrading = false;
        this.showAddressSection = true;
        // Setting headings to default to avoid multiple headings on screen.
        this.headingMessage = headingView.identity.heading;
        this.subHeadingMessage = headingView.identity.subheading;
        // removing reg userdata and redirecting to first registration page.
        sessionStorage.removeItem('userData');
        this._commonUtil.navigate(ROUTES.registration.absoluteRoute);
      }
    }
    //istanbul ignore else
    if (this.registrationService.signupDataCache['login'] === undefined) {
      const user = JSON.parse(sessionStorage.getItem('userData'));
      this.registrationService.signupDataCache[
        'login'
      ] = user.profile.basicProfile.login;

    }
  }

  declarationReadAndAgreeToPolicy(event) {
    this.disclaimerStatus = event.target.checked;
    if (this.disclaimerStatus) {
      this.showDeclarationError = false;
    } else {
      this.showDeclarationError = true;
    }
  }

  hideUpgradeCancelModel(event) {
    if (!event) {
      this.upgradeCancelModel = false;
    }
  }

  cancelUpgradeProcess() {
    this._commonUtil.navigate(ROUTES.logout.absoluteRoute);
  }

  blurField(field){
    switch (field) {
     case 'street1':
       this.addressBlurred = true
       break;
     case 'aptSuite':
       this.aptSuiteOtherBlurred =  true
       break;
     case 'city':
       this.cityBlurred = true
       break;
     case 'state':
       this.stateBlurred = true
       break;
     case 'zipCode':
       this.zipBlurred = true
       break;
     case 'gender':
       this.genderBlurred = true
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

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.addressInfo.fullReg;
    if (this.isUpgrading) {
      event.action = GA.actions.addressInfo.liteReg;
    }
    if (this.isSSO) {
      event.action = GA.actions.addressInfo.sso;
    }
    return event;
  }
  onFormSubmissionError() {
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }

  /**
   * funtion to disable all fields in address form.
   */
  private disableAddressForm() {
    this.addressForm.disable();
    this.addressform_disabled = true;
  }

  /**
   * Function to submit form for New registration, if the form is valid.
   */
  private checkAndSubmitForm(fieldName): void {
    this.blurField(fieldName)
    if ( !this.isUpgrading && !this.isSSO ) {
      if ( this.addressForm.valid ) {
        this.submitAdditionalDetails();
      }
    }
  }

  checkDOB(dateOfBirth: string) {
    this.showDobCheckMessage = false;
    this.blurField(dateOfBirth);
    const dobControl = this.addressForm.controls.dateOfBirth;
    if (dobControl.errors && 
      this.addressForm.controls.dateOfBirth.value.length > 0 && 
      this.addressForm.controls.dateOfBirth.value.length < 10
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
      const yearOfBirth = this.addressForm.controls.dateOfBirth.value.slice(-4);
      if (currentYear - yearOfBirth < 13) {
        this.showDobCheckMessage = true;
        this.dobCheckMessage = 'Account holders must be 13 years of age or older.';
      }
    }
  }

  updatePhoneType(e){
    let newPhoneType = e.target.value;
    if (newPhoneType.indexOf("'") > -1) {
      newPhoneType = newPhoneType.slice(1)
    };
    this.selectedPhoneType = newPhoneType
    this.addressForm.controls['phoneType'].setValue(
      this.selectedPhoneType
    );
  }
  
  updateStateValue(value) {
    this.addressForm.patchValue({
      state: value !== -1 ? value : ''
    });
  }
  
  updateGenderValue(value) {
    this.addressForm.patchValue({
      gender: value !== -1 ? value : ''
    });
  }
  
  /**
   * Functon to check if continue button should be enabled or not.
   * Checking for form validation.
   * disclamer selection
   * password validation
   * duplicate message for email.
   */
  canSubmit() {
    let formState = (this.addressForm.valid && !this.passwordCheckMessage && !this.duplicateAccountMsg);
    if ( this.isSSO || this.isUpgrading && formState === true ) {
      formState = this.addressForm.value.disclaimerStatus;
    }
    return formState;
  }
  
  updateSecurityQuestionValue(value) {
    this.addressForm.patchValue({
      'securityQuestionCode': value !== -1 ? value : ''
    });
    this.blurField('securityQuestion');
  }
}
