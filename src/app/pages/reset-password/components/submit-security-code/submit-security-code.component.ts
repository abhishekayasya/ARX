import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-submitSecurityCode',
  templateUrl: './submit-security-code.component.html',
  styleUrls: ['./submit-security-code.component.scss']
})
export class SubmitSecurityCodeComponent implements OnInit, OnDestroy {
  submitSecurityCodeForm: FormGroup;
  codeMessage: string = CoreConstants.RESETPASSWORD.codeMessage;
  responseMessage: string = CoreConstants.RESETPASSWORD.responseMessage;
  emailResponseMessage = '';
  phoneLastFourDigit = '';
  phoneResponseMessage = '';
  emailMessageSuccess: string = CoreConstants.RESETPASSWORD.emailMessageSuccess;
  phoneMessageSuccess: string = CoreConstants.RESETPASSWORD.phoneMessageSuccess;
  showLoader = false;
  continueButtonHighlights = true;
  emailMessageText = false;
  phoneMessageText = false;
  Codevalue = '';
  emailMessage: string = CoreConstants.RESETPASSWORD.emailMessage;
  phoneMessage: string = CoreConstants.RESETPASSWORD.phoneMessage;
  phoneSuccessCode = 'WAG_I_PROFILE_2066';
  emailSuccessCode = 'WAG_I_PROFILE_2025';
  codeMessageText = '';
  securityCodeCheckMessage: string;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _httpClient: HttpClientService,
    public passwordService: ResetPasswordService,
    public _router: Router,
    public _commonUtilService: CommonUtil
  ) {
    this.submitSecurityCodeForm = this._formBuilder.group({
      code: ['', Validators.required]
    });
  }

  onchangeCode(event: any) {
    this.Codevalue = event.target.value;
    this.continueButtonHighlights = true;
    if (this.Codevalue.length === 6) {
      this.continueButtonHighlights = false;
    }
  }
  submitSecurtiyCode() {
    this._commonUtilService.validateForm(this.submitSecurityCodeForm);
    if (this.submitSecurityCodeForm.invalid) {
      return;
    }

    this.showLoader = true;
    const refId = localStorage.getItem('refId');
    const data = {
      pincode: this.submitSecurityCodeForm.value.code,
      refId: refId
    };

    const promise = this._httpClient.doPost(
      CoreConstants.RESOURCE.submitCode,
      data
    );
    promise.then(res => {
      this.showLoader = false;
      if (res.ok) {
        const body = res.json();

        if (body.status === 'success') {
          if (body.status === 'success') {
            this.passwordService.state = ROUTES.newPassword.route;
            this.router.navigateByUrl(ROUTES.newPassword.absoluteRoute);
          } else {
            this._messageService.addMessage(
              new Message(
                body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );

            // this.securityCodeCheckMessage = "Incorrect Code. Please try again.";
          }
        }
        if (body.messages !== undefined) {
          if (body.messages[0].code === 'WAG_E_PROFILE_2021') {
            /*
              this._messageService.addMessage(
                new Message(
                  body.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
              */
            this.securityCodeCheckMessage = 'Incorrect Code. Please try again.';
          }
        }
        if (body.refId !== undefined) {
          localStorage.setItem('refId', body.refId);
        }
      }
    });
    promise.catch(err => {
      this.onsubmitSecurtiyCodeEror();
    });
  }

  ngOnInit() {
    this.phoneLastFourDigit = localStorage.getItem('phoneLastfourDigits');
    if (this.codeMessage === this.emailMessageSuccess) {
      this.codeMessageText = this.emailMessage;
      this.emailMessageText = true;
      this.emailResponseMessage = this.responseMessage;
    }
    if (this.codeMessage === this.phoneMessageSuccess) {
      this.codeMessageText = this.phoneMessage;
      this.phoneMessageText = true;
      this.phoneResponseMessage = this.responseMessage;
    }
  }

  requestAnotherCode() {
    this.showLoader = true;
    let data = {};
    if (this.codeMessage === 'email') {
      data = {
        type: 'email',
        username: this.passwordService.username,
        flow: 'arx'
      };
    } else {
      const lastFourDigit = localStorage.getItem('phoneLastfourDigits');
      data = {
        type: 'phone',
        username: this.passwordService.username,
        code: lastFourDigit,
        flow: 'arx'
      };
    }

    const promise = this._httpClient.doPost(
      CoreConstants.RESOURCE.sendCode,
      data
    );
    promise.then(res => {
      this.showLoader = false;
      if (res.ok) {
        const body = res.json();
        if (body.messages !== undefined) {
          if (
            body.messages[0].code === this.phoneSuccessCode ||
            body.messages[0].code === this.emailSuccessCode
          ) {
            this.passwordService.state = ROUTES.submitSecurityCode.route;
            this.router.navigateByUrl(ROUTES.submitSecurityCode.absoluteRoute);

            CoreConstants.RESETPASSWORD.codeMessage = this.codeMessage;
            let currentStr = body.messages[0].message.substring(11);
            currentStr = this.htmlToPlaintext(currentStr);
            this.emailResponseMessage = currentStr;
            this.phoneResponseMessage = currentStr;
          } else {
            this._messageService.addMessage(
              new Message(
                body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
        if (body.refId !== undefined) {
          localStorage.setItem('refId', body.refId);
        }
      }
    });
    promise.catch(err => {
      this.onsubmitSecurtiyCodeEror();
    });
    // this.passwordService.state = ROUTES.sendSecurityCode.route;
    // this._router.navigateByUrl(ROUTES.sendSecurityCode.absoluteRoute);
  }
  requestPreviousPage() {
    this.passwordService.state = ROUTES.sendSecurityCode.route;
    this._router.navigateByUrl(ROUTES.sendSecurityCode.absoluteRoute);
  }

  ngOnDestroy() {
    this._messageService.removeMessage(0);
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }
  onsubmitSecurtiyCodeEror() {
    this.showLoader = false;
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
}
