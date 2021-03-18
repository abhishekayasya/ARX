import { Component, OnInit, Input } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { FmService } from '@app/core/services/fm.service';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { Router } from '@angular/router';
import { ChildService } from '@app/pages/family-manage/child/child.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-confirm-child',
  templateUrl: './confirm-child.component.html',
  styleUrls: ['./confirm-child.component.scss']
})
export class ConfirmChildComponent implements OnInit {
  public childDetails;
  public invitationDetails;
  public routes = ROUTES;

  constructor(
    public manager: FmService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _http: HttpClientService,
    private _message: MessageService,
    private childService: ChildService,
    private _router: Router
  ) {
    this.manager.disableLoad();
    this._common.removeNaturalBGColor();
    this.childDetails = this.childService.childDetails;
    this.invitationDetails = this.childService.invitationDetails;
  }

  ngOnInit() {
    if (!this.childDetails) {
      this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
    }
  }

  addChild() {
    // let url = `/svc/profiles/${localStorage.getItem(AppContext.CONST.uidStorageKey)}/members/${this.childDetails.memberId}`;
    // let url = '/familymgmt/csrf-disabled/members/child';
    this.manager.enableLoad(true);
    this._http
      .putData(Microservice.fm_confirm_child, { status: 'submit' })
      .subscribe(
        res => {
          this.manager.disableLoad();
          if (
            res['messages'][0].code === 'WAG_I_FA_1006' ||
            res['messages'][0].code === 'WAG_I_FA_1009'
          ) {
            // this.childService.add_success = res.messages[0].message;
            this.manager.homeMessage = res.messages[0].message;
            sessionStorage.setItem('fmInvMsg', res.messages[0].message);
            this.childService.childDetails = undefined;
            this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
          } else {
            this._message.addMessage(
              new Message(res['messages'][0].message, res['messages'][0].type)
            );
          }
        },
        err => {
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
