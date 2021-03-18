import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreConstants, Microservice, ROUTES } from '@app/config';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { AppContext } from '@app/core/services/app-context.service';
import { GaService } from '@app/core/services/ga-service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { Message } from '@app/models/message.model';
import { CommonUtil } from 'app/core/services/common-util.service';

@Component({
  selector: 'arxrf-2fa-identity',
  templateUrl: './2fa-verify-identity.component.html',
  styleUrls: ['./2fa-verify-identity.component.scss']
})
export class TwoFaVerifyIdentityComponent implements OnInit {
  @Output() next = new EventEmitter();

  type: string;
  authOptionClicked = '';
  disableSubmitbtn = true;
  disableSendbtn = false;
  selectVOption = true;
  displaySendCode = false;

  method = null;
  showLoader = false;
  loader = false;
  username;
  userPhone;
  securityQuestion;
  securityAnswer;
  securityQuestionCode: string;
  codeEntered;
  first_attempt;
  second_attempt;
  codeMessage: string = CoreConstants.RESETPASSWORD.codeMessage;
  emailResponseMessage = '';
  phoneResponseMessage = '';
  wrongSecurityAnswer = false;
  wrongCodeEntered = false;
  wrongCodeEnteredMessage;
  codeMessageText = 'Incorrect code. Please try again.';
  selectedContact: any;
  codeSubmitBtn = true;
  loaderMessage = '';
  loaderOverlay = false;
  accountLock = true;
  reqNewCode = true;
  errorStateGAtagging = false;
  securityQuestionValidate: boolean;
  displayErrorState = false;
  remainingCodeAttempts = 5;
  priorityVal = "0";

