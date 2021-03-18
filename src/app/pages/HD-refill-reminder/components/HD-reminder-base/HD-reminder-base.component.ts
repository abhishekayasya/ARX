import { AfterViewInit, Component } from '@angular/core';
import { CommonUtil } from 'app/core/services/common-util.service';
import { HttpClientService } from 'app/core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'app/core/services/message.service';
import { AppContext } from 'app/core/services/app-context.service';
import { ARX_MESSAGES, ROUTES, Microservice, CoreConstants, KEYS } from 'app/config/index';
import { Message } from 'app/models/index';
import { CheckoutService } from 'app/core/services/checkout.service';
import { CHECKOUT } from 'app/config/checkout.constant';
import { HD_ReminderService } from 'app/pages/HD-refill-reminder/HD_Reminder.service';
import { UserService } from 'app/core/services/user.service';
import { AddressBookService } from '@app/core/services/address-book.service';

@Component({
  selector: 'arxrf-hd-refill-reminder-base',
  templateUrl: './HD-reminder-base.component.html',
  styleUrls: ['./HD-reminder-base.component.scss']
})
// tslint:disable-next-line: class-name
export class HD_ReminderBaseComponent implements AfterViewInit {
  loader = true;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;

  routes = ROUTES;

  userid: string;
  isInvalidId = false;
  invalidUser = false;
  disableFormValiation = false;

  // tslint:disable-next-line: max-line-length
  invalidErrorMessage = `The reminder ID is not valid. If you have any question, please contact us at toll-free number ${this.appContext.tollFreeContact}`;

  allreadyUsedIdMessage = 'This refill order has already been processed.';

  refillResponse: any;
  mailData;
  reviewMailData;
  selectAddressPayload = {};

  CONST = {
    param_reminderid: 'reminderid',
    param_type: 'type'
  };

  private refillRequest = {
    reminderId: '',
    pageRefresh: '',
    flowType: ''
  };

  history = <
    {
      additionalMeds: Array<any>;
      healthConditions: Array<any>;
      drugAllergies: Array<any>;
    }
  >{};

  constructor(
    private _http: HttpClientService,
    private _route: ActivatedRoute,
    private _message: MessageService,
    private appContext: AppContext,
    private _checkout: CheckoutService,
    public userService: UserService,
    private _router: Router,
    public hdReminder: HD_ReminderService,
    public addressesService: AddressBookService
  ) {
    this._route.queryParams.subscribe(params => {
      if (params !== undefined && Object.keys(params).length !== 0) {
        window.sessionStorage.setItem(
          AppContext.CONST.hd_rr_params,
          JSON.stringify(params)
        );
        this.prepareRefillInformation(params);
      } else {
        let HDParams = window.sessionStorage.getItem(
          AppContext.CONST.hd_rr_params
        );
        if (HDParams) {
          HDParams = JSON.parse(HDParams);
          this.prepareRefillInformation(HDParams);
        }
      }
    });
  }

  /**
   * Fetch and prepare refill reminder request information.
   *
   * @param params
   */
  prepareRefillInformation(params: any) {
    const pageRefresh = sessionStorage.getItem(KEYS.review_page_refresh);

    for (const paramsKey in params) {
      if (paramsKey.toLocaleLowerCase() === this.CONST.param_reminderid) {
        this.refillRequest.reminderId = params[paramsKey];
      } else if (paramsKey.toLocaleLowerCase() === this.CONST.param_type) {
        this.refillRequest.flowType = params[paramsKey];
      }
    }

    this.refillRequest.pageRefresh = (pageRefresh === "true") ? pageRefresh : 'false';
  }

