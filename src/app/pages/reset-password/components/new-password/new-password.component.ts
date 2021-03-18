import { OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';

import { CoreConstants } from '@app/config/core.constant';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ResetPasswordService } from '@app/pages/reset-password/services/reset-password.service';
import { ROUTES } from '@app/config';
import { UserService } from '@app/core/services/user.service';
import { e } from '@angular/core/src/render3';

@Component({
  selector: 'arxrf-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['new-password.component.scss']
})
export class NewPasswordComponent implements OnInit {
  newPasswordForm: FormGroup;
  inputType = 'password';
  passwordCheckMessage: string;
  successCode = 'WAG_E_PROFILE_2020';
  showLoader = false;
  overlayLoader = false;
  saveButtonHighlights = true;
  passCodevalue = '';

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private _httpClient: HttpClientService,
    private _common: CommonUtil,
    private passwordService: ResetPasswordService,
    private appContext: AppContext,
    private _userService: UserService,
    private _commonUtilSerive: CommonUtil
  ) {
    this.newPasswordForm = this._formBuilder.group({
      password: ['', Validators.required]
    });
  }

  checkboxFlag(event) {
    if (event.target.checked === true) {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  saveNewPassword() {
    this._messageService.clear();
    this._commonUtilSerive.validateForm(this.newPasswordForm);
    if (this.newPasswordForm.invalid) {
      return;
    }
    this.showLoader = true;
    this.overlayLoader = true;
    const refId = localStorage.getItem('refId');
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');
    const data = {
      password: this.newPasswordForm.value.password,
      refId: refId
    };
    const promise = this._httpClient.doPostLogin(
      CoreConstants.RESOURCE.saveNewPassword,
      data,
      getDeviceInfo
    );
    promise.then(res => {
      this.showLoader = false;
      this.overlayLoader = false;
      if (res.ok) {
        const body = res.json();
        // tslint:disable-next-line: no-shadowed-variable
        const passwordSuccessHandler = body => {
          // tslint:disable-next-line: no-shadowed-variable
          const data = {};

          // removing refid from locastorage once reset password is successfull. (ARXDIGITAL-8302)
          localStorage.removeItem('refId'); 
          
          const profileIdOnPassSuccess = body.profileId;
          if (this.passwordService.authOptionClicked !== 'email') {
            const loginData = {
              login: this.passwordService.username,
              password: this.newPasswordForm.value.password
            };
            this._httpClient
              .postData(CoreConstants.RESOURCE.login, loginData)
              .subscribe(
                response => {
                  if (
                    response.messages !== undefined &&
                    response.messages[0].code === 'WAG_E_PROFILE_2020'
                  ) {
                    // this._userService.initUser(profileIdOnPassSuccess, false, this.appContext.loginPostSuccess);
                    this._userService.initUser1(profileIdOnPassSuccess, false);
                  } else {
                    this._common.navigate(ROUTES.login.absoluteRoute);
                  }
                },
                error => {
                  this._common.navigate(ROUTES.login.absoluteRoute);
                }
              );
          } else {
            data['username'] = this.passwordService.username;
            if (body.messages === undefined) {
              data['message'] = 'Your password is changed successfully.';
            } else {
              data['message'] = body.messages[0].message;
            }

            sessionStorage.setItem(
              AppContext.CONST.resetContentKey,
              JSON.stringify(data)
            );
            this._common.navigate(ROUTES.login.absoluteRoute);
          }
        };

        if (
          body.messages !== undefined &&
          body.messages[0].code === this.successCode
        ) {
          // passwordSuccessHandler( body );

          // removing refid from locastorage once reset password is successfull. (ARXDIGITAL-8302)
          localStorage.removeItem('refId');  
          
          data['message'] = body.messages[0].message;
          sessionStorage.setItem(
            AppContext.CONST.resetContentKey,
            JSON.stringify(data)
          );
          this._common.navigate(ROUTES.login.absoluteRoute);
        } else if (
          body.messages !== undefined &&
          body.messages[0].code !== this.successCode
        ) {
          this._messageService.addMessage(
            new Message(
              body.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              true
            )
          );
        } else {
          passwordSuccessHandler(body);
        }
      }
    });
    promise.catch(err => {
      this.showLoader = false;
      this.overlayLoader = false;
      this._messageService.addMessage(
        new Message(
          ARX_MESSAGES.ERROR.service_failed,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
    });
  }

  // This method will be called on password field blur.
  // This will send a request with required data to check password service.
  checkPassword(event) {
    this.showLoader = true;
    this.saveButtonHighlights = true;
    if (this.newPasswordForm.value.password !== '') {
      const data = {
        firstName: '',
        lastName: '',
        email: '',
        password: this.newPasswordForm.value.password
      };

      const promise = this._httpClient.doPost(
        CoreConstants.RESOURCE.checkPassword,
        data
      );

      // For valid response checkiing the response message and updating password check message.
      promise.then(res => {
        this.showLoader = false;
        if (res.ok) {
          const body = res.json();
          if (body.messages !== undefined) {
            if (body.messages[0].type === ARX_MESSAGES.MESSAGE_TYPE.WARN) {
              this.passwordCheckMessage = body.messages[0].message;
              this.saveButtonHighlights = true;
            } else {
              this.passwordCheckMessage = '';
              this.saveButtonHighlights = false;
            }
          }
        }
      });

      promise.catch(err => {
        this.showLoader = false;
        console.error(err);
      });
    }
  }
  checkPasswordCheck(event: any) {
    this.passCodevalue = event.target.value;

    if (this.passCodevalue.length < 8) {
      this.saveButtonHighlights = true;
      this.passwordCheckMessage =
        'Pasword does not meet requirements. Please try again.';
      return false;
    }

    this.saveButtonHighlights = true;
    if (this.newPasswordForm.value.password !== '') {
      const data = {
        firstName: '',
        lastName: '',
        email: '',
        password: this.newPasswordForm.value.password
      };

      const promise = this._httpClient.doPost(
        CoreConstants.RESOURCE.checkPassword,
        data
      );

      // For valid response checkiing the response message and updating password check message.
      promise.then(res => {
        this.showLoader = false;
        if (res.ok) {
          const body = res.json();
          if (body.messages !== undefined) {
            if (body.messages[0].type === ARX_MESSAGES.MESSAGE_TYPE.WARN) {
              this.passwordCheckMessage =
                'Pasword does not meet requirements. Please try again.';
              this.saveButtonHighlights = true;
            } else {
              this.passwordCheckMessage = '';
              this.saveButtonHighlights = false;
            }
          }
        }
      });
      promise.catch(err => {
        this.showLoader = false;
      });
    }
  }

  ngOnInit() {
    localStorage.removeItem('phoneLastfourDigits');
  }
}
