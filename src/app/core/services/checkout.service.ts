import { Injectable } from "@angular/core";
import { AppContext } from "@app/core/services/app-context.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { CheckoutOrderModel } from "@app/models/checkout-order.model";
import { ARX_MESSAGES, KEYS, Microservice } from "@app/config";
import { Message, Prescription } from "@app/models";
import { HttpClientService } from "@app/core/services/http.service";
import { Observable } from "rxjs/Observable";
import { CHECKOUT } from "@app/config/checkout.constant";
import { HomeDeliveryContext } from "@app/models/checkout/home-delivery.context";
import { SpecialityContext } from "@app/models/checkout/speciality.context";
import { MessageService } from "./message.service";
import { forkJoin } from "rxjs/observable/forkJoin";
import { fromPromise } from "rxjs/observable/fromPromise";
import { delay, catchError } from "rxjs/operators";

/**
 * Service to hold actions and data for checkout process.
 */
@Injectable()
export class CheckoutService {
  orderPayload: CheckoutOrderModel;
  submitOrderPayload: any; // used in order-success.component

  loader = false;
  showLoader: boolean;
  loaderOverlay = false;
  isAllPrescriptionInvalid = true;
  isAnyPrescriptionInvalid = false;
  comboState = CHECKOUT.comboState.mail;
  currentComboNavState = CHECKOUT.comboState.mail;
  isCombo = false;
  needHDCreditCard = false;
  hdCCReqPayload;
  selectAddressPayload = {};

  // this is a flag to validate whether any new prescription has been added or not.
  // request to add in prescriptions cart will be called only if any new prescription is
  // added in cart. Else user will be simple redirected to checkout page based on session store cache.
  newPrescriptionsAdded = false;

  data_deliveryOptions: any;
  data_prescriptions: any;
  healthInfoData = [];

  exists = {
    mail: false,
    unsolicited: false,
    cleansed: false
  };

  valid = {
    mail: false,
    unsolicited: false,
    cleansed: false
  };

  submit_state = {
    mail: false,
    unsolicited: false,
    cleansed: false
  };

  error_state = {
    cleansed: false
  };

  loaderState = true;

  insuranceStatus: string;
  insuranceOnData: string;

  history = <
    {
      additionalMeds: Array<any>;
      healthConditions: Array<any>;
      drugAllergies: Array<any>;
    }
  >{};

  constructor(
    public appContext: AppContext,
    private _common: CommonUtil,
    private _http: HttpClientService,
    private _message: MessageService
  ) {}

  deliveryOptions(reqObj ?: any): Observable<any> {
    const pageRefresh = sessionStorage.getItem(KEYS.review_page_refresh);
    if (reqObj && reqObj['flag'] === 'SPRx-RR') {
      const requestPayload: any  = {
        flowType: reqObj['flowType'],
        pageRefresh:  pageRefresh ? pageRefresh : 'false',
        referralId:  reqObj['referralId'],
        smId: reqObj['smId'],
      };
      if (reqObj['fid']) {
        requestPayload.fid = reqObj['fid'];
      }
      return this._http.postData(Microservice.checkout_review, requestPayload);
    } else {
      return this._http.postData(Microservice.checkout_review, {
        flowType: 'DOTCOM',
        pageRefresh: (pageRefresh === "true") ? pageRefresh : 'false'
      });
    }
  }

  storeReviewRefresh(value: string): void {
    sessionStorage.setItem(KEYS.review_page_refresh, value);
  }

  storeCheckoutStateInSession(): void {
    if (this.data_deliveryOptions.specialtyCombo) {
      this.isCombo = true;
      sessionStorage.setItem(CHECKOUT.session.combo_key, "true");
    } else {
      this.isCombo = false;
      sessionStorage.removeItem(CHECKOUT.session.combo_key);
      if (
        this.data_deliveryOptions.checkoutDetails.find(item => {
          return item.subType === CHECKOUT.type.HD;
        })
      ) {
        this.exists.mail = true;
      }

      if (
        this.data_deliveryOptions.checkoutDetails.find(item => {
          return item.subType === CHECKOUT.type.SC;
        })
      ) {
        this.exists.cleansed = true;
      }

      if (
        this.data_deliveryOptions.checkoutDetails.find(item => {
          return item.subType === CHECKOUT.type.SU;
        })
      ) {
        this.exists.unsolicited = true;
      }
    }
  }
  displayServiceNotification() {
    this.loader = false;
    this.loaderOverlay = false;
    this.showLoader = false;
    this._message.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }

