import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { RegistrationService } from '@app/core/services/registration.service';
import { ConsentService } from '@app/core/services/consent.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { UserService } from '@app/core/services/user.service';
import { ROUTES } from '@app/config';
import { HttpClientService } from '@app/core/services/http.service';
import { Microservice } from '@app/config/microservice.constant';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { AppContext } from '@app/core/services/app-context.service';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { userInfo } from 'os';

@Component({
  selector: 'arxrf-signup-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class RegistrationSuccessComponent implements OnInit {
  
  isBuyout: boolean;
  declarationStatus = false;
  showDeclarationError = false;

  private termsChecked : boolean;

  smIdCheckPayload = {
    profileIds: [],
    flow: 'ARX'
  }

  constructor(
    private _common: CommonUtil,
    private _gaService: GaService,
    public regService: RegistrationService,
    private _buyoutService: BuyoutService,
    private _userService: UserService,
    private _httpClient: HttpClientService,
    private _commonUtil: CommonUtil,
    private _consentService: ConsentService,
    private _appContext: AppContext,
  ) {}

  ngOnInit() {
    this._gaService.sendEvent(this.gaEvent());
    this.initBuyoutCheck();
    this.registerDeviceInfo();

    //initiating process to call Hipaa and Consent.
    this.callConsentAndHipaa();

    //send registration success confirmation email
    this.sendSuccessEmail();

    this.regService.registrationTitle = window.screen.width > 480 ?
      'Confirmed. Thank you.':
      'Confirmed. <br/> Thank you.';
    
    // Disabling back option button for registration success page.
    this._commonUtil.diableBrowserBack();
  }

  redirectToCallBackURlForRegistration(callBackUrl) {
    window.sessionStorage.removeItem(
      AppContext.CONST.registration_callback_urlkey
    );
    window.sessionStorage.removeItem(AppContext.CONST.login_callback_urlkey);
    window.sessionStorage.removeItem(AppContext.CONST.hd_rr_unauth_user);

    this._commonUtil.navigate(callBackUrl);
  }

   /**
   * Function to send HIPAA and Consent request for user.
   */
  private callConsentAndHipaa(): void {
    // If user went through regular reg2 flow checkbox status will be 'true'
    const checkboxStatus= this._appContext.getTermsCheckboxAccepted() === 'true'
    if(checkboxStatus){
        this.regService.showCircularLoader.next(true);
        this._consentService.initiateHipaCall(checkboxStatus)
      .then(()=>{
        return this._consentService.initiateConsentCall(checkboxStatus);
      })
      .then(() => {
        this.regService.showCircularLoader.next(false);
        const callBackUrl = window.sessionStorage.getItem(
          AppContext.CONST.registration_callback_urlkey
        );
        this.logConsentIfSmIdFound();
        // if the user is unauthenticated and has HD refill reminder url in session skip insurance and health conditions
        if(callBackUrl){
          this.redirectToCallBackURlForRegistration(callBackUrl);
        }
        return
      })
      .catch( error => {
        this.logConsentIfSmIdFound();
        console.error("Error in Hipaa and consent call", error)
        return
      })
    } else {
      this.logConsentIfSmIdFound();
    }
  }

  initBuyoutCheck(): void {
    this.regService.showCircularLoader.next(true);
    this._buyoutService.available(this._userService.user.id).subscribe(
      response => {
        this.regService.showCircularLoader.next(false);

        if (response.isBuyoutUnlock) {
          this.isBuyout = true;
        } else {
          this.isBuyout = false;
        }
      },

      error => {
        this.isBuyout = false;
        this.regService.showCircularLoader.next(false);
      }
    );
  }

  redirectToDashBoard() {
    sessionStorage.setItem('redirect_to_account', 'true');
    this._common.navigate(ROUTES.account.absoluteRoute);
  }

  redirectToBuyout() {
    this._common.navigate(ROUTES.buyout.absoluteRoute);
  }

  registerDeviceInfo() {
    const data = {};
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');
    const promise = this._httpClient.doPostLogin(
      '/profile/csrf-disabled/registerDeviceInfo',
      data,
      getDeviceInfo
    );

    promise.then(res => {});

    promise.catch(err => {
      console.error(err);
    });
  }

  getCurrentDateTime(){
    const currentDate = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Chicago"})); 
    const month = ((currentDate.getMonth()+1) < 10 ? "0" : "") + (currentDate.getMonth()+1)
    const year = currentDate.getFullYear()
    const day = (currentDate.getDate() < 10 ? "0" : "") + currentDate.getDate()
    const minutes = (currentDate.getMinutes() < 10 ? "0" : "") + currentDate.getMinutes()
    const seconds =  (currentDate.getSeconds() < 10 ? "0" : "") + currentDate.getSeconds()
    let hours = currentDate.getHours()
    const half = hours < 12 ? 'AM' : 'PM'
    if (hours > 12) {
        hours = hours - 12
    }
    let hoursString = hours.toString();
    if(hours < 10){
      hoursString = "0" + hoursString
    }
    const formattedDateTime = month + '/' + day + '/' + year + " " + hoursString + ":" + minutes + ":" + seconds + " " + half
    return formattedDateTime
  }

  /**
   * funtion to call /smLinkage, if smId found, then call /arxwp/consent service
   */
  private logConsentIfSmIdFound(): void {
    this.smIdCheckPayload.profileIds.push(this._userService.user.id)
    this._httpClient.doPost(
      Microservice.scriptmed_linkage,
      this.smIdCheckPayload
    ).then(resFromSmCheck=> {
      if(resFromSmCheck.ok){
        const responseData = resFromSmCheck.json();
        if(responseData.messages){
          console.log("No match found: ", responseData.messages[0].message)
        } else if(responseData.SMLinkages){
          const smId = responseData.SMLinkages[0].smId;
          const formattedDateTime = this.getCurrentDateTime();
          const logConsentPayload = {
            patient_id: smId,
            action_time: formattedDateTime,
            consent: 'B',
            source: 'Digital'
          }
          const promise = this._httpClient.doPost(
            Microservice.log_sm_consent,
            logConsentPayload
          );
          return promise;
        }
      } else {
        throw Error("error in call to smLinkage");
      }
    }).then(resFromLogService => {
      console.log("response from consent log service", resFromLogService);
    }).catch(err => {
      console.error("Error in logConsentIfSmIdFound", err);
    });
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.registration;
    event.action = GA.actions.registration.success;
    return event;
  }

  sendSuccessEmail() {
    this._httpClient.postData(Microservice.register_success_email, {
      contact: {
        firstName: this._userService.user.firstName,
        emailAddress: this._userService.user.email
      }
    }).subscribe({error(err) {
      console.error("Error in sendSuccessEmail", err);
      }
    });
  }
}
