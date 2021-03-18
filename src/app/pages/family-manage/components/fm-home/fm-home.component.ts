import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FmService } from '@app/core/services/fm.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { CommonUtil } from '../../../../core/services/common-util.service';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { ChildService } from '@app/pages/family-manage/child/child.service';

@Component({
  selector: 'arxrf-fm-home',
  templateUrl: './fm-home.component.html',
  styleUrls: ['./fm-home.component.scss']
})
export class FmHomeComponent implements OnInit, AfterViewInit {
  managedBy: string;
  ROUTES = ROUTES;

  selectedForEnroll = '';

  userId: string;

  homeDeliveryInfoState: boolean;
  accountStatusModelState: boolean;
  accountStatusCheckFor: any;
  accountResend: any;
  membersFor: Array<any>;

  accountStateOverlayState: boolean;
  IsMemberSelected = false;

  isFullAccessMember: Array<any> = [];
  resendFlag: boolean;
  resendDate: any;
  resendDateTime: any;
  proId: boolean;

  constructor(
    public manager: FmService,
    private _message: MessageService,
    private _common: CommonUtil,
    private _router: Router,
    public userService: UserService,
    private _http: HttpClientService,
    private childService: ChildService,
    public appContext: AppContext
  ) {
    this.userId = localStorage.getItem(AppContext.CONST.uidStorageKey);
  }

  ngOnInit(): void {
    this.manager.members = undefined;
    this.manager.loader = true;
    this.manager.loaderOverlay = true;
          this.manager.getMembers(undefined).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            response => {
              this.manager.loader = false;
              this.manager.loaderOverlay = false;
              const mem = response.members;
              if (mem !== undefined) {
                this.manager.members = mem.filter(item => {
                  const messages = item.messages;
                  if (messages && messages[0].code === 'WAG_I_FA_1003') {
                    return false;
                  }
                  return true;
                });

                //this.manager.members = response.members;

                for (let i = 0; i < this.manager.members.length; i++) {
                  this.openAccountInviteBox(this.manager.members[i]);
                }

                for (const prop in this.manager.members) {
                  // tslint:disable-next-line: max-line-length
                  if (
                    this.manager.members[prop].accountStatus ===
                      'Full Access' &&
                    this.manager.members[prop].memberType !==
                      'Head of Household (You)'
                  ) {
                    // this.isFullAccessMember.push(this.manager.members[prop].firstName + this.manager.members[prop].lastName);
                    this.isFullAccessMember.push(this.manager.members[prop]);
                  }
                }
                this.updateManagedBy(response.adminProfiles);
                this.getInsuranceInfo();
                //   in case logged in user accept inv messg shows
                if (sessionStorage.getItem('fmInvMsg')) {
                  this.manager.loader = false;
                  const successMsg = sessionStorage.getItem('fmInvMsg');

                  this._message.addMessage(
                    new Message(
                      successMsg,
                      ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                      true
                    )
                  );
                  sessionStorage.removeItem('fmInvMsg');
                }
              } else {
                //in case there is no family members
                this.updateManagedBy(response.adminProfiles);
                //   in case logged in user accept inv messg shows
                if (sessionStorage.getItem('fmInvMsg')) {
                  this.manager.loader = false;
                  const successMsg = sessionStorage.getItem('fmInvMsg');

                  this._message.addMessage(
                    new Message(
                      successMsg,
                      ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                      true
                    )
                  );
                  sessionStorage.removeItem('fmInvMsg');
                }
              }
            },
            error => {
              this.manager.loader = false;
              this._message.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );
  }

  /**
   * Update text for managed by section
   */
  updateManagedBy(admins) {
    let plus = '';
    if (admins) {
      this.managedBy = `${admins[0].firstName} ${admins[0].lastName}`;
      if (admins.length > 1) {
        plus = '(+' + (admins.length - 1) + ')';
      }
      this.managedBy = this.managedBy + plus;
    }
  }

  initRemoveAction(profileId: string) {
    this.manager.removeModalState = true;
    this.manager.removingMember = this.manager.members.find(item => {
      return item.profileId === profileId;
    });
  }

