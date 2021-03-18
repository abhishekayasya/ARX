import { OnInit, Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { ROUTES } from '@app/config';
import { BoundElementPropertyAst } from '@angular/compiler';

@Component({
  selector: 'arxrf-send-security-code',
  templateUrl: './send-security-code.component.html',
  styleUrls: ['./send-security-code.component.scss']
})
export class SendSecurityCodeComponent implements OnInit {
  @Output() next = new EventEmitter();

  sendSecurityCodeForm: FormGroup;
  authOptions: any[] = [];

  authOptionClicked: string;
  phoneSuccessCode = 'WAG_I_PROFILE_2066';
  emailSuccessCode = 'WAG_I_PROFILE_2025';
  // emailSuccessCode : string = "WAG_I_PROFILE_2067";
  // phoneSuccessCode : string = "WAG_I_PROFILE_2067";
  showLoader = false;
  showTextSelection = false;
  phoneCodevalue = '';
  messageType = '';

  sendbuttonHighlights = true;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _httpClient: HttpClientService,
    public passwordService: ResetPasswordService
  ) {}

  updateVOption(event) {
    this.showTextSelection = false;
    if (event.target.id === 'txtMsg') {
      this.showTextSelection = true;
      this.sendbuttonHighlights = true;
    }
    if (event.target.id === 'email') {
      this.sendbuttonHighlights = false;
    }
    this.authOptionClicked = event.target.value;
  }

  onchangePhoneCode(event: any) {
    this.phoneCodevalue = event.target.value;
    this.sendbuttonHighlights = true;
    if (this.phoneCodevalue.length === 4) {
      this.sendbuttonHighlights = false;
    }
  }

  sendSecurtiyCode() {
    this.showLoader = true;
    let data = {};
    if (this.authOptionClicked === 'email') {
      this.messageType = 'email';
      data = {
        type: 'email',
        username: this.passwordService.username,
        flow: 'arx'
      };
    } else {
      const lastFourDigit = this.sendSecurityCodeForm.value.phonecode;
      this.messageType = 'phone';
      localStorage.setItem('phoneLastfourDigits', lastFourDigit);
      data = {
        type: 'phone',
        username: this.passwordService.username,
        code: lastFourDigit,
        flow: 'arx'
      };
    }

    this.passwordService.authOptionClicked = this.authOptionClicked;

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

            CoreConstants.RESETPASSWORD.codeMessage = this.messageType;
            let currentStr = body.messages[0].message.substring(11);
            currentStr = this.htmlToPlaintext(currentStr);
            CoreConstants.RESETPASSWORD.responseMessage = currentStr;
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
      this.showLoader = false;
      this._messageService.addMessage(
        new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
      );
      console.error(err);
    });
  }

  getLastFourNumber(phoneNumber) {
    if (phoneNumber !== undefined) {
      return phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length);
    }
    return '';
  }

  getPhoneNumberByPriority(priority: string) {
    if (priority !== undefined) {
      let phoneList: Array<any> = [];
      phoneList = this.passwordService.phones;
      phoneList.forEach(item => {
        if (priority === item.priority) {
          return item.phone;
        }
      });
    }
    return '';
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  ngOnInit() {
    event.preventDefault();
    this.sendSecurityCodeForm = this._formBuilder.group({
      phonecode: ['', Validators.required]
    });
  }
}