  fetchHealthHistory() {
    this.loader = true;
    this._http
      .postData(Microservice.health_history_retrieve, {
        flow: 'ARX'
      })
      .subscribe(
        response => {
          this.history = <any>{};
          if (response.message !== undefined) {
            this._message.addMessage(
              new Message(
                response.message.message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            if (!response.healthInfo) {
              this.history.additionalMeds = [];
              this.history.healthConditions = [];
              this.history.drugAllergies = [];
            } else {
              this.history.additionalMeds = response.healthInfo.additionalMeds
                ? response.healthInfo.additionalMeds
                : [];
              this.history.healthConditions = response.healthInfo
                .healthConditions
                ? response.healthInfo.healthConditions
                : [];
              this.history.drugAllergies = response.healthInfo.drugAllergies
                ? response.healthInfo.drugAllergies
                : [];
            }
          }
          this.loader = false;
        },
        () => {
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          this.loader = false;
        }
      );
  }

  initiateSessionForReminder(): void {
    this.loader = true;
    this._checkout.fetchAddressList().subscribe(
      res => {
        if (res.messages === undefined) {
          this.addressesService.addresses = res.addresses;
          const uInfo = localStorage.getItem('u_info');
          if (uInfo) {
            const getName = JSON.parse(uInfo).basicProfile;
            this.addressesService.homeAddress = res.homeAddress;
            this.addressesService.homeAddress[
              'firstName'
            ] = getName.firstName.toUpperCase();
            this.addressesService.homeAddress[
              'lastName'
            ] = getName.lastName.toUpperCase();
          }
          this.getHDRefillReminderData();
        } else {
          const uInfo = localStorage.getItem('u_info');
          if (uInfo) {
            const getName = JSON.parse(uInfo).basicProfile;
            this.addressesService.homeAddress = res.homeAddress;
            this.addressesService.homeAddress[
              'firstName'
            ] = getName.firstName.toUpperCase();
            this.addressesService.homeAddress[
              'lastName'
            ] = getName.lastName.toUpperCase();
          }
          this.getHDRefillReminderData();
        }
        this.loader = false;
      },
      () => {
        this.oninitiateSessionFormRemainderError();
      }
    );
  }
  getHDRefillReminderData() {
    const url = Microservice.checkout_review;
    this.loader = true;
    this._http.postData(url, this.refillRequest).subscribe(
      response => {
        if (response.checkoutDetails && response.checkoutDetails.length > 0) {
          this.reviewMailData = response;
          this.mailData = this.reviewMailData;
          const prescList = response.checkoutDetails[0].prescriptionList;
          this.disableFormValiation =
            prescList.filter(item => item.isValidRx === 'false').length ===
            prescList.length;
          this.isAllPrescriptionValid(prescList);
          if (this.refillRequest.pageRefresh === 'false') {
            this.updateAddressSelected();
            this._checkout.updateAddressCall(
              response.checkoutDetails[0].boxDetails.shippingInfo.deliveryAddr
            );
          }
          if (
            (response.messages && response.messages.length > 0) ||
            response.code
          ) {
            this.handleRefillReminderErrors(response);
            const preList = response.checkoutDetails[0].prescriptionList;
            this.isAllPrescriptionValid(preList);
          }
          // this.getRefillReminderData();
        } else {
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
        // }
        this.loader = false;
      },
      () => {
        this.oninitiateSessionFormRemainderError();
      }
    );
  }
  handleRefillReminderErrors(response: any) {
    // invalid reminder id case
    if (response.messages && response.messages.length > 0) {
      // this.isInvalidId = true;
      if (response.messages[0].code === 'WAG_E_RR_001') {
        this._message.addMessage(
          new Message(this.invalidErrorMessage, ARX_MESSAGES.MESSAGE_TYPE.WARN)
        );
      } else if (response.messages[0].code === 'WAG_RXCHECKOUT_WRONG_USER') {
        this.invalidUser = true;
        this._message.addMessage(
          new Message(
            response.messages[0].message,
            ARX_MESSAGES.MESSAGE_TYPE.WARN
          )
        );
      } else {
        this._message.addMessage(
          new Message(
            response.messages[0].message,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
      return;
    }
    // handling alreayd processed id case
    if (response.code !== undefined) {
      if (
        response.rxorders[0].patient[0].referrals[0].invalidPrescriptions !==
          undefined &&
        response.rxorders[0].patient[0].referrals[0].invalidPrescriptions
          .length > 0
      ) {
        this.isInvalidId = true;
        this._message.addMessage(
          new Message(
            this.allreadyUsedIdMessage,
            ARX_MESSAGES.MESSAGE_TYPE.WARN
          )
        );
      } else if (response.code === 'WAG_E_RR_001') {
        this._message.addMessage(
          new Message(this.invalidErrorMessage, ARX_MESSAGES.MESSAGE_TYPE.WARN)
        );
      } else if (response.code === 'WAG_RXCHECKOUT_WRONG_USER') {
        this.invalidUser = true;
        this._message.addMessage(
          new Message(
            response.messages[0].message,
            ARX_MESSAGES.MESSAGE_TYPE.WARN
          )
        );
      } else {
        this._message.addMessage(
          new Message(
            response.messages[0].message,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    }
    if (
      response &&
      response.checkoutDetails &&
      response.checkoutDetails[0].prescriptionList
    ) {
      const invalidPrescriptions = this.isInValidPrescriptions(
        response.checkoutDetails[0].prescriptionList
      );
      if (invalidPrescriptions) {
        this.isInvalidId = true;
        this._message.addMessage(
          new Message(
            this.allreadyUsedIdMessage,
            ARX_MESSAGES.MESSAGE_TYPE.WARN
          )
        );
      } else {
        this._checkout.isAllPrescriptionInvalid = false;
      }
    }
  }

  isAllPrescriptionValid(prescriptionList: any) {
    // invalid reminder id case
    this._checkout.isAllPrescriptionInvalid = true;
    if (prescriptionList) {
      prescriptionList.forEach(precription => {
        if (precription.isValidRx === 'true') {
          this._checkout.isAllPrescriptionInvalid = false;
          return false;
        }
      });
    }
  }

  isInValidPrescriptions(prescriptions) {
    if (prescriptions) {
      const prescriptionList = prescriptions.filter(function(prescription) {
        if (
          prescription.messages &&
          (prescription.messages[0].code === 'WAG_RXHOMEDELIVERY_001' ||
            prescription.isValidRx === 'false')
        ) {
          return true;
        }
        return (
          prescription.messages &&
          (prescription.messages[0].code === 'WAG_RXHOMEDELIVERY_VAL_001' ||
            prescription.isValidRx === 'false')
        );
      });
      return prescriptionList.length ? true : false;
    }
    return false;
  }

  getRefillReminderData() {
    const shippingOptionsList = this.reviewMailData.checkoutDetails[0]
      .boxDetails.shippingInfo.shippingOptions;
    let shipMethod;

    if (shippingOptionsList) {
      shippingOptionsList.forEach(option => {
        if (option.selected) {
          shipMethod = option.value;
        }
      });
    }

    const data = {
      checkoutDetails: [
        {
          flowType: this.refillRequest.flowType,
          type: this.reviewMailData.checkoutDetails[0].type,
          subType: this.reviewMailData.checkoutDetails[0].subType,
          channel: this.reviewMailData.checkoutDetails[0].channel,
          channelType: this.reviewMailData.checkoutDetails[0].channelType,
          /*"creditCard":{
                "saveAsExpressPay":"no",
                "transactionId":"5d036cf628aa020007d997ad"
              },*/
          address: {
            shipMethod: shipMethod
          }
        }
      ]
    };

    this.loader = true;
    this._http.postData(Microservice.checkout_submit, data).subscribe(
      resp => {
        this.loader = false;
        if (resp.messages === undefined) {
          if (resp.checkoutDetails && resp.checkoutDetails.length > 0) {
            this.userService.updateCartRxCount();
          }
        } else if (resp.messages[0].code === 'WAG_RXCHECKOUT_002') {
          this._message.addMessage(
            new Message(
              resp.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.WARN
            )
          );
        } else {
          this._message.addMessage(
            new Message(
              resp.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      },
      () => {
        this.oninitiateSessionFormRemainderError();
      }
    );
  }

  ngAfterViewInit(): void {
    this.initiateSessionForReminder();
  }

  logoutAction() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      `${window.location.pathname}${window.location.search}`
    );
    this._router.navigateByUrl('/logout');
  }

  updateAddressSelected() {
    if (this.addressesService.addresses) {
      for (const idx in this.addressesService.addresses) {
        if (
          this.addressesService.addresses[idx].preferred ||
          this.addressesService.addresses[idx].isPreferred ||
          this.addressesService.addresses[idx].defaultAddress
        ) {
          this.mailData.checkoutDetails[0].boxDetails.shippingInfo.deliveryAddr = this.addressesService.addresses[
            idx
          ];
        } else {
          this.mailData.checkoutDetails[0].boxDetails.shippingInfo.deliveryAddr = this.addressesService.homeAddress;
        }
      }
    } else {
      this.mailData.checkoutDetails[0].boxDetails.shippingInfo.deliveryAddr = this.addressesService.homeAddress;
    }
  }
  oninitiateSessionFormRemainderError() {
    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
    this.loader = false;
  }
}
