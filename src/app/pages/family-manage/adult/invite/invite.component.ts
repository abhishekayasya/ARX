import { Component, OnInit } from '@angular/core';
import { AdultService } from '@app/pages/family-manage/adult/adult.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ARX_MESSAGES, CoreConstants, ROUTES, Microservice } from '@app/config';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models';
import { FmService } from '@app/core/services/fm.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-fm-adult-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class AdultInviteComponent implements OnInit {
  ROUTES = ROUTES;

  email_option: string;

  newEmailForm: FormGroup;

  constructor(
    public adultService: AdultService,
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _http: HttpClientService,
    private _router: Router,
    private _message: MessageService,
    public manager: FmService,
    private _common: CommonUtil
  ) {
    this.initEmailForm();
  }

  initEmailForm() {
    this.newEmailForm = this._formBuilder.group({
      email: [
        '',
        [
          Validators.pattern(new RegExp(CoreConstants.PATTERN.EMAIL)),
          Validators.required
        ]
      ]
    });
  }

  sendInviteToMember() {
    if (this.email_option === 'new') {
      if (this.newEmailForm.invalid) {
        this._common.validateForm(this.newEmailForm);
        return;
      }
    }
    this.manager.enableLoad(true);
    // let url = `/svc/profiles/${localStorage.getItem(AppContext.CONST.uidStorageKey)}/members/1`;
    let state = true;
    const request_data = {
      to: 'email'
    };

    if (this.email_option === 'new') {
      if (this.newEmailForm.valid) {
        Object.assign(request_data, this.newEmailForm.value);
      } else {
        state = false;
        this._common.validateForm(this.newEmailForm);
      }
    }

    if (state) {
      this._http.putData(Microservice.fm_invite_adult, request_data).subscribe(
        response => {
          this.manager.disableLoad();
          if (response.messages[0].code === 'WAG_I_FA_1009') {
            this.adultService.invite_success = response.messages[0].message;
            this.manager.homeMessage = response.messages[0].message;
            this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
          } else {
            this._message.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
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

  ngOnInit(): void {
    this.manager.disableLoad();
    if (
      this.adultService.add_state !== this.adultService.states.send_invite.id
    ) {
      this._router.navigateByUrl(
        ROUTES.family_management.children.adult.add.absoluteRoute
      );
    }

    if (this.adultService.email_exit) {
      this.email_option = this.adultService.email_exit;
    } else {
      this.email_option = 'new';
    }
  }
}
