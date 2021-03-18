import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Message } from '@app/models';
import { ARX_MESSAGES, ROUTES, STATE_US } from '@app/config';
import { MessageService } from '@app/core/services/message.service';
import { FmService } from '@app/core/services/fm.service';
import { UserService } from '@app/core/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-fm-manageaccess',
  templateUrl: './manage-access.component.html',
  styleUrls: ['./manage-access.component.scss']
})
export class ManageAccessComponent implements AfterViewInit, OnInit {
  enableRemoveAccessConfirm: boolean;

  adminToRemove: any;

  personalInfoForm: FormGroup;
  additionalInfoForm: FormGroup;

  additionalState: boolean;

  ROUTES = ROUTES;

  STATE_US = STATE_US;

  PHONE_TYPES = ['Cell', 'Home', 'Work'];

  state_noMember: boolean;
  guestFormState = false;

  constructor(
    public manager: FmService,
    private _message: MessageService,
    public userService: UserService,
    private _formBuilder: FormBuilder,
    private _http: HttpClientService,
    private _common: CommonUtil,
    private appContext: AppContext
  ) {
    this.initPersonalInfoForm();
    this.initAdditionalInfoForm();
  }

  ngAfterViewInit(): void {}

  /**
   * Action to handle click on turn of access button for an admin
   *
   * @param {string} id
   */
  turnOffAccess() {
    let id;
    if (this.adminToRemove) {
      id = this.adminToRemove.id;

      this.manager.enableLoad(true);
      this.manager.removeAccess(id).subscribe(
        response => {
          this.manager.disableLoad();
          const messages = response.messages;
          if (messages && messages.length > 0) {
            messages.forEach(item => {
              if (item.code === 'WAG_I_FA_1059') {
                // success
                this._message.addMessage(
                  new Message(item.message, ARX_MESSAGES.MESSAGE_TYPE.SUCCESS)
                );

                // removing admin from lcaol admins list
                // tslint:disable-next-line: no-shadowed-variable
                this.manager.admins = this.manager.admins.filter(item => {
                  return item.id !== id;
                });
              } else if (item.code === 'WAG_I_FA_1063') {
                this.state_noMember = true;
              } else {
                this._message.addMessage(
                  new Message(item.message, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
                );
              }
            });
          }
          this.adminToRemove = undefined;
        },

        error => {
          this.manager.disableLoad();
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          this.adminToRemove = undefined;
        }
      );
    }
  }

  ngOnInit(): void {
    this.manager.enableLoad();

    const fetchAdminsForLogin = () => {
      this.manager
        .getAdminAccounts(localStorage.getItem(AppContext.CONST.uidStorageKey))
        .subscribe(
          response => {
            this.manager.disableLoad();

            if (response.messages) {
              this._message.addMessage(
                new Message(
                  response.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            } else {
              this.manager.admins = response.adminProfiles;
            }
          },
          error => {
            this.onError();
          }
        );
    };

    if (this.manager.loggedIn === undefined) {
      this.userService.getProfileInd().subscribe(
        response => {
          if (response.auth_ind === 'Y') {
            this.manager.loggedIn = true;
            fetchAdminsForLogin();
          } else {
            this.manager.loggedIn = false;
            this.manager.disableLoad();
            this.guestFormState = true;
          }

          if (sessionStorage.getItem('fmInvMsg') != null) {
            this._message.addMessage(
              new Message(
                sessionStorage.getItem('fmInvMsg'),
                ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                true
              )
            );
            sessionStorage.removeItem('fmInvMsg');
          }
        },

        error => {
          this.manager.disableLoad();
        }
      );
    } else if (this.manager.loggedIn === true) {
      fetchAdminsForLogin();
    } else {
      this.manager.disableLoad();
      this.guestFormState = true;
    }
  }

  initPersonalInfoForm() {
    const dateConfig = new DateConfigModel();
    dateConfig.isDob = true;

    this.personalInfoForm = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, ValidateDate(dateConfig)]],
      number: ['', Validators.required],
      phoneType: ['Cell', Validators.required]
    });
  }

  initAdditionalInfoForm() {
    this.additionalInfoForm = this._formBuilder.group({
      gender: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      street1: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
      aptSuite: ['']
    });
  }

  enableRemoveConfirm(id) {
    this.adminToRemove = this.manager.admins.find(item => item.id === id);
    this.enableRemoveAccessConfirm = true;
  }

  updateAccessConfirmState(event) {
    this.enableRemoveAccessConfirm = event;
  }

  continueToRemove() {
    this.turnOffAccess();
    this.updateAccessConfirmState(false);
  }

  prefillAddressComponents(data) {
    this.additionalInfoForm.patchValue(data);
  }

  searchForAdmin() {
    const url = '/familymgmt/csrf-disabled/members/search';
    const request_data = this.personalInfoForm.value;

    if (this.personalInfoForm.invalid) {
      this._common.validateForm(this.personalInfoForm);
      return;
    }

    if (this.additionalState) {
      if (this.additionalInfoForm.invalid) {
        this._common.validateForm(this.additionalInfoForm);
        return;
      }
      request_data.address = this.additionalInfoForm.value;
      request_data.gender = request_data.address.gender;
      delete request_data.address.gender;
    }
    this.manager.enableLoad(true);
    this._http.postData(url, request_data).subscribe(
      response => {
        this.manager.disableLoad();
        if (response.messages) {
          if (
            response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1001' &&
            !this.additionalState
          ) {
            this.additionalState = true;
          } else if (
            (response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1001' ||
              response.messages[0].code === 'WAG_E_SEARCH_MEMBER_1006') &&
            this.additionalState
          ) {
            this._message.addMessage(
              new Message(
                'We\'re unable to find an account based on the information you entered. Please Contact customer Service for assistance.',
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else if (response.messages[0].code === 'WAG_I_SEARCH_MEMBER_1007') {
            // in case match found for admin.
            this.manager.enableLoad(true);
            this.prepareAdminAccountsForGuest();
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
        this.onError();
      }
    );
  }

  prepareAdminAccountsForGuest() {
    this.guestFormState = false;
    this.manager.admins = [];
    // removing all values from form fields.
    this.personalInfoForm.reset();
    this.additionalInfoForm.reset();
    this.initPersonalInfoForm();
    this.initAdditionalInfoForm();

    this.manager.getAdminAccounts('0').subscribe(
      response => {
        this.manager.disableLoad();

        if (response.messages) {
          if (response.messages[0].code === 'WAG_I_FA_1063') {
            this.state_noMember = true;
          } else {
            this._message.addMessage(
              new Message(
                response.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        } else {
          this.manager.admins = response.adminProfiles;
        }
      },

      error => {
        this.onError();
      }
    );
  }

  redirectToLogin() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      ROUTES.family_management.children.manage_access.absoluteRoute
    );
    this._common.navigate(ROUTES.login.absoluteRoute);
  }

  onError() {
    this.manager.disableLoad();
    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }
}
