import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClientService } from "@app/core/services/http.service";
import { UserService } from "@app/core/services/user.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ARX_MESSAGES, ROUTES, Microservice } from "@app/config";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models";

@Component({
  selector: "arxrf-ppp-authentication",
  templateUrl: "./ppp-authentication.component.html",
  styleUrls: ["./ppp-authentication.component.scss"]
})
export class PppAuthenticationComponent {
  showLoader: boolean;

  ppForm: FormGroup;

  enableRxInfo = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _http: HttpClientService,
    private _userService: UserService,
    private _common: CommonUtil,
    private _messageService: MessageService
  ) {
    this.initAuthForm();
  }
  /**
   * Create form group if not exist
   */
  initAuthForm(): void {
    if (!this.ppForm) {
      this.ppForm = this._formBuilder.group({
        rxNumber: ["", Validators.required]
      });
    }
  }

  /**
   * Sending request for prescriptions unlock.
   */
  submitUnlockRequest(): void {
    const activeMemId = this._userService.getActiveMemberId();
    this._common.validateForm(this.ppForm);

    if (!this.ppForm.invalid) {
      this.showLoader = true;
      const requestData = {
        fId: ""
      };
      requestData["rxNumber"] = this._getRxNumber();

      if (activeMemId === this._userService.user.id) {
        delete requestData.fId;
      } else {
        requestData.fId = activeMemId;
      }

      localStorage.setItem("buyoutUnlockUser", activeMemId);

      this._http
        .postData(Microservice.buyout_authenticate_rx, requestData)
        .subscribe(
          response => {
            this.successHandler(response);
          },
          () => {
            this.errorHandler();
          }
        );
    }
  }

  private _getRxNumber(): string {
    let rxNumber = this.ppForm.value.rxNumber;
    if (rxNumber.indexOf("-") > -1) {
      if (
        rxNumber.substring(rxNumber.indexOf("-") + 1, rxNumber.length).length <
        5
      ) {
        rxNumber = `${rxNumber.substring(
          0,
          rxNumber.indexOf("-") + 1
        )}0${rxNumber.substring(rxNumber.indexOf("-") + 1, rxNumber.length)}`;
      }
    }
    return rxNumber;
  }

  /**
   * Handling response from unlock service.
   *
   * @param response
   */
  successHandler(response: any): void {
    this.showLoader = false;
    if (response.authSuccess) {
      sessionStorage.setItem("u_pp_flow", "true");
      sessionStorage.setItem("insurance_success_flag", "true"); // set the flag to show insurance success msg on next route page
      localStorage.setItem("insuranceOnData", "Pending");
      this._common.navigate(ROUTES.refill.absoluteRoute);
    } else {
      this._messageService.addMessage(
        new Message(response.messages.message, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
      );
    }
  }

  /**
   * Handling invalid response from unlock service
   */
  errorHandler(): void {
    this.showLoader = false;
    this._messageService.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  updateRxInfoState(state) {
    this.enableRxInfo = false;
  }
}
