import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { FmService } from '@app/core/services/fm.service';
import { MemberAuthService } from '@app/pages/family-manage/components/member-auth/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

const AUTH_ACTIONS = {
  phone: {
    code: 'IVR',
    label: '<span>By phone call</span><br/>'
  },
  online: {
    code: 'KBA',
    label: '<span>Online</span><br/>'
  },
  text: {
    code: 'TXT',
    label: '<span>By text message</span>'
  }
};

const ID_CONSTANTS = {
  KBA_ERROR: {
    KBA_GENERIC_ERROR:
      'System Error. Please try again or select a different verification option.',
    INVALID_QUIZ_CHOICE_VALIDATION_ERROR:
      'Please answer all the questions below before you continue.',
    KBA_QUIZ_MAX_ATTEMPTS_ERROR:
      'Too many quiz attempts. Please select a different verification option.',
    KBA_QUIZ_TIMEOUT_ERROR:
      'Quiz time exceeded. Please try again or select a different verification option.',
    KBA_QUIZ_FAIL_ERROR:
      'We couldn\'t verify your identity. Please try again or select another verification method.',
    QUIZ_VALIDATION_ERROR: 'Please select answers for all questions'
  }
};

@Component({
  selector: 'arxrf-fm-auth',
  templateUrl: './member-auth.component.html',
  styleUrls: ['./member-auth.component.scss']
})
export class MemberAuthComponent implements OnInit {
  options_selected: string;
  authOptions: Array<any> = [];

  ivrKeyCode: string;

  auth_options_state: boolean;
  onlineAuthRequestData: any;

  onlineQuestions: Array<any>;

  constructor(
    private _http: HttpClientService,
    private _message: MessageService,
    public manager: FmService,
    private _authService: MemberAuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.manager.enableLoad();
    this.prepareAuthOptions();
  }

