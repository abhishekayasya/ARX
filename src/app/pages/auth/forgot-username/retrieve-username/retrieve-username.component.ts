import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-retrieve-username',
  templateUrl: './retrieve-username.component.html',
  styleUrls: ['./retrieve-username.component.scss']
})
export class RetrieveUsernameComponent implements OnInit {
  forgotUsernameForm: FormGroup;
  showLoader = false;
  emailPattern: string;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _httpClient: HttpClientService,
    private _commonUtil: CommonUtil
  ) {
    this.emailPattern = CoreConstants.PATTERN.EMAIL;
    this.forgotUsernameForm = this._formBuilder.group({
      username: ['', Validators.required]
    });
  }

  retrieveUsername() {
    if (this.forgotUsernameForm.invalid) {
      this._commonUtil.validateForm(this.forgotUsernameForm);
      return;
    }
    this.showLoader = true;
    const userData = { email: this.forgotUsernameForm.value.username };
    this._httpClient
      .postData(CoreConstants.RESOURCE.forgotUsername, userData)
      .subscribe(
        res => {
          this.showLoader = false;
          if (res.messages !== undefined) {
            if (res.messages[0].code === 'WAG_I_PROFILE_2031') {
              this.router.navigateByUrl(ROUTES.usernameSent.publicUrl);
            } else {
              this._messageService.addMessage(
                new Message(res.messages[0].message, res.messages[0].type)
              );
            }
          }
        },

        error => {
          this.showLoader = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          console.error(error);
        }
      );
  }

  ngOnInit() {}
}