  /**
   *
   * @param prescription
   * @param {string} type
   */
  addPrescriptionInSession(prescription: any, type: string): void {
    switch (type) {
      case CHECKOUT.type.HD:
        let json: Array<string> = [];
        if (localStorage.getItem(CHECKOUT.session.key_items_hd) != null) {
          json = JSON.parse(
            localStorage.getItem(CHECKOUT.session.key_items_hd)
          );
        }
        if (prescription.rxNumber) {
          if (json.indexOf(prescription.rxNumber) === -1) {
            this.newPrescriptionsAdded = true;
            json.push(prescription.rxNumber);
          }
        } else {
          if (json.indexOf(prescription.viewId) === -1) {
            this.newPrescriptionsAdded = true;
            json.push(prescription.viewId);
          }
        }
        localStorage.setItem(
          CHECKOUT.session.key_items_hd,
          JSON.stringify(json)
        );
        break;

      case CHECKOUT.type.SC:
        let jsonList: Array<string> = [];
        if (localStorage.getItem(CHECKOUT.session.key_items_sp) != null) {
          jsonList = JSON.parse(
            localStorage.getItem(CHECKOUT.session.key_items_sp)
          );
        }

        if (jsonList.indexOf(prescription.rxNumber) === -1) {
          this.newPrescriptionsAdded = true;
          jsonList.push(prescription.rxNumber);
        }

        localStorage.setItem(
          CHECKOUT.session.key_items_sp,
          JSON.stringify(jsonList)
        );
        break;
    }
  }

  removePrescriptionFromSession(id: string, type: string) {
    switch (type) {
      case CHECKOUT.type.HD:
        if (localStorage.getItem(CHECKOUT.session.key_items_hd) != null) {
          let json = <Array<string>>(
            JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_hd))
          );
          json = json.filter(item => {
            return item !== id;
          });

          localStorage.setItem(
            CHECKOUT.session.key_items_hd,
            JSON.stringify(json)
          );
        }
        break;

