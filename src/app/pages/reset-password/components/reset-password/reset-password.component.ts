import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { KEYS, ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  email: string;
  showLoader = false;
  emailPattern: string;

  routes = ROUTES;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _httpClient: HttpClientService,
    public passwordService: ResetPasswordService,
    public _commonUtilService: CommonUtil
  ) {
    this.emailPattern = CoreConstants.PATTERN.EMAIL;
    this.resetPasswordForm = this._formBuilder.group({
      username: ['', Validators.required]
    });

    if (this.passwordService.invalidTokenMessage !== '') {
      this._messageService.addMessage(
        new Message(
          this.passwordService.invalidTokenMessage,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );

      this.passwordService.invalidTokenMessage = '';
    }
  }

  resetPassword() {
    this._commonUtilService.validateForm(this.resetPasswordForm);
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.showLoader = true;
    const userData = { username: this.resetPasswordForm.value.username };
    const promise = this._httpClient.doPost(
      CoreConstants.RESOURCE.resetPassword,
      userData
    );
    promise.then(res => {
      this.showLoader = false;
      if (res.ok) {
        const body = res.json();
        if (body.messages !== undefined) {
          this._messageService.addMessage(
            new Message(body.messages[0].message, body.messages[0].type)
          );
        } else {
          this.passwordService.email = body.email;
          this.passwordService.phones = body.phone;
          this.passwordService.state = ROUTES.sendSecurityCode.route;
          this.passwordService.username = this.resetPasswordForm.value.username;
          this.router.navigate([ROUTES.sendSecurityCode.absoluteRoute]);
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
  resetPasswordMs() {
    this._commonUtilService.validateForm(this.resetPasswordForm);
    if (this.resetPasswordForm.invalid) {
      return;
    }
    this.passwordService.state = ROUTES.sendSecurityCode.route;
    this.passwordService.username = this.resetPasswordForm.value.username;
    this.router.navigate([ROUTES.sendSecurityCode.absoluteRoute]);
    localStorage.setItem(KEYS.reset_flow_flag, 'true');
  }

  ngOnInit() {}
}
