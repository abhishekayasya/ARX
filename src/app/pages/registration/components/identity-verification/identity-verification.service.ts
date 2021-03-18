import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { RegistrationService } from '@app/core/services/registration.service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { SERVICE_URL } from '@app/config/services.constants';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import { Subject } from 'rxjs';

const ID_CONSTANTS = {
  KBA_ERROR: {
    KBA_GENERIC_ERROR:
      "Verification Unsuccessful. We were unable to verify your identity online.",
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

@Injectable()
export class IdentityVerificationService {
  onlineAuthRequestData = {
    transactionId: '',
    quizId: '',
    isConsentFlow: true,
    answers: []
  };

  enableContinueButton: boolean = false;

  private questionsSetSource = new BehaviorSubject<Array<any>>(null);
  onlineQuestionSet = this.questionsSetSource.asObservable();

  isKbaGenericError = new Subject();

  constructor(
    private _httpClient: HttpClientService,
    private _messageService: MessageService,
    private _router: Router,
    private _registrationService: RegistrationService,
    private _gaService: GaService,
    private _user: UserService,
    private _common: CommonUtil
  ) {}

  //Getting question set for online authentication.
  getQuestionsSet() {
    this._registrationService.showCircularLoader.next(true);
    this.isKbaGenericError.next(false);

    this._httpClient
      .getData(this._registrationService.SERVICES.onlineQuestionsFirstSet())
      .subscribe(
        response => {
          this._registrationService.showCircularLoader.next(false);

          if ((response.errorMessageId == 'KBA_GENERIC_ERROR') && (response.kbaPageParamId == 'KBA_SHOW_MESSAGE')) {
            this.isKbaGenericError.next(true);
          } else if (response.errorMessageId !== undefined) {
            this.questionsSetSource.next(null);
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
                  ? ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (response.messageId !== undefined) {
            this.questionsSetSource.next(null);
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[response.messageId]
                  ? ID_CONSTANTS.KBA_ERROR[response.messageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (response.quizChoiceValidationErrorMessage !== undefined) {
            this.questionsSetSource.next(null);
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[
                  response.quizChoiceValidationErrorMessage
                ],
                'ERROR'
              )
            );
          } else {
            this.onlineAuthRequestData.transactionId = response.transactionId;
            this.onlineAuthRequestData.quizId = response.quizId;
            this.questionsSetSource.next(response.questionsNOptions);
          }
        },

        error => {
          this._registrationService.showCircularLoader.next(false);
        }
      );
  }

  //Submiting answers to questions for online authentication process.
  submitAnswersForOnlineAuth() {
    this._registrationService.showCircularLoader.next(true);
    
    this._httpClient
      .postData(
        this._registrationService.SERVICES.onlineQuestionSubmision(),
        this.onlineAuthRequestData
      )
      .subscribe(
        response => {
          this._registrationService.showCircularLoader.next(false);

          if (response.errorMessageId === "CSR_TICKET_IN_PROGRESS_PASSED_KBA") {
            this._common.navigate(ROUTES.verify_identity.absoluteRoute);
          } else if (response.quizChoiceValidationError) {
            this.enableContinueButton = true;
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR['QUIZ_VALIDATION_ERROR'],
                'ERROR'
              )
            );
          } else if (
            response.errorMessageId !== undefined &&
            response.messageId !== 'KBA_QUIZ_FAIL_ERROR'
          ) {
            this.enableContinueButton = true;
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
                  ? ID_CONSTANTS.KBA_ERROR[response.errorMessageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (response.messageId !== undefined) {
            this.enableContinueButton = true;
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[response.messageId]
                  ? ID_CONSTANTS.KBA_ERROR[response.messageId]
                  : ARX_MESSAGES.ERROR.service_failed,
                'ERROR'
              )
            );
          } else if (response.quizChoiceValidationErrorMessage !== undefined) {
            this.enableContinueButton = true;
            this._messageService.addMessage(
              new Message(
                ID_CONSTANTS.KBA_ERROR[
                  response.quizChoiceValidationErrorMessage
                ],
                'ERROR'
              )
            );
          } else if (
            response.questionsNOptions !== undefined &&
            response.transactionId === this.onlineAuthRequestData.transactionId
          ) {
            this.questionsSetSource.next(response.questionsNOptions);
          } else {
            this._gaService.sendEvent(this.gaEvent());

            this._registrationService.endureState();
            this._router.navigate([this._registrationService.nextRoute()]);
          }
        },

        error => {
          this.enableContinueButton = true;
          this._registrationService.showCircularLoader.next(false);
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.verify_identity;
    return event;
  }
}
