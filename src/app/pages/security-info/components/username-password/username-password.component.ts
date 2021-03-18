import { Component, OnInit } from "@angular/core";
import { UserService } from "@app/core/services/user.service";
import { MessageService } from "@app/core/services/message.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ARX_MESSAGES, ROUTES, Microservice } from "@app/config";
import { Message } from "@app/models";
import { CommonUtil } from "@app/core/services/common-util.service";
import { Router } from "@angular/router";
import { SecurityInfoService } from "@app/pages/security-info/securityinfo.service";
import { CoreConstants } from "@app/config";
import { HttpClientService } from "@app/core/services/http.service";
import { RegistrationService } from "@app/core/services/registration.service";
import { AppContext } from "@app/core/services/app-context.service";

@Component({
  selector: "arxrf-username-password",
  templateUrl: "./username-password.component.html",
  styleUrls: ["./username-password.component.scss"]
})
export class UsernamePasswordComponent implements OnInit {
  userDetailForm: FormGroup;
  loader = false;
  passwordType = "password";
  validEmail = true;
  validPassword = false;
  emailErrorMessage;
  passwordErrorMessage;

  routes = ROUTES;
  displayInfoBanner = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _http: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil,
    private _messageService: MessageService,
    private _router: Router,
    private _registrationService: RegistrationService,
    private _securityInfoService: SecurityInfoService,
    public appContext: AppContext
  ) {
    this.createForm();
  }

  ngOnInit() {
    //Commented for Login Rollback
    // const legacyUser = localStorage.getItem('isLegacyUser');
    // const validateLegacyUser = localStorage.getItem('validateLegacyUser');
    // if (legacyUser === 'true' || validateLegacyUser === 'true' ) {
    //   this.displayInfoBanner = true;
    // }
  }

  createForm() {
    this.userDetailForm = this._formBuilder.group({
      username: [
        "",
        [Validators.pattern(new RegExp(CoreConstants.PATTERN.EMAIL))]
      ],
      password: [""],
      showPassword: [false]
    });
  }

  checkEmail() {
    this._common.validateForm(this.userDetailForm);
    if(this.userDetailForm.value.username !== "" 
      && this.userDetailForm.controls.username.invalid
    ){
      this.emailErrorMessage= "Please enter a valid email address."
      if(this.userDetailForm.value.password !== "" ){
        this.checkPassword();
      } else {
        return;
      }
    } else {
      this.emailErrorMessage = '';
    }
  
    if (
      this.userDetailForm.value.password === "" &&
      this.userDetailForm.value.username === ""
    ) {
      this.emailErrorMessage = "";
      this.passwordErrorMessage = "";
      this._messageService.addMessage(
        new Message(
          "Please enter username or password to update.",
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
      return;
    }
    //istanbul ignore else
    if (this.userDetailForm.value.username !== '') {
      const data = {
        userName: this.userDetailForm.controls.username.value
      };
      this.loader = true;
      this._http
        .postData(this._registrationService.SERVICES.checkEmail, data)
        .subscribe(
          res => {
            this.loader = false;
            if (res.userNameExist !== undefined && !res.userNameExist) {
              this.validEmail = true;
              this.emailErrorMessage = '';
              if(this.userDetailForm.value.password !== ""){
                this.checkPassword();
              } else {
                this.saveChanges();
              }
            } else if (res.messages) {
              this.validEmail = false;
              if(res.messages &&
                res.messages[0].code === "WAG_W_REG_1009"
              ){
                this.emailErrorMessage = ARX_MESSAGES.ERROR.usernameExistError;
              } else {
                this.emailErrorMessage = res.messages[0].message;
              }
            } else {
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          },
          err => {
            this.oncheckMailError();
          }
        );
    } else {
      this.passwordErrorMessage= "";
      this.checkPassword()
    }
  }

  checkPassword() {
    if (this.userDetailForm.value.password !== '') {
      const url = CoreConstants.RESOURCE.checkPassword;
      const data = {
        userName: this._userService.user.profile.basicProfile.login,
        email: this._userService.user.profile.basicProfile.email,
        password: this.userDetailForm.controls.password.value
      };
      this.loader = true;
      this._http.postData(url, data).subscribe(
        res => {
          this.loader = false;
          if (res.messages[0].type === ARX_MESSAGES.MESSAGE_TYPE.WARN) {
            this.validPassword = false;
            this.passwordErrorMessage = res.messages[0].message;
          } else {
            this.passwordErrorMessage = null;
            this.validPassword = true;
            this.saveChanges();
          }
        },
        err => {
          this.oncheckMailError();
        }
      );
    } else {
      this.saveChanges();
    }
  }

  saveChanges() {
    this.loader = true;
    const userInfo = JSON.parse(localStorage.getItem('u_info'));

    const request_data = <any>{
      //profileId: this._userService.user.profile.profileId
      profileId: userInfo.profileId
    };
    let updateUsername = false;

    //istanbul ignore else
    if (this.userDetailForm.value.password !== "") {
      request_data.password = this.userDetailForm.value.password;
    }
    //  else {
    //   request_data.password = "********";
    // }

    //istanbul ignore else
    if (this.userDetailForm.value.username !== "") {
      request_data.userName = this.userDetailForm.value.username;
      request_data.email = this.userDetailForm.value.username;
      request_data.updateUserNameAsEmailInd = false;
      updateUsername = true;
    }

    request_data.source = "ECOM_SECURITY_SECTION";
    request_data.updateLoyaltyProfileInd = false;
    request_data.flow = "ARX";

    // let url = `/svc/profiles/${this._userService.user.id}/(SecurityInfo)`;

    this._http
      .putData(Microservice.security_info_update, request_data)
      .subscribe(
        response => {
          this.loader = false;
          //istanbul ignore else
          if (response.status === "success") {
            this._securityInfoService.verificationState = false;
            this._securityInfoService.changesSaved = true;

            if (updateUsername && this.userDetailForm.value.username !== "") {
              sessionStorage.setItem(
                AppContext.CONST.key_username_update_status,
                "true"
              );
              if (localStorage.getItem(AppContext.CONST.uInfoStorageKey)) {
                let updateUserLocal = JSON.parse(
                  localStorage.getItem(AppContext.CONST.uInfoStorageKey)
                );
                updateUserLocal.userName = this.userDetailForm.value.username;
                updateUserLocal = JSON.stringify(updateUserLocal);
                localStorage.setItem(
                  AppContext.CONST.uInfoStorageKey,
                  updateUserLocal
                );
              }
              this._common.navigate(ROUTES.securityIformation.absoluteRoute);
            } else {
              this._router.navigateByUrl(
                ROUTES.securityIformation.absoluteRoute
              );
            }
          } else if (response.status === "fail") {
            if (response.messages && response.messages[0].message) {
              this._messageService.addMessage(
                new Message(
                  response.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            } else {
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          } else if (
            response.messages &&
            response.messages[0].code === "WAG_W_ACC_PREF_1015"
          ) {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.usernameExistError,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.service_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        error => {
          this.oncheckMailError();
        }
      );
  }

  displayPassword(event) {
    if (event.target.checked) {
      this.passwordType = "text";
    } else {
      this.passwordType = "password";
    }
  }

  oncheckMailError() {
    this.loader = false;
    this._messageService.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }
}
