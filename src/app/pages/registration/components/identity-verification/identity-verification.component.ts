import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { IdentityVerificationService } from './identity-verification.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { SERVICE_URL } from '@app/config/services.constants';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
declare const $: any;

@Component({
  selector: 'arxrf-signup-idnetity',
  templateUrl: './identity-verification.component.html',
  styleUrls: ['./identity-verification.component.scss']
})
export class IdentityVerificationComponent implements OnInit {
  AUTH_ACTIONS = {
    phone: {
      code: 'IVR',
      label: '<span>Verify identity by calling a phone number</span><br/>'
    },
    online: {
      code: 'KBA',
      label: '<span>Verify identity by answering questions online</span><br/>'
    },
    text: {
      code: 'TEXT',
      label:
        '<span>Online</span><br/><span class=\'text-pattern\'><strong>(***) ***-1234 (Cell)</strong></span>'
    },
    none: {
      code: 'NO_OPTION_SELECTED'
    }
  };

  authOptionClicked = '';

  authOptionSelected = '';
  
  authOptionsResponse: any;

  authOptions: any[] = [];

  onlineQuestions: any[];

  authTypeSelectedStatus = false;

  phoneCode = 123456;

  public isReselecting: Boolean = false;

  isViewHidden = false;

  enableIdentityContinueButton = true;

  isKbaGenericError = null;