      case CHECKOUT.type.SC:
        if (localStorage.getItem(CHECKOUT.session.key_items_sp) != null) {
          let json = <Array<string>>(
            JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_sp))
          );
          json = json.filter(item => {
            return item !== id;
          });

          localStorage.setItem(
            CHECKOUT.session.key_items_sp,
            JSON.stringify(json)
          );
        }
        break;
    }
  }

  resetCheckoutStatus() {
    localStorage.removeItem(CHECKOUT.session.key_items_hd);
    localStorage.removeItem(CHECKOUT.session.key_items_sp);
    sessionStorage.removeItem(CHECKOUT.session.key_sp_data);
    sessionStorage.removeItem(CHECKOUT.session.key_hd_data);
    sessionStorage.removeItem(CHECKOUT.session.key_hd_context);
    sessionStorage.removeItem(CHECKOUT.session.combo_key);
    sessionStorage.removeItem(CHECKOUT.session.key_srx_reminder);
    sessionStorage.removeItem(CHECKOUT.session.key_sp_context);
    sessionStorage.removeItem(AppContext.CONST.hd_rr_orderinfo);
    sessionStorage.removeItem(AppContext.CONST.hd_rr_params);
  }

  initPayload() {
    this.orderPayload = <CheckoutOrderModel>{};
    this.orderPayload.submitted = true;
    this.orderPayload.allianceOrder = true;
    this.orderPayload.checkoutDetails = [];
  }

  /**
   * Get selected cards count for a given referral.
   *
   * @param referral
   * @returns {number}
   */
  countSelected(referral: any) {
    if (referral.boxDetails.shippingInfo.creditCard === undefined) {
      return 0;
    }
    return referral.boxDetails.shippingInfo.creditCard.filter(item => {
      return item.isSelected;
    }).length;
  }

  isAllPrescriptionValid(prescriptionList: any) {
    // invalid reminder id case
    this.isAllPrescriptionInvalid = true;
    this.isAnyPrescriptionInvalid = false;

    if (prescriptionList) {
      prescriptionList.forEach(precription => {
        if (precription.isValidRx === "true") {
          this.isAllPrescriptionInvalid = false;
          return false;
        } else if (precription.isValidRx === "false") {
          this.isAnyPrescriptionInvalid = true;
        }
      });

      if (this.isAnyPrescriptionInvalid === false) {
        prescriptionList.forEach(precription => {
          if (precription.isValidRx === "false") {
            this.isAnyPrescriptionInvalid = true;
            return false;
          }
        });
      }
    }
  }

  /**
   * Save all user entered details in session store for home delivery checkout review.
   *
   * @param {HomeDeliveryContext} hdContext
   * @returns {Promise<void>}
   */
  async persistHomeDeliveryContext(hdContext: HomeDeliveryContext) {
    let json = {};
    if (sessionStorage.getItem(CHECKOUT.session.key_hd_context) != null) {
      json = JSON.parse(
        sessionStorage.getItem(CHECKOUT.session.key_hd_context)
      );
      Object.assign(json, hdContext);
    } else {
      json = hdContext;
    }

    sessionStorage.setItem(
      CHECKOUT.session.key_hd_context,
      JSON.stringify(json)
    );
  }

  /**
   * Save all user entered information in session store for speciality review.
   *
   * @param {SpecialityContext} context
   * @returns {Promise<void>}
   */
  async persistSpecialityContext(context: SpecialityContext) {
    /*
    let json = {};
    if (sessionStorage.getItem(CHECKOUT.session.key_sp_context) != null) {
      json = JSON.parse(
        sessionStorage.getItem(CHECKOUT.session.key_sp_context)
      );
      Object.assign(json, context);
    } else {
      json = context;
    }

    sessionStorage.setItem(
      CHECKOUT.session.key_sp_context,
      JSON.stringify(json)
    );
    */
  }

  // async validateItemsCache() {
  //   this.prescriptions().subscribe(
  //     (response) => {

  //       if ( response.rxorders != undefined ) {
  //           response.rxorders.forEach((item) => {
  //           switch (item.prescriptionType) {
  //             case CHECKOUT.type.HD :
  //               this.storeHomeDeliveryItemsInCache(item.prescriptions);
  //               break;

  //             case CHECKOUT.type.SC :
  //               this.storeCleansedItemsCache(item.prescriptions);
  //               break;

  //             case CHECKOUT.type.SU :
  //               this.storeUnsolicitedItemsCache(item.prescriptions);
  //               break;
  //           }
  //         });
  //       }

  //     }
  //   )
  // }

  async storeHomeDeliveryItemsInCache(prescriptions: Array<any>) {
    if (
      localStorage.getItem(CHECKOUT.session.key_items_hd) == null ||
      prescriptions.length >
        JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_hd)).length
    ) {
      let json = [];
      if (localStorage.getItem(CHECKOUT.session.key_items_hd) != null) {
        json = JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_hd));
      }
      prescriptions.forEach(item => {
        if (json.indexOf(item.rxNumber) === -1) {
          json.push(item.rxNumber);
        }
      });

      localStorage.setItem(CHECKOUT.session.key_items_hd, JSON.stringify(json));
    }
  }

  async storeUnsolicitedItemsCache(prescriptions: Array<any>) {
    if (prescriptions !== undefined) {
      let json = [];
      if (localStorage.getItem(CHECKOUT.session.key_items_sp) != null) {
        json = JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_sp));
      }
      prescriptions.forEach(item => {
        if (json.indexOf(item.rxNumber) === -1) {
          json.push(item.rxNumber);
        }
      });

      localStorage.setItem(CHECKOUT.session.key_items_sp, JSON.stringify(json));
    }
  }

  async storeCleansedItemsCache(paitents: Array<any>) {
    if (paitents !== undefined) {
      let json = [];
      if (localStorage.getItem(CHECKOUT.session.key_items_sp) != null) {
        json = JSON.parse(localStorage.getItem(CHECKOUT.session.key_items_sp));
      }

      for (const index in paitents) {
        //istanbul ignore else
        if (paitents[index].prescriptionList) {
          paitents[index].prescriptionList.forEach(item => {
            //istanbul ignore else
            if (json.indexOf(item.rxNumber) === -1) {
              json.push(item.rxNumber);
            }
          });
        }
      }

      localStorage.setItem(CHECKOUT.session.key_items_sp, JSON.stringify(json));
    }
  }

  displayInsuranceMessageForHD() {
    // check if the user has reached via insurance enroll flow
    let insuranceEnroll = sessionStorage.getItem("insurance_enroll_flow");
    //istanbul ignore else
    if (insuranceEnroll) {
      insuranceEnroll = JSON.parse(insuranceEnroll);
      this._message.addMessage(
        new Message(
          // tslint:disable-next-line: max-line-length
          `${insuranceEnroll["name"]} has been successfully enrolled in Home Delivery Pharmacy. The confirmation process may take up to 24 hours and status will show as pending. During this time you can still fill a prescription.`,
          ARX_MESSAGES.MESSAGE_TYPE.INFO
        )
      );
    }
  }

  fetchAddressList() {
    const request_body = {};
    request_body["profileId"] = localStorage.getItem("uid");
    return this._http.postData(
      Microservice.mailservice_address_fetch,
      request_body
    );
  }

  updateAddressCall(selectAddress) {
    const url = Microservice.home_delivery_address_update;
    //istanbul ignore else
    if (selectAddress !== undefined) {
      this.selectAddressPayload["type"] = "HOMEDELIVERY";
      this.selectAddressPayload["subType"] = "HOMEDELIVERY";
      this.selectAddressPayload["channel"] = "DOTCOM";
      this.selectAddressPayload["channelType"] = "SIGNIN";
      this.selectAddressPayload["street"] = selectAddress.street1
        ? selectAddress.street1
        : "";
      this.selectAddressPayload["city"] = selectAddress.city
        ? selectAddress.city
        : "";
      this.selectAddressPayload["state"] = selectAddress.state
        ? selectAddress.state
        : "";
      this.selectAddressPayload["zip"] = selectAddress.zipCode
        ? selectAddress.zipCode
        : "";
      this._http.postData(url, this.selectAddressPayload).subscribe(
        result => {},
        error => {
          this.updateAddressCallError();
        }
      );
    }
  }
  updateAddressCallFromReview(selectAddress) {
    selectAddress = selectAddress[0].boxDetails.shippingInfo.deliveryAddr;
    const url = Microservice.home_delivery_address_update;
    //istanbul ignore else
    if (selectAddress !== undefined) {
      this.selectAddressPayload["type"] = "HOMEDELIVERY";
      this.selectAddressPayload["subType"] = "HOMEDELIVERY";
      this.selectAddressPayload["channel"] = "DOTCOM";
      this.selectAddressPayload["channelType"] = "SIGNIN";
      this.selectAddressPayload["street"] = selectAddress.streetAddr
        ? selectAddress.streetAddr
        : "";
      this.selectAddressPayload["city"] = selectAddress.city
        ? selectAddress.city
        : "";
      this.selectAddressPayload["state"] = selectAddress.state
        ? selectAddress.state
        : "";
      this.selectAddressPayload["zip"] = selectAddress.zip
        ? selectAddress.zip
        : "";
      this._http.postData(url, this.selectAddressPayload).subscribe(
        result => {},
        error => {
          this.updateAddressCallError();
        }
      );
    }
  }

  fetchHealthHistory() {
    this._http
      .postData(Microservice.health_history_retrieve, {
        flow: "ARX"
      })
      .subscribe(
        response => {
          this.loaderState = false;
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
        },
        error => {
          this.onfetchHealthHistoryInfoError();
        }
      );
  }

  async fetchHealthHistoryInfoArray(res, response) {
    response.healthInfo = [res];
    this._message.notifyHealthInfo([res]);
  }

  async fetchHealthHistoryInfo() {
    this._http
      .postData(Microservice.health_history_retrieve, {
        flow: "ARX"
      })
      .subscribe(
        response => {
          this.loaderState = false;
          this.history = <any>{};
          if (response.message) {
            this._message.addMessage(
              new Message(
                response.message.message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            if (!response.healthInfo) {
              response.healthInfo.additionalMeds = [];
              response.healthInfo.healthConditions = [];
              response.healthInfo.drugAllergies = [];
            } else {
              response.healthInfo.additionalMeds =
                response.healthInfo.additionalMeds || [];
              response.healthInfo.healthConditions =
                response.healthInfo.healthConditions || [];
              response.healthInfo.drugAllergies =
                response.healthInfo.drugAllergies || [];
            }
          }
          // localStorage.setItem("healthInfoData",JSON.stringify(response));
          this.healthInfoData = response;
          // return response;
        },
        () => {
          this.onfetchHealthHistoryInfoError();
        }
      );
  }
  getCheckoutType(): any {
    // Adding all selected prescriptions view ids in request data
    let isMail = false;
    const isUnsolicited = false;
    let isCleansed = false;
    let checkOutType;
    let selectedPrescriptionsList: Array<Prescription> = [];
    selectedPrescriptionsList = <Array<Prescription>>(
      JSON.parse(localStorage.getItem("selectedPrescriptionsList"))
    );
    selectedPrescriptionsList.forEach(prescription => {
      switch (prescription.prescriptionType) {
        case "mail":
          isMail = true;
          break;
        case "specialty":
          isCleansed = true;
          break;
      }
    });

    if (isMail && isCleansed) {
      checkOutType = "checkout_combined";
    } else if (isMail && !isCleansed) {
      checkOutType = "checkout_hd";
    } else if (!isMail && isCleansed) {
      checkOutType = "checkout_sp";
    } else {
      checkOutType = "checkout_default";
    }
    return checkOutType;
  }

  getInsuranceStatus(): any {
    const requestData = {};
    return this._http.postData(Microservice.user_insurance_status, requestData);
  }

  fetchInsuranceStatusData() {
    const requestData = {};
    this._http
      .postData(Microservice.user_insurance_status, requestData)
      .subscribe(response => {
        //istanbul ignore else
        if (response.insuranceOnFile !== undefined) {
          this.insuranceOnData = response.insuranceOnFile;
          localStorage.setItem("insuranceOnData", this.insuranceOnData);
        }
      });
  }

  updateAddressCallError() {
    this._message.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
  onfetchHealthHistoryInfoError() {
    this.loaderState = false;
    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  checkPaymentInfo(patient) {
    let state = true;
    patient.referrals.forEach((referral, index) => {
      if (
        referral.messages !== undefined &&
        referral.messages.code === "WAG_E_SRX_PAYMENTS_001"
      ) {
        //Empty block
      }
      else {
        if (referral.noPaymentDue) {
          state = true;
          return;
        }
        if (referral.boxDetails.shippingInfo.creditCard === undefined) {
          state = false;
          return;
        }
        if (this.countSelected(referral) === 0) {
          state = false;
          return;
        }

        for (const i in referral.boxDetails.shippingInfo.creditCard) {
          if (
            referral.boxDetails.shippingInfo.creditCard[i].dueNowValid !==
              undefined &&
              referral.boxDetails.shippingInfo.creditCard[i].dueNowValid === false
          ) {
            state = false;
            return;
          }
        }
      }
    });

    return state;
  }

  getPatientIdBySmId(smId: string): Observable<any> {
    return this._http.postData(Microservice.scriptmed_linkage, {smIds: [smId]})
  }

  /**
   * Remove Holidays from Available Delivery Date List
   * @param availableDates
   */
  removeHolidays(availableDates) {
    const thanksgivingDate = year => {
      const lastOfNov = new Date(year, 10, 30).getDay();
      return (lastOfNov >= 4 ? 34 : 27) - lastOfNov;
    }
    if (availableDates && availableDates.length > 0) {
      const currentYear = availableDates[0].substring(6, 10);
      return availableDates.filter(date =>
        !date.startsWith('12/25') &&
        !date.startsWith('01/01') &&
        !date.startsWith(`11/${thanksgivingDate(currentYear)}`)
      );
    } else {
      return availableDates;
    }
  }
}
