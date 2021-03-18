import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import {COMMON_MAP} from '@app/content-mapping/common-content-mapping';
import { AppContext } from '@app/core/services/app-context.service';

const SUCCESS_CODE = 'WAG_I_CONSENT_SUCCESS_1001';

@Component({
  selector: 'arxrf-signup-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent implements OnInit {
  consent: string;

  consent_content: any;
  constructor(
    private _httpClient: HttpClientService,
    private router: Router,
    private _messageService: MessageService,
    public _registrationService: RegistrationService,
    private _userService: UserService,
    public _common: CommonUtil,
    private _gaService: GaService,
    private _contentService: JahiaContentService,
    private _appContext: AppContext
  ) {}

  ngOnInit() {
    this._registrationService.showFourDotProgressBar = true;
    this._userService.getProfileInd().subscribe(response => {
      if (response.auth_ind !== undefined && response.auth_ind === 'Y') {
        this._userService.user['isRxAuthenticatedUser'] = true;
      } else {
        this._userService.user['isRxAuthenticatedUser'] = false;
      }
      if (response.hipaa_ind !== undefined && response.hipaa_ind === 'Y') {
        this._userService.user.isRxHIPAAUser = true;
      } else {
        this._userService.user.isRxHIPAAUser = false;
      }
      if (response.rx_user !== undefined && response.rx_user === 'Y') {
        this._userService.user.isRxUser = true;
      } else {
        this._userService.user.isRxUser = false;
      }
      if (response.qr_user !== undefined && response.qr_user === 'Y') {
        this._userService.user.isQRUser = true;
      } else {
        this._userService.user.isQRUser = false;
      }
      if (response.pat_id !== undefined) {
        this._userService.user.isPatIdExists = true;
      } else {
        this._userService.user.isPatIdExists = false;
      }
      // istanbul ignore else
      if (
        !this._userService.user.isRxAuthenticatedUser ||
        !this._userService.user.isPatIdExists
      ) {
        this._userService
          .logoutSession()
          // tslint:disable-next-line: no-shadowed-variable
          .then(response => {
            this._common.navigate(ROUTES.verify_identity.absoluteRoute);
          })
          .catch(error => {
            this._common.navigate(ROUTES.verify_identity.absoluteRoute);
          });
      }
    });

    this.getTcpaContent();
  }

  // Updating consent and redirecting to next step.
  updateConsentForUser(consentStatus) {
    this._registrationService.showCircularLoader.next(true);
    this.consent = consentStatus;
    const requestBody = {
      consentStatus: this.consent,
      flow: 'ARX'
    };

    // have only put in updateconsent
    this._httpClient
      .doPut(this._registrationService.SERVICES.consent, requestBody)
      .then(request => {
        this._registrationService.showCircularLoader.next(false);
        this._gaService.sendEvent(this.gaEvent());
        this._registrationService.endureState();
        this.router.navigate([this._registrationService.nextRoute()]);
      })
      .catch(error => {
        this._registrationService.showCircularLoader.next(false);
        console.error(error);
        //we mark it as consent_pending if consent call fails and
        //user accepted. This way it will get marked automatically 
        //next time user logs in so they don't have to complete this screen
        if(this.consent ===  'A'){
          localStorage.setItem(AppContext.CONST.reg2_consent_pending, "true");
        }
        this._registrationService.endureState();
        this.router.navigate([this._registrationService.nextRoute()]);
      });
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.consent;
    return event;
  }

  getTcpaContent(): void {
    this.consent_content = {
      part1: COMMON_MAP.tcpa_communication_policy.part1,
      part2: COMMON_MAP.tcpa_communication_policy.part2,
      part3: COMMON_MAP.tcpa_communication_policy.part3,
      continueButtonText: "Yes, allow calls and texts",
      cancelButtonText: "No, don't allow",
      heading: "TCPA Communication Policy"
    };
   
  }
}
