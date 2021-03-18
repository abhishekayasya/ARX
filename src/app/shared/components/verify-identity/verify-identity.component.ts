import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "@app/core/services/http.service";
import { CoreConstants, Microservice } from "@app/config";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models/message.model";
import { ARX_MESSAGES } from "@app/config/messages.constant";
import { AppContext } from "@app/core/services/app-context.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ROUTES } from "@app/config";
import { Routes, Params } from "@angular/router";
import { window } from "rxjs/operator/window";
import { ActivatedRoute } from "@angular/router";
import { first, timeout } from "rxjs/operators";

@Component({
  selector: "arxrf-verify-identity",
  templateUrl: "./verify-identity.component.html",
  styleUrls: ["./verify-identity.component.scss"]
})
export class VerifyIdentityComponent implements OnInit {
  @Output() next = new EventEmitter();

  method = null;
  showLoader = false;
  username;
  userPhone;
  securityQuestion;
  securityAnswer;
  securityQuestionCode: string;
  codeEntered;
  otpMethod;
  first_attempt;
  second_attempt;
  wrongSecurityAnswer = false;
  wrongCodeEntered = false;
  wrongCodeEnteredMessage;
  codeMessage: string = CoreConstants.RESETPASSWORD.codeMessage;
  emailResponseMessage = "";
  phoneResponseMessage = "";
  codeMessageText = "";
  disableSubmit = true;
  disableSendCode = false;
  emailMessageText = false;
  phoneMessageText = false;
  emailMessageSuccess: string = CoreConstants.RESETPASSWORD.emailMessageSuccess;
  phoneMessageSuccess: string = CoreConstants.RESETPASSWORD.phoneMessageSuccess;
  emailMessage: string = CoreConstants.RESETPASSWORD.emailMessage;
  phoneMessage: string = CoreConstants.RESETPASSWORD.phoneMessage;
  responseMessage: string = CoreConstants.RESETPASSWORD.responseMessage;

  phoneSuccessCode = "WAG_I_PROFILE_2067";
  emailSuccessCode = "WAG_I_PROFILE_2025";
  successCode = "WAG_I_CREDENTIALS_1012";
  AUTH_SUCCESS_CODE = "WAG_I_PROFILE_2004";

  securityInfoUpdateType = undefined;

