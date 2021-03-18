import {Injectable} from '@angular/core';

@Injectable()
export class MemberAuthService {

  public onlineAuthRequestData = {
    transactionId : '',
    quizId : '',
    isConsentFlow : true,
    answers : []
  };

  /**
   *
   */
  submitAnswersForOnlineAuth() {

  }

}
