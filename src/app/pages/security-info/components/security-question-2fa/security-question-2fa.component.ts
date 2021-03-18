import {
  Component,
  OnInit,
  Output,
  ElementRef,
  EventEmitter
} from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { Router } from '@angular/router';
import { CoreConstants, Microservice, ROUTES } from '@app/config';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray
} from '@angular/forms';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { HttpClientService } from '@app/core/services/http.service';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { ActivatedRoute } from '@angular/router';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';

@Component({
  selector: 'arxrf-security-question-2fa',
  templateUrl: './security-question-2fa.component.html',
  styleUrls: ['./security-question-2fa.component.scss']
})
export class SecurityQuestion2faComponent implements OnInit {
  @Output() next = new EventEmitter();
  securityquestionForm: FormGroup;
  securityAnswer;
  showLoader = false;
  questions: string;
  selectedSecurityQue: any;
  securityInfoUpdateType = undefined;
  blokermessage = false;
  resCodeForGA: string;
  constructor(
    private router: Router,
    private _messageService: MessageService,
    public appContext: AppContext,
    private _formBuilder: FormBuilder,
    private _commonUtil: CommonUtil,
    private _userService: UserService,
    private _httpService: HttpClientService,
    private activatedRoute: ActivatedRoute,
    private _gaService: GaService
  ) {
    this._commonUtil.addNaturalBGColor();
    this.securityquestionForm = this._formBuilder.group({
      sec_ans: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUserInfo();
    this.activatedRoute.queryParams.subscribe(params => {
      this.securityInfoUpdateType = params.type;
    });
  }
  getUserInfo() {
    const url = Microservice.profile_UserInfo;
    const refIdval = localStorage.getItem('refId');
    if (!refIdval) {
      this._httpService
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
      this._httpService.postData(url, requestdata).subscribe(
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

  getSecurityQuestions() {
    this.showLoader = true;
    const url = '/register/common/SecurityQuestions';
    this._httpService.getData(url).subscribe(response => {
      const { selectedSecurityQuestion } = this._userService;
      this.showLoader = false;
      this.questions = response.securityQuestions;
      // istanbul ignore else
      if (selectedSecurityQuestion) {
        response.securityQuestions.forEach(element => {
          if (
            element.question.toLowerCase() ===
            selectedSecurityQuestion.toLowerCase()
          ) {
            this.selectedSecurityQue = element;
          }
        });
      }
    });
  }
  submitAnswer() {
    const url = CoreConstants.RESOURCE.authenticateCode;
    const refId = localStorage.getItem('refId');
    let qcode = this.selectedSecurityQue.code;
    const getDeviceInfo = sessionStorage.getItem('deviceinfo');

    // istanbul ignore else
    if (qcode === undefined || qcode == null) {
      qcode = this._userService.selectedSecuritQuestionCode;
    }

    const data = {
      type: 'SecurityAnswer',
      qcode: qcode,
      code: this.securityquestionForm.controls.sec_ans.value,
      refId: refId
    };
    let gaData = <GaData>{
      type: TwoFAEnum.CONTINUE_SEC
    };
    if (this.resCodeForGA) {
      gaData = <GaData>{
        type: TwoFAEnum.CONTINUE_SEC_ERROR
      };
    }
    this._gaService.sendGoogleAnalytics(gaData);
    this.showLoader = true;
    const promise = this._httpService.doPostLogin(url, data, getDeviceInfo);
    promise
      .then(res => {
        const body = res.json();
        this.showLoader = false;
        this.resCodeForGA = body.messages[0].code;
        if (body.messages[0].code === 'WAG_I_LOGIN_1011') {
          localStorage.setItem(AppContext.CONST.isUserVerified, 'true');
        } else if (body.messages[0].code === 'WAG_I_PROFILE_2004') {
          localStorage.setItem(AppContext.CONST.isUserVerified, 'true');
          // istanbul ignore else
          if (this.securityInfoUpdateType === 'userinfo'  &&
            this.checkForRefillReminderRoute() === false) { // extra condition to find checkForRefillReminderRoute
            this.next.emit();
          } else if (this.securityInfoUpdateType === undefined) { // extra condition to find checkForRefillReminderRoute
            if (sessionStorage.getItem(AppContext.CONST.login_callback_urlkey)) {
              this._userService.initUser1(
                '76756756744',
                false,
                sessionStorage.getItem(AppContext.CONST.login_callback_urlkey),
                true
              );
            } else {
              this._userService.initUser1(
                '76756756744',
                false,
                this.securityInfoUpdateType
              );
            }
          } else if (
            this.securityInfoUpdateType === 'securityquestion' ||
            this.securityInfoUpdateType !== undefined &&
            this.checkForRefillReminderRoute() === false) { // extra condition to find checkForRefillReminderRoute
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
        this.resCodeForGA = error.messages[0].code;
        if (error.messages[0].code === 'WAG_E_PROFILE_2039') {
          this.blokermessage = true;
          this._messageService.addMessage(
            new Message(
              // tslint:disable-next-line: max-line-length
              'Because we were unable to verify your identity, your account has been temporarily locked for security purposes. <br /> To re-access your account, please call 877-250-5823.',
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              true,
              <GaData>{ type: TwoFAEnum.MAX_ATTEMPT_SEC_QUES }
            )
          );
        } else {
          let messageText = error.messages[0].message;
          if(error.messages[0].code === "WAG_E_PROFILE_2040"){
            messageText = messageText.replace('attempts', 'attempt(s)')
            let remainingAttempts = messageText.match(/\d+/)[0];
            if (remainingAttempts && remainingAttempts === "1" || remainingAttempts === "2") {
              remainingAttempts = remainingAttempts === "2" ?  "2 more attempts" : "one more attempt";
              messageText = `The answer you provided does not match our records. You have ${remainingAttempts} to answer correctly and verify your identity.`
            }
          }
          
          this._messageService.addMessage(
            new Message(
              messageText,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR,
              false,
              false,
              false,
              <GaData>{ type: TwoFAEnum.BANNER_CLOSE_SEC_ERROR }
            )
          );
        }
      });
  }
  backAction(type: string) {
    let gatype = <GaData>{
      type: TwoFAEnum.BACK_SEC
    };
    if (this.resCodeForGA) {
      gatype = <GaData>{
        type: TwoFAEnum.BACK_SEC_ERROR
      };
    }
    this._gaService.sendGoogleAnalytics(gatype);
    const url = `${ROUTES.securityIformation.children.two_fa.absoluteRoute}?type=${type}`;
    this._commonUtil.navigate(url);
  }
  GaeventTollfree() {
    let gaeventdata = <GaData>{
      type: TwoFAEnum.TOLL_CLICK_SEC
    };
    if (this.resCodeForGA) {
      gaeventdata = <GaData>{
        type: TwoFAEnum.TOLL_CLICK_SEC_ERROR
      };
    }
    this._gaService.sendGoogleAnalytics(gaeventdata);
  }

  /**
   * Adding extra condition to find specialty-refill-checkout || home-delivery-refill-checkout route.
   * Checking for specialty-refill-checkout route with query params
   */
  checkForRefillReminderRoute() {
    const callBackurl = sessionStorage.getItem(AppContext.CONST.login_callback_urlkey);
    const caPathrefillremainder = localStorage.getItem('ca-path-refill-remainder');
    let isRefillReminder: boolean;
    isRefillReminder = false;
    if (callBackurl && (callBackurl.indexOf('specialty-refill-checkout') > -1 || callBackurl.indexOf('home-delivery-refill-checkout') > -1)
     && callBackurl.indexOf('utm_source') > -1 && callBackurl.indexOf('type') > -1) {
      isRefillReminder = true;
    } else if (caPathrefillremainder &&  caPathrefillremainder.indexOf('/specialty-refill-checkout') > -1) {
      isRefillReminder = true;
    }
    return isRefillReminder;
  }
}