  @ViewChild('signupIdentityView') signupIdentityElement: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private _httpClient: HttpClientService,
    private _messageService: MessageService,
    private _router: Router,
    public _identityService: IdentityVerificationService,
    public _registrationService: RegistrationService,
    public _appContext: AppContext,
    private _userService: UserService,
    private _gaService: GaService,
    private _common: CommonUtil,

  ) {
    _identityService.isKbaGenericError.subscribe(value => this.isKbaGenericError = value);

    // if authentication type is selected on address page then processing with that.
    if (this._registrationService.verificationTypePreselect) {
      this.authOptionClicked = this._registrationService.verificationTypePreselect;
      this.onVerificationOptionsSelected(null);
    }
    this.getAuthOptions();
    this.authOptionClicked = this.AUTH_ACTIONS.none.code;

    // Updating user profile information in
    // localstore as there will be new information.
    this._userService.updateUserCachedInfo();
    this._registrationService.showCircularLoader.next(true);
  }

  ngOnInit() {
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.location.href = ROUTES.identity.absoluteRoute;
    };
    this._identityService.onlineQuestionSet.subscribe(questions => {
      if (questions !== null) {
        this.onlineQuestions = questions;
      }
    });
    if(this._userService.user.isReg2ExceptionUser){
      this._registrationService.showFourDotProgressBar = false;
    } else if (this._userService.user.isReg1ExceptionUser) {
      this._registrationService.showFourDotProgressBar = true;
    }
  }

  scrollToSignUpIdentity() {
    setTimeout(() => {
      if(this.signupIdentityElement && this.signupIdentityElement.nativeElement) {
        $('html, body').animate({
          scrollTop: $(this.signupIdentityElement.nativeElement).offset().top
        }, 1000);
      }
    }, 500);
  }

  updateVOption(event) {
    this.authOptionClicked = event.target.value;
  }

  reselectVerificationOption() {
    this.isReselecting = true;
    this._messageService.clear();
    this.authTypeSelectedStatus = false;
    this._identityService.enableContinueButton = false;
    this.authOptionSelected = '';
    this.authOptionClicked = this.AUTH_ACTIONS.none.code;
    this._identityService.onlineAuthRequestData.answers = [];
    this._identityService.isKbaGenericError.next(false);
  }

  onVerificationOptionsSelected(event) {
    if ( this._router.url.indexOf(ROUTES.address.absoluteRoute) > -1) {
      this._registrationService.verificationTypePreselect = this.authOptionClicked;
      this._router.navigateByUrl(ROUTES.identity.absoluteRoute);
    }
    
    this.isReselecting = false;
    this._messageService.clear();
    this.authOptionSelected = this.authOptionClicked;
    this._identityService.isKbaGenericError.next(false);
    //updating state for verification method selection in registration service.
    //this falg will be used to hide address form section once verification option is selected.
    this._registrationService.verificationSelected = true;
    
    this.authTypeSelectedStatus = true;
    switch (this.authOptionClicked) {
      case this.AUTH_ACTIONS.text.code:
        break;

      case this.AUTH_ACTIONS.online.code:
        this._identityService.getQuestionsSet();
        break;

      default:
        break;
    }
  }

  // Getting authentication options available for profile id.
  getAuthOptions(): void {
    this._httpClient
      .doGet(this._registrationService.SERVICES.authOptions())
      .then(response => {
        this._registrationService.showCircularLoader.next(false);
        const _body = response.json();
        this.authOptionsResponse = _body;
        this.isViewHidden = true;
        if (_body.rxAuthentication.userMatchStatus === "CSR_TICKET_IN_PROGRESS_PASSED_KBA") {
          this.isViewHidden = false;
          this._common.navigate(ROUTES.verify_identity.absoluteRoute);
        } else if (_body.rxAuthentication.userMatchStatus === "WCB_User") {
          this.isViewHidden = false;
          this._common.navigate(ROUTES.verify_option.absoluteRoute);
        } else if (_body.rxAuthentication.icServiceFailed === "Failed") {
          this._appContext.showGatewayError.next(true);
          this.enableIdentityContinueButton = false;
        } else if (_body.rxAuthentication !== undefined) {
          if (_body.rxAuthentication.authTypes === undefined) {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.auth_options_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
            this._appContext.showGatewayError.next(true);
            this.enableIdentityContinueButton = false;
          } else {
            this.prepareAuthOptions(_body.rxAuthentication.authTypes);
          }
        } else if (_body.messages !== undefined) {
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          this._appContext.showGatewayError.next(true);
          this.enableIdentityContinueButton = false;
        }
        this.scrollToSignUpIdentity();
      })
      .catch(error => {
        this._registrationService.showCircularLoader.next(false);
        this.isViewHidden = true;
        console.error(error);
        this.scrollToSignUpIdentity();
        
        this._appContext.showGatewayError.next(true);
        this.enableIdentityContinueButton = false;
      });
  }

  prepareAuthOptions(authTypes: any[]): void {
    // tslint:disable-next-line: forin
    for (const index in authTypes) {
      const authType = authTypes[index];

      switch (authType) {
        case this.AUTH_ACTIONS.online.code:
          this.authOptions.push(
            this.AuthTypeBuilder().build(this.AUTH_ACTIONS.online.label, authType)
          );
          break;

        case this.AUTH_ACTIONS.phone.code:
          this.authOptions.push(
            this.AuthTypeBuilder().build(this.AUTH_ACTIONS.phone.label, authType)
          );
          break;

        case this.AUTH_ACTIONS.text.code:
          this.authOptions.push(
            this.AuthTypeBuilder().build(this.AUTH_ACTIONS.text.label, authType)
          );
          break;

        default:
          break;
      }
    }
  }

  compoleteVerification(event) {

    if(this.isKbaGenericError) {
      this.authOptionClicked = 'IVR';
      this.onVerificationOptionsSelected(null)
      return;
    }

    this._identityService.enableContinueButton = false;
    this._messageService.clear();
    this._registrationService.showCircularLoader.next(true);
    switch (this.authOptionSelected) {
      case this.AUTH_ACTIONS.phone.code:
        // For phone type verification selected.
        // Sending request to check for phone verification status and redirecting
        // user to another step it success recieved.
        this._httpClient
          .getData(this._registrationService.SERVICES.verifyByPhone())
          .subscribe(
            response => {
              this._registrationService.showCircularLoader.next(false);
              if (response.messages !== undefined) {
                this._messageService.addMessage(
                  new Message(
                    response.messages[0].code.includes('_1002')
                    ? 'The activation code hasn\'t been verified yet. After calling and entering the code, wait for confirmation before clicking Continue.'
                    : response.messages[0].message,
                    response.messages[0].type
                  )
                );
              } else {
                this._gaService.sendEvent(this.gaEvent());
                this._registrationService.endureState();
                this._router.navigate([this._registrationService.nextRoute()]);
              }
            },

            error => {
              this._registrationService.showCircularLoader.next(false);
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );

        break;

      case this.AUTH_ACTIONS.online.code:
        this._identityService.submitAnswersForOnlineAuth();
        break;

      default:
        break;
    }
  }

  // Collecting answers selected by user.
  collectAnswer(event) {
    const answer = {
      questionId: event.target.name,
      optionId: event.target.value
    };

    // tslint:disable-next-line: forin
    for (const index in this._identityService.onlineAuthRequestData.answers) {
      const savedAnswer = this._identityService.onlineAuthRequestData.answers[
        index
      ];
      if (savedAnswer.questionId === answer.questionId) {
        savedAnswer.optionId = event.target.value;
        return;
      }
    }
    // Adding new answer if not selected previously
    this._identityService.onlineAuthRequestData.answers.push(answer);

    if ((this._identityService.onlineAuthRequestData.answers.length) >= this.onlineQuestions.length) {
      this._identityService.enableContinueButton = true;
    }
  }

  private AuthTypeBuilder = function() {
    const authType = {
      label: '',
      key: '',

      build: function(label, key) {
        this.label = label;
        this.key = key;
        return this;
      }
    };

    return authType;
  };

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.verify_identity;
    return event;
  }
}
