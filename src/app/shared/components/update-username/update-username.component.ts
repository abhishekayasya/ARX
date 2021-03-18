import {
  OnInit,
  Component,
  Input,
  AfterViewInit,
  Output,
  EventEmitter
} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { CoreConstants } from "@app/config/core.constant";
import { Message } from "@app/models/message.model";
import { ARX_MESSAGES } from "@app/config/messages.constant";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ROUTES } from "@app/config";
import { CookieService } from "ngx-cookie-service";
import { RegistrationService } from "@app/core/services/registration.service";

@Component({
  selector: "arxrf-update-username",
  templateUrl: "./update-username.component.html",
  styleUrls: ["./update-username.component.scss"]
})
export class UpdateUsernameComponent implements OnInit, AfterViewInit {
  updateUserNameForm: FormGroup;
  showLoader = false;
  invalidUserName = false;

  @Input("showArxLogo") showArxLogo = true;
  emailId = "";
  isEmailUpdated = false;
  emailPattern: string;

  constructor(
    private _messageService: MessageService,
    private _formBuilder: FormBuilder,
    private _httpService: HttpClientService,
    private _commonUtil: CommonUtil
  ) {
    this.emailPattern = CoreConstants.PATTERN.EMAIL;
    this.updateUserNameForm = this._formBuilder.group({
      username: [
        "",
        [Validators.required, Validators.pattern(this.emailPattern)]
      ]
    });
  }
  ngOnInit() {}

  ngAfterViewInit(): void {
    this._messageService.addMessage(this.addBanner());
  }

  /**
   * validUserName function is called on click of continue button;
   * to update userid to valid email id.
   *
   */
  validUserName() {
    if (
      this.updateUserNameForm.value.username === "" ||
      this.updateUserNameForm.controls.username.invalid ||
      this.updateUserNameForm.controls.username.errors != null
    ) {
      this.invalidUserName = true;
      return;
    }

    const url = "/profile/csrf-disabled/updateUserName";
    const requestPayload = {
      username: this.updateUserNameForm.value.username
    };

    this._httpService
      .doPost(url, requestPayload)
      .then(res => {
        // console.log("backend Respn - ", res);
        const msgbanner: Message[] = [];
        msgbanner.push(this.addBanner());
        if (res.ok) {
          const body = res.json();
          if (body.messages) {
            if (body.messages[0].code === "WAG_I_PROFILE_2084") {
              // SUCCESS CASE
              this.emailId = this.updateUserNameForm.value.username;
              this.isEmailUpdated = true;
              const successMsg = new Message(
                "Success",
                ARX_MESSAGES.MESSAGE_TYPE.SUCCESS,
                false,
                false,
                true,
                null,
                ""
              );
              this._messageService.addMessage(successMsg);
            } else {
              // Anyohter ERROR Case
              msgbanner.push(
                new Message(
                  body.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR,
                  false,
                  false,
                  true,
                  null,
                  ""
                )
              );
              this._messageService.addMessages(msgbanner);
            }
          }
        }
      })
      .catch(err => {
        console.log("failure - ", err);
      });
  }

  /**
   * postUserNameSuccess function is used to route to myaccouts page after success response.
   */
  postUserNameSuccess() {
    this._commonUtil.navigate(ROUTES.account.absoluteRoute);
  }

  /**
   * checkAndAddBanner function is used to set the banner message.
   */
  addBanner() {
    return new Message(
      "Please update your Walgreens.com username to an email address.",
      ARX_MESSAGES.MESSAGE_TYPE.WARN,
      false,
      false,
      true,
      null,
      "updateUserNameBanner"
    );
  }
}
