import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { MessageService } from '@app/core/services/message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { CommonUtil } from '@app/core/services/common-util.service';
import { Router } from '@angular/router';
import { SecurityInfoService } from '@app/pages/security-info/securityinfo.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-security-ques',
  templateUrl: './security-ques.component.html',
  styleUrls: ['./security-ques.component.scss']
})
export class SecurityQuesComponent implements OnInit {
  questions: any[];

  securityForm: FormGroup;
  loader = false;
  overlay = true;
  selectedSecurityQue;

  routes = ROUTES;

  constructor(
    private _userService: UserService,
    private _http: HttpClientService,
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _common: CommonUtil,
    private _router: Router,
    private _securityInfoService: SecurityInfoService,
    public appContext: AppContext
  ) {
    this.securityForm = this._formBuilder.group({
      questionCode: ['', Validators.required],
      answer: ['', Validators.required]
    });
  }

  ngOnInit() {
    const url = Microservice.userInfo;
    this._http.postData(url, { flow: 'ARX' }).subscribe(
      res => {
        if (res.securityQuestion !== undefined) {
          this._userService.selectedSecurityQuestion = res.securityQuestion;
        } else {
          this._userService.selectedSecurityQuestion =
            res.basicProfile.securityQuestion;
        }
        this.getSecurityQuestions();
      },
      error => {
        this.getSecurityQuestions();
      }
    );
  }

  getSecurityQuestions() {
    this.loader = true;
    const url = '/register/common/SecurityQuestions';

    this._http.getData(url).subscribe(response => {
      this.loader = false;
      this.questions = response.securityQuestions;
      if (this._userService.selectedSecurityQuestion !== undefined) {
        response.securityQuestions.forEach(element => {
          if (element.question === this._userService.selectedSecurityQuestion) {
            this.selectedSecurityQue = element.code;
          }
        });
      }
    });
  }

  submitSecurityQuestionDetail() {
    if (this.securityForm.invalid) {
      this._common.validateForm(this.securityForm);
      return;
    }
    this.loader = true;

    const request_data = {
      securityQuestionCode: this.securityForm.value.questionCode,
      securityQuestionAnswer: this.securityForm.value.answer,
      source: 'ECOM_SECURITY_SECTION',
      flow: 'ARX'
    };

    this._http
      .putData(Microservice.security_info_update, request_data)
      .subscribe(
        response => {
          this.loader = false;
          if (response.status === 'success') {
            this._messageService.addMessage(
              new Message(
                'Your settings were updated sucessfully.',
                ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
              )
            );
            this._securityInfoService.verificationState = false;
            this._securityInfoService.changesSaved = true;
            this._router.navigateByUrl(ROUTES.securityIformation.absoluteRoute);
          } else if (response.status === 'fail') {
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
          }
        },
        error => {
          this.loader = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
  }
}
