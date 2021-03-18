import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FmService } from '@app/core/services/fm.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { Microservice } from '@app/config/microservice.constant';

@Component({
  selector: 'arxrf-fm-userinvite',
  templateUrl: './invite-page.component.html',
  styleUrls: ['./invite-page.component.scss']
})
export class FamilyInvitePageComponent implements OnInit {
  user: string;

  invalidInvite: boolean;
  invitationExpired: boolean;
  validInvitation: boolean;

  invalidUser: boolean;

  constructor(
    private _route: ActivatedRoute,
    public manager: FmService,
    private _http: HttpClientService,
    private _message: MessageService,
    private _common: CommonUtil,
    private _router: Router
  ) {
    this._route.queryParams.subscribe(params => {
      if (params['invitation_token']) {
        this.manager.inviteId = params['invitation_token'];
      }
      if (params['kba']) {
        this.manager.isKba = params['kba'];
      }
    });
  }

  ngOnInit(): void {
    if (this.manager.inviteId) {
      // let url = `/svc/profiles/family/invitations/${this.manager.inviteId}`;
      const url = Microservice.fm_invitations; // microservice url
      let requestData;
      if (this.manager.isKba) {
        requestData = { kba: 'true' };
      } else {
        requestData = { invitationToken: this.manager.inviteId };
      }
      this._http.postData(url, requestData).subscribe(
        response => {
          this.manager.disableLoad();
          if (response.adminFirstName && response.adminLastName) {
            this.user = response.adminFirstName + ' ' + response.adminLastName;
          }
          if (response.messages) {
            switch (response.messages[0].code) {
              case 'WAG_W_FA_1073':
                // invitation expired;
                this.invitationExpired = true;
                break;

              case 'WAG_I_FA_1075':
                // valid invitation
                this.validInvitation = true;
                if (sessionStorage.getItem(this.manager.inviteUrlKey) != null) {
                  sessionStorage.removeItem(this.manager.inviteUrlKey);
                }
                break;

              case 'WAG_W_FA_1076':
                sessionStorage.setItem(
                  this.manager.inviteUrlKey,
                  `${window.location.pathname}${window.location.search}`
                );
                this._router.navigateByUrl(
                  ROUTES.family_management.children.verify.absoluteRoute
                );
                break;

              case 'WAG_W_FA_1080':
                sessionStorage.setItem(
                  AppContext.CONST.login_prefill_username_key,
                  response.userName
                );
                sessionStorage.setItem(
                  AppContext.CONST.login_callback_urlkey,
                  `${window.location.pathname}${window.location.search}`
                );

                if (
                  localStorage.getItem(AppContext.CONST.uidStorageKey) != null
                ) {
                  this._common.navigate(ROUTES.logout.absoluteRoute);
                } else {
                  this._common.navigate(ROUTES.login.absoluteRoute);
                }
                break;

              case 'WAG_W_FA_1081':
                this.invalidUser = true;
                this.invalidInvite = true;
                break;

              default:
                this._message.addMessage(
                  new Message(
                    response.messages[0].message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
                this.invalidInvite = true;
            }
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
          this.invalidInvite = true;
        }
      );
    }
  }

  acceptInvite() {
    // let url = `/svc/profiles/family/invitations/${this.manager.inviteId}`;
    // let url = `/familymgmt/csrf-disabled/members/invitations/${this.manager.inviteId}`;   // microservice url
    const url = this._common.stringFormate(Microservice.fm_accept_invitation, [
      this.manager.inviteId
    ]); // microservice url
    this.manager.enableLoad(true);
    const request_data = {
      inviteStatus: 'accept'
    };

    this._http.putData(url, request_data).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages[0].code === 'WAG_I_FA_1078') {
          sessionStorage.setItem('fmInvMsg', response.messages[0].message);
          this.inviteActionPostProcess('accept');
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

  declineInvite() {
    // let url = `/svc/profiles/family/invitations/${this.manager.inviteId}`;
    // let url = `/familymgmt/csrf-disabled/members/invitations/${this.manager.inviteId}`; // microservice url
    const url = this._common.stringFormate(Microservice.fm_delete_invitation, [
      this.manager.inviteId
    ]); // microservice url
    this.manager.enableLoad(true);
    const request_data = {
      inviteStatus: 'decline'
    };

    this._http.putData(url, request_data).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages[0].code === 'WAG_I_FA_1056') {
          this.inviteActionPostProcess('decline');
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

  inviteActionPostProcess(type) {
    if (type === 'accept') {
      if (localStorage.getItem(AppContext.CONST.uidStorageKey) == null) {
        this._common.navigate(
          ROUTES.family_management.children.manage_access.absoluteRoute
        );
      } else {
        this._common.navigate(ROUTES.family_management.absoluteRoute);
      }
    } else {
      this._common.navigate('/');
    }
  }

  logoutPersist() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      `${window.location.pathname}${window.location.search}`
    );
    this._common.navigate(ROUTES.logout.absoluteRoute);
  }
}