  constructor(
    private _userService: UserService,
    private _http: HttpClientService,
    private _httpService: HttpClientService,
    private _messageService: MessageService,
    private _appContext: AppContext,
    private common: CommonUtil,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.securityInfoUpdateType = params.type;
    });
    if(localStorage.getItem("refId_called_for_sendcode") === "true") {
      localStorage.removeItem("refId");
      localStorage.removeItem("refId_called_for_sendcode");
    }
  }

  ngOnInit() {
    this.getSecurityQuestions();
    this.getSecurityQuestionCode();
    this.getUserInfo();
    this.activatedRoute.queryParams.subscribe(params => {
      this.securityInfoUpdateType = params.type;
    });

    if (this.codeMessage === this.emailMessageSuccess) {
      this.codeMessageText = this.emailMessage;
      this.emailMessageText = true;
      this.emailResponseMessage = this.responseMessage;
    }

    if (this.codeMessage === this.phoneMessageSuccess) {
      this.codeMessageText = this.phoneMessage;
      this.phoneMessageText = true;
      this.phoneResponseMessage = this.responseMessage;
    }
    const refId = localStorage.getItem("refId");

    if(!refId) {
      this._httpService
      .postAuthData(Microservice.profile_UserInfo, {
        flow: 'ARX'
      }).subscribe(
        data => {
          if(data.refId) {
            localStorage.setItem("refId", data.refId);
            localStorage.setItem("refId_called_for_sendcode", "true");
          }
        },
        error => {
          this._appContext.showGatewayError.next(true);
          localStorage.removeItem("refId_called_for_sendcode");
        }
      )
    }
  }

  changeMethod(evt) {
    if(evt.target.value ==="question"){
      this.disableSendCode = false;
    }
    this.method = evt.target.value;
  }

  getUserInfo() {
    const url = Microservice.profile_UserInfo;
    const refIdval = localStorage.getItem('refId');
    if (!refIdval) {
      this._http
        .postAuthData(Microservice.userInfo, {
          isTNCRequired: false,
          extSystemIds: false
        })
        .subscribe(
          res => {
            this.showLoader = false;
            this._userService.selectedSecurityQuestion =
              res.basicProfile.securityQuestion;
            this._userService.selectedSecurityQuestion =
              res.basicProfile.securityQuestion;
            this.getSecurityQuestions();
          },
          err => {
            this.showLoader = false;
            this._messageService.addMessage(
              new Message(
                'Error while fetching security question. Please try again after some time',
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        );
    } else {
      const requestdata = { refId: refIdval, flow: 'ARX' };
      this._http.postData(url, requestdata).subscribe(
        res => {
          if (res.securityQuestions) {
            this._userService.selectedSecurityQuestion =
              res.securityQuestions[0].question;
            this.getSecurityQuestions();
          } else if (res.messages[0].code === 'WAG_I_PROFILE_2070') {
            this._messageService.addMessage(
              new Message(
                res.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        error => {
          this.getSecurityQuestions();
        }
      );
    }
  }

  getSecurityQuestionCode() {
    const url = '/register/common/SecurityQuestions';
    this._http.getData(url).subscribe(
      response => {
        this.showLoader = false;
        //istanbul ignore else
        if (this._userService.selectedSecurityQuestion !== undefined) {
          //istanbul ignore else
          if (response !== undefined && response !== null) {
            response.securityQuestions.forEach(element => {
              if (
                element.question.toLowerCase() ===
                this._userService.selectedSecurityQuestion.toLowerCase()
              ) {
                this._userService.selectedSecuritQuestionCode = element.code;
              }
            });
          }
        }
      },
      err => {
        this.ongetSecurityQuestionsError(err);
      }
    );
  }

  getSecurityQuestions() {
    const url = Microservice.profile_UserInfo;
    const refIdval = localStorage.getItem("refId");
    if (refIdval === undefined || refIdval === null) {
      this._http
        .postAuthData(Microservice.userInfo, {
          isTNCRequired: false,
          extSystemIds: false
        })
        .subscribe(
          res => {
            this.showLoader = false;
            this.username = res.basicProfile.email;
            this.userPhone = res.basicProfile.phone[0].number;
            this.securityQuestion = res.basicProfile.securityQuestion;
            this._userService.selectedSecurityQuestion =
              res.basicProfile.securityQuestion;
            this.getSecurityQuestionCode();
          },
          err => {
            this.ongetSecurityQuestionsError(err);
          }
        );
    } else {
      this._http.postData(url, { refId: refIdval }).subscribe(
        res => {
          this.showLoader = false;
          this.username = res.email;
          this.userPhone = res.phone[0].number;
          this.securityQuestion = res.securityQuestions[0];
          this._userService.selectedSecurityQuestion =
            res.securityQuestions[0].question;
        },
        err => {
          this.ongetSecurityQuestionsError(err);
        }
      );
    }
  }

  sendCode() {
    this.disableSubmit = false;
    let totalCodeAttempts = localStorage.getItem("codesRequested");
    if(!totalCodeAttempts){
      localStorage.setItem("codesRequested", "0");
    } else {
      const newVal = +totalCodeAttempts + 1;
      localStorage.setItem("codesRequested", newVal.toString());
      if(newVal > 4){
        this.disableSendCode = true;
      }
    }
    const url = Microservice.authenticate_sendcode;
    const refIdVal = localStorage.getItem("refId");
    if (!refIdVal && this.username) {
      let data = {};
      if (this.otpMethod === "email") {
        data = {
          type: "email",
          username: this._userService.user.profile.basicProfile.login,
          flow: "ARX"
        };
      } else {
        const phoneNumber = this._userService.user.phoneNumber;
        const lastFourDigit = this.getLastFourNumber(phoneNumber);
        data = {
          type: "phone",
          username: this._userService.user.profile.basicProfile.login,
          code: lastFourDigit,
          flow: "ARX"
        };
      }
      this._http
        .doPost(CoreConstants.RESOURCE.sendCode, data)
        .then(res => {
          this.showLoader = false;
          if (res.ok) {
            const body = res.json();
            if (body.messages !== undefined) {
              if (
                body.messages[0].code === this.phoneSuccessCode ||
                body.messages[0].code === this.emailSuccessCode
              ) {
                CoreConstants.RESETPASSWORD.codeMessage = this.codeMessage;
                let currentStr = body.messages[0].message.substring(11);
                currentStr = this.htmlToPlaintext(currentStr);
                this.emailResponseMessage = currentStr;
                this.phoneResponseMessage = currentStr;
                this._messageService.addMessage(
                  new Message(
                    body.messages[0].message,
                    ARX_MESSAGES.MESSAGE_TYPE.INFO
                  )
                );
              } else {
                this._messageService.addMessage(
                  new Message(
                    body.messages[0].message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              }
            }
            if (body.refId) {
              localStorage.setItem("refId", body.refId);
            }
          }
        })
        .catch(err => {
          this.disableSendCode = false;
          this.showLoader = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          console.error(err);
        });
    } else {
      const data = {
        to: `${this.otpMethod}`,
        refId: `${localStorage.getItem("refId")}`
      };
      if (this.otpMethod === "phone") {
        data["priority"] = "0";
      }
      
      this.showLoader = true;
      this._http.postData(url, data).subscribe(
        res => {
          this.showLoader = false;
          if (
            res.messages !== undefined &&
            res.messages[0].code === "WAG_I_LOGIN_1009"
          ) {
            this._messageService.addMessage(
              new Message(res.messages[0].message, res.messages[0].type)
            );
            if (this.first_attempt) {
              this.second_attempt = true;
            } else {
              this.first_attempt = true;
            }
          } else {
            this._messageService.addMessage(
              new Message(res.messages[0].message, res.messages[0].type)
            );
          }
        },
        err => {
          this.onsubmitCodeError(err);
        }
      );
    }
  }

  submitCode() {
    this.wrongCodeEnteredMessage = ""
    this.wrongCodeEntered = false;
    if (
      this._userService.user !== undefined &&
      this._userService.user.loggedIn === "true" &&
      this._userService.user.isRxAuthenticatedUser
    ) {
      this.showLoader = true;
      const refId = localStorage.getItem("refId");
      const getDeviceInfo = sessionStorage.getItem('deviceinfo');
      
      const isRefIdAvailableBefore = localStorage.getItem('refId_called_for_sendcode') === 'true';
      let requestFor = '';
      let data = null;
      if (isRefIdAvailableBefore) {
        requestFor = CoreConstants.RESOURCE.authenticateCode
        data = { 
          flow: 'ARX',
          code: this.codeEntered, 
          refId: refId,
          type: "Pin"
        };
      } else {
        data = { pincode: this.codeEntered, refId: refId };
        requestFor = CoreConstants.RESOURCE.submitCode
      }
      const promise = this._http.doPost(
        requestFor,
        data,
        getDeviceInfo
      );

      promise.then(res => {
        this.showLoader = false;
        if (res.ok) {
          const body = res.json();
          if (body.messages !== undefined) {
            if (body.messages[0].code === this.successCode || body.messages[0].code === this.AUTH_SUCCESS_CODE) {
              localStorage.setItem(AppContext.CONST.isUserVerified, "true");
              this.next.emit();
              if (body.messages[0].code === "WAG_I_LOGIN_1011") {
                localStorage.setItem(AppContext.CONST.isUserVerified, "true");
                this.next.emit();
              } else if (body.messages[0].code === this.AUTH_SUCCESS_CODE) {
                localStorage.setItem(AppContext.CONST.isUserVerified, "true");
              } else {
                this.wrongCodeEntered = true;
                this.wrongCodeEnteredMessage = body.messages[0].message;
              }
            } else {
              if (body.messages[0].code === 'WAG_E_PROFILE_2021' && body.messages[0].message.indexOf("ref") === -1){
                const message = "Please enter a valid code. " + body.messages[0].message.slice(44)
                this.wrongCodeEnteredMessage = message
                this.wrongCodeEntered = true;
              } else {
                this._messageService.addMessage(
                  new Message(
                    body.messages[0].message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              }
            }
          } else if (body.status === "success") {
            localStorage.setItem("refId", body.refId);
            localStorage.setItem(AppContext.CONST.isUserVerified, "true");
            this.next.emit();
          } else {
            this._messageService.addMessage(
              new Message(body.messages[0].message, body.messages[0].type)
            );
          }
          if (body.refId !== undefined) {
            localStorage.setItem("refId", body.refId);
          }
        }
      });
      promise.catch(err => {
        this.showLoader = false;
        const error = JSON.parse(err._body);
        if(error.messages[0].code === "WAG_PROFILE_F_1001" && error.messages[0].message.indexOf("ref") === -1){
          this.wrongCodeEnteredMessage = "Please enter a valid code. The verification code must be 6 digits."
          this.wrongCodeEntered = true;
        } else {
          this._messageService.addMessage(
            new Message(
              error.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
        console.error(err);
      });
    } else {
      const url = CoreConstants.RESOURCE.authenticateCode;
      const refId = localStorage.getItem("refId");
      const data = {
        code: this.codeEntered,
        type: "Pin",
        refId: refId
      };
      this.showLoader = true;
      this._http.postAuthData(url, data).subscribe(
        res => {
          this.showLoader = false;
          if (res.messages !== undefined) {
            if (res.messages[0].code === "WAG_I_LOGIN_1011") {
              localStorage.setItem(AppContext.CONST.isUserVerified, "true");
            } else if (res.messages[0].code === "WAG_I_PROFILE_2004") {
              localStorage.setItem(AppContext.CONST.isUserVerified, "true");
              // this.next.emit();
              if (this.securityInfoUpdateType === "userinfo") {
                this.next.emit();
              } else {
                this._userService.initUser1("76756756744", false);
              }
            } else {
              this.wrongCodeEntered = true;
              this.wrongCodeEnteredMessage = res.messages[0].message;
            }
          } else {
            this._messageService.addMessage(
              new Message(res.messages[0].message, res.messages[0].type)
            );
          }
        },
        err => {
          this.onsubmitCodeError(err);
        }
      );
    }
  }
      
  submitAnswer() {
    const url = CoreConstants.RESOURCE.authenticateCode;
    const refId = localStorage.getItem('refId');
    let qcode = this.securityQuestion.qcode;
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');

    // istanbul ignore else
    if (qcode === undefined || qcode == null) {
      qcode = this._userService.selectedSecuritQuestionCode;
    }

    const data = {
      type: 'SecurityAnswer',
      qcode: qcode,
      code: this.securityAnswer
    };
  
    this.showLoader = true;
    const promise = this._http.doPostLogin(url, data, getDeviceInfo);
    promise
      .then(res => {
        const body = res.json();
        this.showLoader = false;
        if (body.messages[0].code === 'WAG_I_LOGIN_1011') {
          localStorage.setItem(AppContext.CONST.isUserVerified, 'true');
        } else if (body.messages[0].code === 'WAG_I_PROFILE_2004') {
          localStorage.setItem(AppContext.CONST.isUserVerified, 'true');
          // istanbul ignore else
          if (this.securityInfoUpdateType === 'userinfo') { // extra condition to find checkForRefillReminderRoute
            this.next.emit();
          } else if (this.securityInfoUpdateType === undefined ) { // extra condition to find checkForRefillReminderRoute
            this._userService.initUser1(
              '76756756744',
              false,
              this.securityInfoUpdateType
            );
          } else if (
            this.securityInfoUpdateType === 'securityquestion' ||
            this.securityInfoUpdateType !== undefined) { // extra condition to find checkForRefillReminderRoute
            this._userService.initUser1(
              '76756756744',
              false,
              ROUTES.securityIformation.absoluteRoute
            );
          } else {
            if (
              sessionStorage.getItem(AppContext.CONST.login_callback_urlkey)
            ) {
              const route = sessionStorage.getItem(
                AppContext.CONST.login_callback_urlkey
              );
              this._userService.initUser1('76756756744', false, route, true);
            } else {
              this._userService.initUser1('76756756744', false);
            }
          }
        } else {
          this._messageService.addMessage(
            new Message(body.messages[0].message, body.messages[0].type)
          );
        }
      })
      .catch(err => {
        const error = JSON.parse(err._body);
        this.showLoader = false;
        if (error.messages[0].code === 'WAG_E_PROFILE_2039') {
          this._messageService.addMessage(
            new Message(
              // tslint:disable-next-line: max-line-length
              'Because we were unable to verify your identity, your account has been temporarily locked for security purposes. <br /> To re-access your account, please call 877-250-5823.',
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              true
            )
          );
          this.common.navigate(ROUTES.logout.absoluteRoute);
        } else {
          this._messageService.addMessage(
            new Message(
              error.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      });
  }

  omit_special_char(event) {
    const charCode = event.charCode;
    return (
      charCode === 0 ||
      charCode === 8 ||
      charCode === 32 ||
      (charCode >= 47 && charCode <= 57)
    );
  }

  getLastFourNumber(phoneNumber) {
    if (phoneNumber !== undefined && phoneNumber !== null) {
      return phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length);
    }

    return "";
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, "") : "";
  }

  ongetSecurityQuestionsError(err) {
    console.error("Error fetching security questions", err)
    this.showLoader = false;
    this._messageService.addMessage(
      new Message(
        "Error while fetching security question. Please try again after some time",
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  onsubmitCodeError(err) {
    console.log("Error submitting security code response", err)
    this.showLoader = false;
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
}
