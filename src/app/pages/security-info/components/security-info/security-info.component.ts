import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models";
import { ARX_MESSAGES, ROUTES } from "@app/config";
import { Router } from "@angular/router";
import { SecurityInfoService } from "@app/pages/security-info/securityinfo.service";
import { UserService } from "@app/core/services/user.service";
import { AppContext } from "@app/core/services/app-context.service";
import { HttpClientService } from "@app/core/services/http.service";
import { Microservice } from "@app/config/microservice.constant.ts";
import { CommonUtil } from "@app/core/services/common-util.service";

@Component({
  selector: "arxrf-security-info",
  templateUrl: "./security-info.component.html",
  styleUrls: ["./security-info.component.scss"]
})
export class SecurityInfoComponent implements OnInit {
  @Output() next = new EventEmitter();

  routes = ROUTES;
  user;
  showLoader = false;
  securityQuestion;
  displayAlertBanner = false;
  securityInfoBaner = false;
  isMobile = false;
  constructor(
    private _messageService: MessageService,
    private _userService: UserService,
    private _router: Router,
    private _http: HttpClientService,
    private _securityInfoService: SecurityInfoService,
    private _common: CommonUtil
  ) {}

  ngOnInit() {
    this.isMobile = localStorage.getItem("isMobile") === "true";
    this.user = this._userService.user.profile;
    this.getSecurityQuestions();
    //Commented for Login Rollback
    // const legacyUser = localStorage.getItem('isLegacyUser');
    // const validateLegacyUser = localStorage.getItem('validateLegacyUser');
    // if (legacyUser === 'false' || validateLegacyUser === 'false') {
    //   if (!this._userService.checkCookie('securityInfoBanner')) {
    //     this.displayAlertBanner = true;
    //   }
    // } else {
    //   this.securityInfoBaner = true;
    // }
  }

  moveToUserInfo(type: string) {
    this._router.navigateByUrl(
      ROUTES.securityIformation.children.userinfo.absoluteRoute
    );
  }

  moveToSecQues(type: string) {
    if (localStorage.getItem(AppContext.CONST.isUserVerified) === null) {
      this._common.storeLoginPostUrl("/securityinfo/securityquestion");
    }
    this._router.navigateByUrl(
      ROUTES.securityIformation.children.security_question.absoluteRoute
    );
  }

  getSecurityQuestions() {
    const path = window.location.href;
    const refIdVal = localStorage.getItem("refId");
    if (
      refIdVal === undefined ||
      refIdVal == null ||
      path.indexOf("/securityinfo") > 0
    ) {
      return this._http
        .postAuthData(Microservice.userInfo, {
          isTNCRequired: false,
          extSystemIds: false
        })
        .subscribe(
          res => {
            this.showLoader = false;
            this.securityQuestion = res.basicProfile.securityQuestion;
            // show msg from session storage if security que/ans updated successfull msg find.
            if (
              this._securityInfoService.changesSaved ||
              sessionStorage.getItem(
                AppContext.CONST.key_username_update_status
              ) != null
            ) {
              this.displayAlertBanner = false;
              this._messageService.addMessage(
                new Message(
                  "Your settings were updated successfully.",
                  ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
                )
              );
              this._securityInfoService.changesSaved = false;

              if (
                sessionStorage.getItem(
                  AppContext.CONST.key_username_update_status
                ) != null
              ) {
                sessionStorage.removeItem(
                  AppContext.CONST.key_username_update_status
                );
              }
            }
          },
          err => {
            this.ongetSecurityQuestionsError();
          }
        );
    } else {
      const url = Microservice.profile_UserInfo;
      this.showLoader = true;
      this._http
        .postData(url, { refId: localStorage.getItem("refId") })
        .subscribe(
          res => {
            this.showLoader = false;
            this.securityQuestion = res.securityQuestion;

            // show msg from session storage if security que/ans updated successfull msg find.
            if (
              this._securityInfoService.changesSaved ||
              sessionStorage.getItem(
                AppContext.CONST.key_username_update_status
              ) != null
            ) {
              this._messageService.addMessage(
                new Message(
                  "Your settings were updated successfully.",
                  ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
                )
              );
              this._securityInfoService.changesSaved = false;

              if (
                sessionStorage.getItem(
                  AppContext.CONST.key_username_update_status
                ) != null
              ) {
                sessionStorage.removeItem(
                  AppContext.CONST.key_username_update_status
                );
              }
            }
          },
          err => {
            this.ongetSecurityQuestionsError();
          }
        );
    }
  }
  ongetSecurityQuestionsError() {
    this.showLoader = false;
    this._messageService.addMessage(
      new Message(
        "Error while fetching security question. Please try again after some time",
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  updateCookie(event) {
    if (event === "securityInfoBanner") {
      this._userService.updateCookie(event);
    }
  }
}