  /**
   * cancel remove modal and action.
   */
  cancelRemoveAction() {
    this.manager.removeModalState = false;
    this.manager.removingMember = undefined;
    this.manager.updateRemoveModalState(false);
  }

  /**
   * action if remove button pressed on member remove model.
   */
  continueRemoveAction() {
    const member = this.manager.removingMember;
    this.cancelRemoveAction();

    this.manager.loader = true;
    this.manager.loaderOverlay = true;
    this.manager.removeMember(member.profileId).subscribe(
      response => {
        this.manager.loader = false;
        this.manager.loaderOverlay = false;
        if (response.messages) {
          if (response.messages[0].code === 'WAG_I_FA_1058') {
            this._message.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
              )
            );
            this.manager.members = this.manager.members.filter(item => {
              return item.profileId !== member.profileId;
            });
          } else {
            this._message.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
      },
      error => {
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  ngAfterViewInit(): void {}

  getInsuranceInfo() {
    this.manager.enrolmentList().subscribe(response => {
      if (response.msInsEnrollmentViewBeanList) {
        response.msInsEnrollmentViewBeanList.forEach(item => {
          for (const index in this.manager.members) {
            if (this.manager.members[index].profileId === item.meId) {
              this.manager.members[index].enroll =
                item.MSEnrollmentInsuranceBean.msInsStatusCd;

              return;
            }
          }
        });
      }
    });

    if (this.manager.members) {
      this.manager.getAdminInsuranceInfo().subscribe(response => {
        if (response.msEnrollInsuranceBeanForm) {
          const member = this.manager.members.find(
            item => item.profileId === this.userId
          );
          if (member) {
            member.enroll = response.msEnrollInsuranceBeanForm.msInsStatusCd;
          }
        }
      });
    }

    if (this.manager.homeMessage) {
      let message;
      this.manager.getMembers(undefined).subscribe(
        response => {
          this.manager.loader = false;
          this.manager.loaderOverlay = false;
          const mem = response.members;
          this.manager.members = mem.filter(item => {
            const messages = item.messages;
            if (messages && messages[0].code === 'WAG_I_FA_1003') {
              return false;
            }
            return true;
          });
          for (let i = 0; i < this.manager.members.length; i++) {
            this.openAccountInviteBox(this.manager.members[i]);
          }

          message = this.manager.members[
            this.manager.members.length - 1
          ].messages[0].message.split('<strong>');

          const invitationTimes =
            message[3] !== undefined
              ? message[3].split('.')[0].replace('</strong>', '')
              : '';
          const resendInvitationDates =
            message[4] !== undefined ? message[4].split('</strong>')[0] : '';
          // tslint:disable-next-line: max-line-length
          const resendInvitationTimes =
            message[5] !== undefined
              ? message[5].split('.')[0].replace('</strong>', '')
              : '';

          this._message.addMessage(
            new Message(
              'Your invitation has been sent. <br/><br/> <strong>' +
                this.manager.members[this.manager.members.length - 1]
                  .firstName +
                ' ' +
                this.manager.members[this.manager.members.length - 1].lastName +
                // tslint:disable-next-line: max-line-length
                '</strong> has received an invitation to join your Family Prescriptions Account.The invitation will expire 7 days from receipt. If there is no response, you may resend an invite on ' +
                resendInvitationDates +
                ' ' +
                resendInvitationTimes +
                '. Invitations can be resent 3 times',
              ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
              true
            )
          );
          this.manager.homeMessage = undefined;
        },
        error => {
          this.manager.loader = false;
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

  /**
   * redirect user to page based on selected option on account actions list.
   *
   * @param event
   */
  accountSettingsAction(event) {
    if (!event.target.value) {
      return false;
    }
    if (event.target.value.indexOf('family-management') > -1) {
      this._router.navigateByUrl(event.target.value);
    } else {
      this._common.navigate(event.target.value);
    }
  }

  filterForEnroll() {
    if (this.manager.members) {
      return this.manager.members.filter(item => {
        return item.enroll === 4;
      });
    } else {
      return [];
    }
  }

  redirectToEnroll() {
    this.IsMemberSelected = this.selectedForEnroll === '' ? true : false;
    if (this.selectedForEnroll) {
      this._router.navigateByUrl(
        `${ROUTES.family_management.children.health_update.absoluteRoute}?mid=${this.selectedForEnroll}&type=add`
      );
    }
  }

  updateSelectForHd(event) {
    this.selectedForEnroll = event.target.value;
    this.IsMemberSelected = event.target.value === '' ? true : false;
  }

  redirectToAddAdult() {
    this.manager.updateAddAdultModelState(false);
    this._router.navigateByUrl(
      this.ROUTES.family_management.children.adult.add.absoluteRoute
    );
  }

  redirectToAddChild() {
    this.manager.updateAddChildModelState(false);
    this.childService.childDetails = undefined;
    this._router.navigateByUrl(
      this.ROUTES.family_management.children.child.add.absoluteRoute
    );
  }

  editViewHdInfo(memberId) {
    this._router.navigateByUrl(
      `${ROUTES.family_management.children.health_update.absoluteRoute}?mid=${memberId}`
    );
  }

  updateHdModelState(event) {
    this.homeDeliveryInfoState = event;
  }

  updateACModelState(event) {
    this.accountStatusModelState = event;
  }

  openAccountInviteBox(member, profId?: string) {
    let message;
    this.accountStatusCheckFor = member;
    if (
      this.accountStatusCheckFor.memberType !== 'Head of Household (You)' &&
      this.accountStatusCheckFor.messages
    ) {
      message = this.accountStatusCheckFor.messages[0].message.split(
        '<strong>'
      );

      if (message && message.length > 0) {
        // tslint:disable-next-line: max-line-length
        this.accountStatusCheckFor.invitationInfo.invitationTime =
          message[3] !== undefined
            ? message[3].split('.')[0].replace('</strong>', '')
            : '';
        this.accountStatusCheckFor.invitationInfo.resendInvitationDate =
          message[4] !== undefined ? message[4].split('</strong>')[0] : '';
        // tslint:disable-next-line: max-line-length
        this.accountStatusCheckFor.invitationInfo.resendInvitationTime =
          message[5] !== undefined
            ? message[5].split('.')[0].replace('</strong>', '')
            : '';
        if (this.accountStatusCheckFor.profileId === '200001370676') {
          this.accountStatusCheckFor.invitationInfo.resendFlag = true;
        }

        if (profId !== undefined) {
          this.accountStatusCheckFor.invitationInfo.resendFlag = false;
          this.accountStatusCheckFor.invitationInfo.proId = true;
          this.accountStatusCheckFor.invitationInfo.invitationTime =
            message[3] !== undefined
              ? message[3].split('.')[0].replace('</strong>', '')
              : '';
          this.accountStatusCheckFor.invitationInfo.resendInvitationDate =
            message[4] !== undefined ? message[4].split('</strong>')[0] : '';
          // tslint:disable-next-line: max-line-length
          this.accountStatusCheckFor.invitationInfo.resendInvitationTime =
            message[5] !== undefined
              ? message[5].split('.')[0].replace('</strong>', '')
              : '';
        }
      }
    }
    this.accountStatusModelState = false;
  }

  updateAccountStatusOverlay(event) {
    this.accountStateOverlayState = event;
  }

  inviteAction(
    action: string,
    profId: any,
    inviteId: any,
    frstname: string,
    lName: string
  ) {
    let url;
    const request_data = <any>{};

    // tslint:disable-next-line: no-shadowed-variable
    const handleActionResponse = (messageCode, response, action = '') => {
      this.updateACModelState(false);

      if (action === 'cancel') {
        this.manager.members = this.manager.members.filter(
          //mem => mem.profileId !== this.accountStatusCheckFor.profileId
          mem => mem.profileId !== profId
        );
      } else if (response.members) {
        this.manager.members = response.members;
        this.getInsuranceInfo();
      }

      if (response.messages) {
        if (response.messages[0].code === 'WAG_I_FA_1057') {
          this._message.addMessage(
            new Message(
              'Your invitation has been cancelled <br/> <br/> <strong>' +
                frstname +
                ' ' +
                lName +
                '</strong> will no longer be able to join your Family Prescriptions Account.',
              ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
            )
          );
        } else if (response.messages[0].code === 'WAG_I_FA_1061') {
          const message = response.messages[0].message;
          this.manager.getMembers(profId).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            response => {
              this.manager.loader = false;
              this.manager.loaderOverlay = false;
              const mem = response.members;
              this.manager.members = mem.filter(item => {
                const messages = item.messages;
                if (messages && messages[0].code === 'WAG_I_FA_1003') {
                  return false;
                }
                return true;
              });
             const pos =  message.indexOf('</strong> time(s)');
             let invitationCount = message.substring(pos - 1, pos);
             if (invitationCount > 1) {
              invitationCount = invitationCount + ' times.';
             } else {
              invitationCount = invitationCount + ' time.';
             }

              for (let i = 0; i < this.manager.members.length; i++) {
                if (this.manager.members[i].profileId === profId) {
                  this.openAccountInviteBox(this.manager.members[i], profId);
                  this._message.addMessage(
                    new Message(
                      'Your invitation has been sent. <br/><br/> <strong>' +
                        frstname +
                        ' ' +
                        lName +
                        // tslint:disable-next-line: max-line-length
                        '</strong> has received an invitation to join your Family Prescriptions Account. The invitation will expire 7 days from receipt. If there is no response, you may resend an invite on ' +
                        this.accountStatusCheckFor.invitationInfo
                          .resendInvitationDate +
                        ' ' +
                        this.accountStatusCheckFor.invitationInfo
                          .resendInvitationTime +
                        '. Invitations can be resent ' + invitationCount,
                      ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                      true
                    )
                  );
                } else {
                  this.openAccountInviteBox(this.manager.members[i]);
                }
              }
            },
            error => {
              this.manager.loader = false;
              this._message.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );
        } else if (response.messages[0].code === 'WAG_I_FA_1003') {
          this.manager.getMembers(profId).subscribe(
            // tslint:disable-next-line: no-shadowed-variable
            response => {
              this.manager.loader = false;
              this.manager.loaderOverlay = false;
              const mem = response.members;
              this.manager.members = mem.filter(item => {
                const messages = item.messages;
                if (messages && messages[0].code === 'WAG_I_FA_1003') {
                  return false;
                }
                return true;
              });
              for (let i = 0; i < this.manager.members.length; i++) {
                this.openAccountInviteBox(this.manager.members[i]);
              }
            },
            error => {
              this.manager.loader = false;
              this._message.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );
        } else {
          this._message.addMessage(
            new Message(
              response.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      }

      this.accountStatusCheckFor = undefined;
    };

    if (action === 'resend') {
      url = `/familymgmt/csrf-disabled/members/invitation/${inviteId}/resend`;

      this._http.putData(url, request_data).subscribe(
        response => {
          handleActionResponse('WAG_I_FA_1061', response);
        },

        error => {
          this.updateACModelState(false);
          this.accountStatusCheckFor = undefined;
        }
      );
    } else {
      //this.openAccountInviteBox(this.manager.members);
      url = `/familymgmt/csrf-disabled/members/invitation/${inviteId}/cancel`;

      this._http.deleteData(url).subscribe(
        response => {
          handleActionResponse('WAG_I_FA_1057', response, 'cancel');
        },

        error => {
          this.updateACModelState(false);
          this.accountStatusCheckFor = undefined;
        }
      );
    }
  }

  /**
   * check next resend date and time for resend invite button.
   *
   * @param {string} date
   * @param {string} time
   * @returns {boolean}
   */
  canResendInvite(date: string, time: string) {
    const nextDate = new Date(`${date} ${time}`);

    if (new Date() > nextDate) {
      return true;
    }

    return false;
  }

  redirectToLogin() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      ROUTES.family_management.absoluteRoute
    );
    this._common.navigate(ROUTES.login.absoluteRoute);
  }
}