  Err_MESSAGE = {
    NewCode: 'A new verification code has been sent.',
    Account_lock:
      // tslint:disable-next-line: max-line-length
      'You\'ve exceeded the maximum number of attempts.'
  };
  isLiteUser = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _common: CommonUtil,
    private _userService: UserService,
    private _http: HttpClientService,
    private _messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    private _gaService: GaService
  ) {
    this._route.queryParams.subscribe(map => {
      this.type = map.type;
    });
  }

  ngOnInit() {
    const path = window.location.href;
    if (path.indexOf('code_sent') !== -1) {
      this.selectedContact = localStorage.getItem('selectedContact');
      localStorage.removeItem('selectedContact');
      this.priorityVal = localStorage.getItem('priorityVal');
      localStorage.removeItem('priorityVal');
      this.sendCode(false);
    } else if (path.indexOf('securityquestion') !== -1) {
      this.selectedContact = 'Security';
      this.disableSubmitbtn = false;
    }
    this.getSecurityQuestions();
    this._common.addNaturalBGColor();
  }

  showRetryCount() {
    if (this.selectedContact === 'email') {
      return ` A code has been sent to ${
        this.username
      }. Please allow two minutes for your code to arrive.
        If necessary, you can request ${
          this.remainingCodeAttempts === 1 
          ? 'one more code.'
          : `up to ${this.remainingCodeAttempts} more codes.`
     }`;
    } else if (this.selectedContact === null) {
      this._common.navigate(
        ROUTES.securityIformation.children.two_fa.absoluteRoute
      );
    } else if (this.selectedContact === '2039') {
        return 'Please allow two minutes for your code to arrive.';
    } else {
      // tslint:disable-next-line: max-line-length
      let numberToShow;
      for (let i = 0; i < this.userPhone.length; i++){
        if(this.userPhone[i].type === this.selectedContact){
          numberToShow =  this.userPhone[i].number;
        }
      }
      return `We sent a code to your phone number ending in ${
        numberToShow
      }. Please allow two minutes for your code to arrive. 
         If necessary, you can request ${
         this.remainingCodeAttempts === 1 
         ? 'one more code.'
         : `up to ${this.remainingCodeAttempts} more codes.`
      }`;
    }
  }

  getSecurityQuestions() {
    const url = Microservice.profile_UserInfo;
    this.loader = true;
    const refIdval = localStorage.getItem('refId');
    if (refIdval === undefined || refIdval === null) {
      this._http
        .postAuthData(Microservice.userInfo, {
          isTNCRequired: false,
          extSystemIds: false
        })
        .subscribe(
          res => {
            this.loader = false;
            this.username = res.basicProfile.email;
            this.userPhone = res.basicProfile.phone;
            this.securityQuestion = res.basicProfile.securityQuestion;
            this._userService.selectedSecurityQuestion =
              res.basicProfile.securityQuestion;
            this.getSecurityQuestionCode();
          },
          err => {
            this.ongetSecurityQuestionsError();
          }
        );
    } else {
      this._http.postData(url, { refId: refIdval }).subscribe(
        res => {
          //istanbul ignore else
          if (res.email) {
            this.loader = false;
            this.username = res.email;
            this.userPhone = res.phone;
            if (res.securityQuestions[0] === undefined) {
              this.securityQuestionValidate = false;
            } else {
              this.securityQuestionValidate = true;
            }
            this.securityQuestion = res.securityQuestions[0];
            if (this.securityQuestion == undefined) {
              this.isLiteUser = true;
              this.updateVOption('email');
            }
            this._userService.selectedSecurityQuestion =
              res.securityQuestions[0].question;
          } else {
            this._messageService.addMessage(
              new Message(
                res.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        err => {
          this.ongetSecurityQuestionsError();
        }
      );
    }
  }

  getSecurityQuestionCode() {
    this.loader = true;
    const url = '/register/common/SecurityQuestions';
    this._http.getData(url).subscribe(response => {
      this.loader = false;
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
    });
  }

  updateVOption(type) {
    if (type === 'email') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.EMAIL_OPT_CLICK
      });
    } else if (type === 'cell') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.CELL_OPT_CLICK
      });
    } else if (type === 'home') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.HOME_OPT_CLICK
      });
    } else if (type === 'work') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.WORK_OPT_CLICK
      });
    } else if (type === 'Security') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.SECURITY_OPT_CLICK
      });
    }
    this.disableSubmitbtn = false;
    // localStorage.setItem('selectedContact',type);
    this.selectedContact = type;
    this.priorityVal = this.userPhone.priority
    for (let i = 0; i < this.userPhone.length; i++){
      if(this.userPhone[i].type === this.selectedContact){
        localStorage.setItem("priorityVal", this.userPhone[i].priority);
      }
    }
  }

  submitVoption() {
    if (this.selectedContact === 'Security') {
      this._common.navigate(
        ROUTES.securityIformation.children.security_question_2fa.absoluteRoute
      );
    } else {
      localStorage.setItem('selectedContact', `${this.selectedContact}`);
      this._common.navigate(
        ROUTES.securityIformation.children.code_sent.absoluteRoute
      );
    }
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.CONTINUE_CLICK
    });
  }

  showsendcodeBlock() {
    this.selectVOption = false;
    this.displaySendCode = true;
  }

  sendCode(resend) {
    let totalCodeAttempts = localStorage.getItem("codesRequested");
    if(!totalCodeAttempts){
      localStorage.setItem("codesRequested", "0");
      totalCodeAttempts = "0"
    } else {
      const newVal = +totalCodeAttempts + 1;
      totalCodeAttempts = newVal.toString();
      localStorage.setItem("codesRequested", totalCodeAttempts);
    }
    this.remainingCodeAttempts = 5 - +totalCodeAttempts;
    if(this.remainingCodeAttempts < 1){
      this.remainingCodeAttempts = 1;
    }
    const url = Microservice.authenticate_sendcode;
    const data = {
      to: this.selectedContact,
      refId: `${localStorage.getItem('refId')}`
    };
    //istanbul ignore else
    if (this.selectedContact !== 'email') {      
      data['priority'] = this.priorityVal;
      data['to'] = 'phone';
    }
    const promise = this._http.doPost(url, data);
    promise
      .then(res => {
        this.showLoader = false;
        if (res.ok) {
          const body = res.json();
          if (
            body.messages !== undefined &&
            body.messages[0].code === 'WAG_I_PROFILE_2024'
          ) {
            this.showsendcodeBlock();
            this.showLoader = false;
            if (resend) {
              this.RequestNewCodeGA();
              this._messageService.addMessage(
                new Message(
                  this.Err_MESSAGE.NewCode,
                  ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                  false,
                  false,
                  false,
                  <GaData>{ type: TwoFAEnum.PHONE_CODE_RESEND_BANNER }
                )
              );
            }
          } else {
            this._messageService.addMessage(
              new Message(
                body.messages[0].message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
      })
      .catch(err => {
        const error = JSON.parse(err._body);
        this.showLoader = false;
        this._messageService.addMessage(
          new Message(
            error.messages[0].message,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
        console.error(err);
      });
  }

  submitCode() {
    const url = CoreConstants.RESOURCE.authenticateCode;
    const refId = localStorage.getItem('refId');
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');
    const liteUser = localStorage.getItem('lite_user');
    const securityInfoUpdateType = sessionStorage.getItem(
      'securityInfoUpdateType'
    );
    const securityInfoReDirection = sessionStorage.getItem(
      'securityInfoReDirection'
    );
    const data = {
      code: this.codeEntered,
      type: 'Pin',
      refId: refId
    };

    this.showLoader = true;
    const promise = this._http.doPostLogin(url, data, getDeviceInfo);
    promise
      .then(res => {
        this.showLoader = false;
        const body = res.json();
        //istanbul ignore else
        if (body.messages !== undefined) {
          //istanbul ignore else
          if (body.messages[0].code === 'WAG_I_PROFILE_2004') {
            this.submitGAtagging();
            localStorage.setItem(AppContext.CONST.isUserVerified, 'true');
            if (securityInfoUpdateType === 'userinfo') {
              this._common.navigate(securityInfoReDirection);
            } else {
              // If previous url available in session store then redirecting to same url.
              if ( sessionStorage.getItem(AppContext.CONST.login_callback_urlkey) ) {
                this._userService.initUser1('', false, sessionStorage.getItem(AppContext.CONST.login_callback_urlkey), true);
              } else {
                this._userService.initUser1('', false);
              }
            }
          } else {
            this._messageService.addMessage(
              new Message(body.messages[0].message, body.messages[0].type)
            );
            this.wrongCodeEntered = true;
            this.wrongCodeEnteredMessage = this.codeMessageText;
          }
        }
      })
      .catch(err => {
        const error = JSON.parse(err._body);
        this.wrongCodeEntered = true;
        this.wrongCodeEnteredMessage = this.codeMessageText;
        this.errorStateGAtagging = true;
        this.showLoader = false;
        if (error.messages[0].code === 'WAG_E_PROFILE_2039') {
          this.selectVOption = false;
          this.reqNewCode = false;
          let gaData = TwoFAEnum.MAX_ATTEMPT_PHONE;
          //istanbul ignore else
          if (this.selectedContact === 'email') {
            gaData = TwoFAEnum.MAX_ATTEMPT_EMAIL;
          }
          this.displayErrorState = true;
          this.displaySendCode = false;
          this.disableSendbtn = true;
          this.selectedContact = '2039';
          this.codeEntered = undefined;
          this._messageService.addMessage(
            new Message(
              // tslint:disable-next-line: max-line-length
              'Because we were unable to verify your identity, your account has been temporarily locked for security purposes. <br /> To re-access your account, please call 877-250-5823.',
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              true,
              <GaData>{ type: gaData }
            )
          );
        } else {
          let GAtagforError;
          //istanbul ignore else
          if (this.selectedContact === 'email') {
            GAtagforError = TwoFAEnum.BANNER_CLOSE_EMAIL_ERROR;
          } else {
            GAtagforError = TwoFAEnum.PHONE_ERROR_CODE_ENTERED;
          }
          let messageText = error.messages[0].message;
          if(error.messages[0].code === "WAG_E_PROFILE_2040"){
            const regExMatchNumbers = /\d+/;
            const attemptsRemaining = messageText.match(regExMatchNumbers)[0];
            if(attemptsRemaining === "1"){
              messageText = "The code you entered is invalid. You have one more attempt to verify your identity."
            } else if (attemptsRemaining === "2")  {
              messageText = "The code you entered is invalid. You have two more attempts to verify your identity."
            }
          }
          this._messageService.addMessage(
            new Message(
              messageText,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              false,
              <GaData>{ type: GAtagforError }
            )
          );
        }
      });
  }

  getLastFourNumber(phoneNumber) {
    //istanbul ignore else
    if (phoneNumber !== undefined && phoneNumber !== null) {
      return phoneNumber.substring(phoneNumber.length - 4, phoneNumber.length);
    }

    return '';
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
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

  backAction() {
    const currentPage = this._router.url.split('/')[2];
    if (currentPage === 'code_sent') {
      if (this.errorStateGAtagging) {
        if (this.selectedContact === 'email') {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.CODE_SENT
          });
        } else {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.PHONE_ERROR_BACK_ACTION
          });
        }
      } else {
        if (this.selectedContact === 'email') {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.EMAIL_BACK_ACTION
          });
        } else {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.PHONE_BACK_ACTION
          });
        }
      }
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.BACK_CLICK_2FA
      });
    }

    this.errorStateGAtagging = false;

    //istanbul ignore else
    if (this.displaySendCode === true) {
      this._messageService.removeMessage(0);
      this.selectVOption = true;
      this.displaySendCode = false;
    } else {
      this.loginpage();
    }
  }

  loginpage() {
    this._common.navigate(ROUTES.login.absoluteRoute);
  }

  ongetSecurityQuestionsError() {
    this.loader = false;
    this._messageService.addMessage(
      new Message(
        'Error while fetching security question. Please try again after some time',
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  TollFreeClick() {
    const currentPage = this._router.url.split('/')[2];
    if (currentPage === 'code_sent') {
      if (this.errorStateGAtagging) {
        if (this.selectedContact === 'email') {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.EMAIL_ERROR_TOLL_FREE_CLICK
          });
        } else {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.PHONE_ERROR_TOLL_CLICK
          });
        }
      } else {
        if (this.selectedContact === 'email') {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.EMAIL_TOLL_CLICK
          });
        } else {
          this._gaService.sendGoogleAnalytics(<GaData>{
            type: TwoFAEnum.PHONE_TOLL_CLICK
          });
        }
      }
    } else {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.TOLL_CLICK
      });
    }
  }

  RequestNewCodeGA() {
    if (this.errorStateGAtagging) {
      if (this.selectedContact === 'email') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.REQ_NEW_CODE_SI_ERROR
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PHONE_ERROR_CODE_RESEND
        });
      }
    } else {
      if (this.selectedContact === 'email') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.REQ_NEW_CODE_SI
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PHONE_CODE_RESEND
        });
      }
    }
  }

  submitGAtagging() {
    if (this.errorStateGAtagging) {
      if (this.selectedContact === 'email') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.CON_EMAIL_SI_ERROR
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PHONE_ERROR_CONTINUE
        });
      }
    } else {
      if (this.selectedContact === 'email') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.CON_EMAIL_SI
        });
      } else {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.PHONE_CONTINUE
        });
      }
    }
  }
}
