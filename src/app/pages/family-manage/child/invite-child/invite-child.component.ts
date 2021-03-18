import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { FmService } from '@app/core/services/fm.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { ChildService } from '@app/pages/family-manage/child/child.service';
import { Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-invite-child',
  templateUrl: './invite-child.component.html',
  styleUrls: ['./invite-child.component.scss']
})
export class InviteChildComponent implements OnInit {
  public childDetails;

  public userName;
  public childName;
  public childInviteForm: FormGroup;
  public routes = ROUTES;

  constructor(
    public manager: FmService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _http: HttpClientService,
    private _message: MessageService,
    public childService: ChildService,
    private _router: Router
  ) {
    this.manager.disableLoad();
    this._common.removeNaturalBGColor();
    this.childDetails = this.childService.childDetails;
  }

  ngOnInit() {
    if (!this.childDetails) {
      this._router.navigateByUrl(ROUTES.family_management.absoluteRoute);
    } else if (!this.childDetails.isAcctExists) {
      this._router.navigateByUrl(
        ROUTES.family_management.children.child.confirm.absoluteRoute
      );
    }
    // this.userName = this._userService.user.firstName + ' ' + this._userService.user.lastName;

    const profile = JSON.parse(
      localStorage.getItem(AppContext.CONST.uInfoStorageKey)
    );
    this.userName =
      profile.basicProfile.firstName + ' ' + profile.basicProfile.lastName;
    this.childName =
      this.childDetails.firstName + ' ' + this.childDetails.lastName;
    this.childInviteForm = this._formBuilder.group({
      email: ['', Validators.required],
      confirmEmail: ['', Validators.required],
      subject: [''],
      invitationMsg: [''],
      additionalMsg: [''],
      memberType: ['child'],
      status: ['confirm']
    });
    this.prefillData();
  }

  prefillData() {
    const subject = `Join ${this.userName}'s Family Prescriptions Account`;
    // tslint:disable-next-line: max-line-length
    const invitationMsg = `You're invited to join ${this.userName}'s Family Prescriptions on AllianceRx Walgreens Prime. By accepting this invitation,
    ${this.userName} can manage your health history, order refills on your your behalf and more. You will still retain control
    of your account and can remove ${this.userName} as your Family Prescription administrator at any time.`;
    this.childInviteForm.patchValue({
      email: this.childDetails.email,
      subject: subject,
      invitationMsg: invitationMsg
    });
  }

  sendInvite() {
    this.childInviteForm.patchValue({
      confirmEmail: this.childInviteForm.value.email
    });

    if (this.childInviteForm.invalid) {
      this._common.validateForm(this.childInviteForm);
      return;
    }

    Object.assign(this.childService.childDetails, this.childInviteForm.value);

    // let url = `/svc/profiles/${localStorage.getItem(AppContext.CONST.uidStorageKey)}/members/${this.childDetails.memberId}`;
    // let url = '/familymgmt/csrf-disabled/members/child';

    this.manager.enableLoad(true);
    this._http
      .putData(Microservice.fm_invite_child, this.childInviteForm.value)
      .subscribe(
        res => {
          this.manager.disableLoad();
          if (res['messages'] && res['messages'].length) {
            this._message.addMessage(
              new Message(res['messages'][0].message, res['messages'][0].type)
            );
          } else {
            this.childService.invitationDetails = res;
            this._router.navigateByUrl(
              ROUTES.family_management.children.child.confirm.absoluteRoute
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