  prepareAuthOptions() {
    // let url = `/rx-profile/familyReg/options`;
    this._http.getData(Microservice.fm_invite_auth_option).subscribe(
      response => {
        let checkErrorResonse;
        if (response.message) {
          checkErrorResonse = JSON.parse(response.message).errors[0];
        }
        this.manager.disableLoad();
        if (
          checkErrorResonse &&
          checkErrorResonse.errorId === 'WAG_E_FAMILY_AUTHENTICATION_1001'
        ) {
          this._message.addMessage(
            new Message(
              checkErrorResonse.errorMessage,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else if (response.status === 'OK') {
          if (response.content.authTypes) {
            this.prepareOptions(response.content.authTypes);
            this.ivrKeyCode = response.content.ivrKeyCode;
          } else {
            this._message.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.auth_options_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
      },

      error => {
        this.manager.disableLoad();
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  prepareOptions(authTypes: any[]): void {
    if (authTypes.length) {
      this.options_selected = authTypes[0];
    }
    // tslint:disable-next-line: forin
    for (const index in authTypes) {
      const authType = authTypes[index];

      switch (authType) {
        case AUTH_ACTIONS.online.code:
          this.authOptions.push(
            this.AuthTypeBuilder().build(AUTH_ACTIONS.online.label, authType)
          );
          break;

        case AUTH_ACTIONS.phone.code:
          this.authOptions.push(
            this.AuthTypeBuilder().build(AUTH_ACTIONS.phone.label, authType)
          );
          break;

        case AUTH_ACTIONS.text.code:
          this.authOptions.push(this.AuthTypeBuilder().build('', authType));

          // this.loadPhoneInfo();
          break;

        default:
          break;
      }
    }
  }

  loadPhoneInfo() {
    const url = '/svc/authentication/authByText/loadAndResendCode';
    const request_data = {
      actionType: 'load'
    };

    this._http.postData(url, request_data).subscribe(response => {
      if (response.activeSMSCode) {
        const auth_option = this.authOptions.find(item => {
          return item.key === AUTH_ACTIONS.text.code;
        });

        if (auth_option) {
          // tslint:disable-next-line: max-line-length
          auth_option.label =
            '<span>By text message</span><br/><span class=\'text-pattern\'><strong>' +
            response.activePhoneNo +
            '(Cell)</strong></span>';
        }
      }
    });
  }

  compoleteVerification(event) {
    this.manager.enableLoad(true);
    switch (this.options_selected) {
      case AUTH_ACTIONS.phone.code:
        // verify by phone.
        break;

      case AUTH_ACTIONS.online.code:
        this._authService.submitAnswersForOnlineAuth();
        break;

      default:
        break;
    }
  }

  onSelection() {
    this.auth_options_state = true;
    this.onlineQuestions = undefined;
    switch (this.options_selected) {
      case AUTH_ACTIONS.online.code:
        this.getQuestionsSet();
        break;

      case AUTH_ACTIONS.phone.code:
        break;

      default:
        break;
    }
  }

  getQuestionsSet() {
    this._http.getData(Microservice.fm_auth_kba).subscribe(response => {
      if (response.errorMessageId !== undefined) {
        this._message.addMessage(
          new Message(
            // tslint:disable-next-line: max-line-length
            ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
              ? ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
              : ARX_MESSAGES.ERROR.service_failed,
            'ERROR'
          )
        );
      } else if (response.messageId !== undefined) {
        this._message.addMessage(
          new Message(
            // tslint:disable-next-line: max-line-length
            ID_CONSTANTS.KBA_ERROR[response.messageId]
              ? ID_CONSTANTS.KBA_ERROR[response.messageId]
              : ARX_MESSAGES.ERROR.service_failed,
            'ERROR'
          )
        );
      } else if (response.quizChoiceValidationErrorMessage !== undefined) {
        this._message.addMessage(
          new Message(
            ID_CONSTANTS.KBA_ERROR[response.quizChoiceValidationErrorMessage],
            'ERROR'
          )
        );
      } else {
        if (this.onlineAuthRequestData === undefined) {
          this.onlineAuthRequestData = <any>{};
        }
        this.onlineAuthRequestData.transactionId = response.transactionId;
        this.onlineAuthRequestData.quizId = response.quizId;
        this.onlineQuestions = response.questionsNOptions;
      }
    });
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

  // Collecting answers selected by user.
  collectAnswer(event) {
    const answer = {
      questionId: event.target.name,
      optionId: event.target.value
    };

    if (!this.onlineAuthRequestData) {
      this.onlineAuthRequestData = <any>{};
    }

    // tslint:disable-next-line: forin
    for (const index in this.onlineAuthRequestData.answers) {
      const savedAnswer = this.onlineAuthRequestData.answers[index];
      if (savedAnswer.questionId === answer.questionId) {
        savedAnswer.optionId = event.target.value;
        return;
      }
    }
    // Adding new answer if not selected previously
    if (!this.onlineAuthRequestData.answers) {
      this.onlineAuthRequestData.answers = [];
    }

    this.onlineAuthRequestData.answers.push(answer);
  }

  processKBASubmission() {
    this.manager.enableLoad(true);

    this._http
      .postData(Microservice.fm_auth_kba_validate, this.onlineAuthRequestData)
      .subscribe(
        response => {
          this.manager.disableLoad();
          const _body = response;
          if (_body.quizChoiceValidationError) {
            this._message.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR['QUIZ_VALIDATION_ERROR'],
                'ERROR'
              )
            );
          } else if (
            _body.errorMessageId !== undefined &&
            _body.messageId !== 'KBA_QUIZ_FAIL_ERROR'
          ) {
            this._message.addMessage(
              new Message(
                // tslint:disable-next-line: max-line-length
                ID_CONSTANTS.KBA_ERROR[_body.errorMessageId]
                  ? ID_CONSTANTS.KBA_ERROR[_body.errorMessageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (_body.messageId !== undefined) {
            this._message.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[_body.messageId]
                  ? ID_CONSTANTS.KBA_ERROR[_body.messageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (_body.quizChoiceValidationErrorMessage !== undefined) {
            this._message.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[_body.quizChoiceValidationErrorMessage],
                'ERROR'
              )
            );
          } else if (
            _body.questionsNOptions !== undefined &&
            _body.transactionId === this.onlineAuthRequestData.transactionId
          ) {
            this.onlineQuestions = _body.questionsNOptions;
          } else {
            this._router.navigateByUrl(
              sessionStorage.getItem(this.manager.inviteUrlKey) + '&kba=true'
            );
          }
        },

        error => {
          this.manager.disableLoad();
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
  }

  submitIVRProcess() {
    this.manager.enableLoad(true);

    this._http.getData(Microservice.fm_auth_phone_validate).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages) {
          this._message.addMessage(
            new Message(
              response.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else {
          this._router.navigateByUrl(
            sessionStorage.getItem(this.manager.inviteUrlKey)
          );
        }
      },
      error => {
        this.manager.disableLoad();
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }
}
