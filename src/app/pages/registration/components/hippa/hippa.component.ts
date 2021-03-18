import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppContext } from '@app/core/services/app-context.service';
import { Microservice } from '@app/config/microservice.constant';

@Component({
  selector: 'arxrf-signup-hippa',
  templateUrl: './hippa.component.html',
  styleUrls: ['./hippa.component.scss']
})
export class HippaComponent implements OnInit {
  declarationStatus = false;
  showDeclarationError = false;
  continueBtn: boolean = true;

  constructor(
    private _router: Router,
    public _registrationService: RegistrationService,
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _messagesService: MessageService,
    private _gaService: GaService,
    private _commonUtil: CommonUtil
  ) {}

  ngOnInit() {
    this._registrationService.showFourDotProgressBar = true;
  }

  continueAction(status: boolean): void {
    const status1 = status.toString();
    if (!this.declarationStatus) {
      this.showDeclarationError = true;
      return;
    }
    this._registrationService.showCircularLoader.next(true);
    const url = Microservice.registration_hipaa;

    const data = {
      hipaaDisclaimer: status1
    };

    this._httpService
      .doPut(url, data)
      .then(response => {
        this._registrationService.showCircularLoader.next(false);
        this._gaService.sendEvent(this.gaEvent());

        const callBackUrl = window.sessionStorage.getItem(
          AppContext.CONST.registration_callback_urlkey
        );
        // if the user is unauthenticated and has HD refill reminder url in session skip insurance and health conditions
        if (callBackUrl) {
          this.redirectToCallBackURlForRegistration(callBackUrl);
        } else {
          this._registrationService.endureState();
          this._router.navigate([this._registrationService.nextRoute()]);
        }
      })
      .catch(error => {
        this._registrationService.showCircularLoader.next(false);
        this._registrationService.endureState();
        this._router.navigate([this._registrationService.nextRoute()]);
      });
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.hipaa;
    return event;
  }

  declarationReadAndAgreeToPolicy(event) {
    this.continueBtn = !event.target.checked;
    this.declarationStatus = event.target.checked;
    if (this.declarationStatus) {
      this.showDeclarationError = false;
    } else {
      this.showDeclarationError = true;
    }
  }

  redirectToCallBackURlForRegistration(callBackUrl) {
    window.sessionStorage.removeItem(
      AppContext.CONST.registration_callback_urlkey
    );
    window.sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);
    window.sessionStorage.removeItem(AppContext.CONST.hd_rr_unauth_user);

    this._commonUtil.navigate(callBackUrl);
  }
}
