import { AfterViewInit, Component } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';
import { ARX_MESSAGES, CoreConstants, KEYS, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CleansedPayloadModel } from '@app/models/checkout/cleansed-payload.model';
import { CHECKOUT } from '@app/config/checkout.constant';
import { ReminderService } from '@app/pages/refill-reminder/reminder.service';
import { PARAM } from '@app/config/param.constant';
import { UserService } from '@app/core/services/user.service';
import { Microservice } from '@app/config/microservice.constant';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { DatePipe } from '@angular/common';
import { RefillReminderService } from '@app/core/services/refill-reminder.service';

@Component({
  selector: 'arxrf-srefill-reminder-base',
  templateUrl: './reminder-base.component.html',
  styleUrls: ['./reminder-base.component.scss']
})
export class ReminderBaseComponent implements AfterViewInit {
  loader = true;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;

  routes = ROUTES;

  isInvalidId = false;
  invalidUser: boolean;
  isSessionExpiredErrMessage = false;
  familyMemberInfo = {
    isFM: false,
    fid: ''
  }

  // tslint:disable-next-line: max-line-length
  invalidErrorMessage = `The referral information does not match. If you have any question, please contact us at toll-free number ${this.appContext.tollFreeContact}`;

  allreadyUsedIdMessage = 'This refill order has already been processed.';

  refillResponse: any;

  private refillRequest = {
    referralId: '',
    smId: '',
    login: '',
    flowType: '',
    pageRefresh: 'false'
  };

  cleansedIndex: number;

  constructor(
    public appContext: AppContext,
    private router: Router,
    private _http: HttpClientService,
    private _message: MessageService,
    public _checkoutService: CheckoutService,
    private _common: CommonUtil,
    public speciality: ReminderService,
    private _router: Router,
    private _gaService: GaService,
    public userService: UserService,
    private _route: ActivatedRoute,
    private _datePipe: DatePipe
  ) {
    this._route.queryParams.subscribe(params => {
      this.refillRequest.referralId = params.referralId;
      this.refillRequest.smId = params.smId;
      this.refillRequest.login = params.login;
      this.refillRequest.flowType = params.type;
      const pageRefresh = sessionStorage.getItem(KEYS.review_page_refresh);
      this.refillRequest.pageRefresh = (pageRefresh === "true") ? pageRefresh : 'false';
      
      const isSpecialityRefillRemainder =
        params.referralId !== undefined &&
        params.smId !== undefined &&
        params.type !== undefined
          ? 'true'
          : 'false';
      localStorage.setItem(
        'isSpecialityRefillRemainder',
        isSpecialityRefillRemainder
      );
    });
  }

  sendParameterForReminder(): void {
    let healthHistoryInfo = <any>{};
    let healthHistoryRequestPayload = { flow: 'ARX' };
    this.loader = true;
    this.loaderOverlay = true;

    if (this.familyMemberInfo.isFM) {
      this.refillRequest["fid"] = this.familyMemberInfo.fid;
      healthHistoryRequestPayload["fId"] = this.familyMemberInfo.fid;
    }
    this._http
      .postData(Microservice.health_history_retrieve, healthHistoryRequestPayload)
      .subscribe(
        response => {
          if (response.message !== undefined) {
            this._message.addMessage(
              new Message(
                response.message.message,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
          healthHistoryInfo = response.healthInfo;
          this._http.postData(Microservice.checkout_review, this.refillRequest).subscribe(
            response => {
              this.handleRefillReminderErrors(response);
              if (!!response && !!response.checkoutDetails && response.checkoutDetails.length > 0) {
                this.addHealthInfo(response.checkoutDetails, healthHistoryInfo);
                this.refillResponse = response;
                this._checkoutService.exists.cleansed = true;
                this._checkoutService.storeCleansedItemsCache(
                  response.checkoutDetails
                );
                // this.userService.updateCartRxCount();
              }
              this.loader = false;
              this.loaderOverlay = false;
            },
            error => {
              this.onsendParameterForReminderError();
            }
          );
        },
        error => {
          this.onsendParameterForReminderError();
        }
      );
  }

  handleRefillReminderErrors(response: any) {
    // invalid reminder id case
    if (!!response && !!response.messages && response.messages.length > 0) {
      this.isInvalidId = true;
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
      } else if (response.messages[0].code === 'WAG_RXCHECKOUT_002') {
        this.isSessionExpiredErrMessage = true;
        this.isInvalidId = false;
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
    if ( !!response && !!response.code ) {
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
      }
    }

    if (
      response &&
      response.checkoutDetails &&
      response.checkoutDetails[0].prescriptionList
    ) {
      const invalidPrescriptions = this.iSValidPrescriptions(
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
      }
    }
  }

  iSValidPrescriptions(prescriptions) {
    if (prescriptions) {
      const prescriptionList = prescriptions.filter(function(prescription) {
        return (
          prescription.messages &&
          prescription.messages[0].code === 'WAG_RXHOMEDELIVERY_001'
        );
      });
      return prescriptionList.length ? true : false;
    }
    return false;
  }

  ngAfterViewInit(): void {
    this.veryfyActiveUser().then(result => {
      if (result) {
        this.familyMemberInfo.isFM = true;
        this.familyMemberInfo.fid = result.toString();
      }
      this.sendParameterForReminder();
    })
  }

  /**
   * looping from  all patients available in speciality service patientsPayload and test each one
   * for all the validations.
   *
   * if invalid found then set cleansed state false in checkout service.
   */
  validateCleansedData() {
    if (
      this.speciality.patientsPayload !== undefined &&
      this.speciality.patientsPayload.length > 0
    ) {
      // tslint:disable-next-line: forin
      for (const index in this.speciality.patientsPayload) {
        const state = this.validateSinglePatient(
          this.speciality.patientsPayload[index]
        );
        if (!state) {
          this._checkoutService.valid.cleansed = false;
          this._checkoutService.error_state.cleansed = true;
          return;
        } else {
          this._checkoutService.valid.cleansed = true;
        }
      }
    }
  }

  async veryfyActiveUser() {
    const loggedUser = localStorage.getItem(AppContext.CONST.uidStorageKey);
    return await new Promise(resolve => {
      this._checkoutService.getPatientIdBySmId(this.refillRequest.smId).subscribe(res => {
        if (res.SMLinkages && res.SMLinkages.length > 0) {
          if (loggedUser != res.SMLinkages[0].profileId) {
            resolve(res.SMLinkages[0].profileId)
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      })
    })
  }

  /**
   * All the validations we need for a patient for be a valid order.
   *
   * @param patient
   */
  validateSinglePatient(patient) {
    const state = true;
    // checking if health information checkbox is clicked.
    if (!patient.healthInfoChecked) {
      return false;
    }

    // checking if clinical review section options are selected.
    if (
      patient.clinical_review.assistance === ''
    ) {
      return false;
    }

    // check payment information
    if (!this._checkoutService.checkPaymentInfo(patient)) {
      return false;
    }

    // check address information.
    patient.referrals.forEach((item, index) => {
      /*if ( item.shippingInfo.address == undefined ) {
        return false;
      }*/

      if (item.selectedAddress === undefined) {
        return false;
      }

      if (
        item.boxDetails.shippingInfo.selectedDate === undefined &&
        (item.callMeReasons.prefDelDtNotAvailable === undefined ||
          !item.callMeReasons.prefDelDtNotAvailable)
      ) {
        return false;
      }
    });

    // check health information.
    if (!this.checkHealthInfo(patient)) {
      return false;
    }

    // check final confirmation.
    if (!patient.termsAndConditions) {
      return false;
    }

    return true;
  }

  /**
   * checking health information provided by user.
   * if no information added then will check if confirmation checkbox it clicked.
   *
   * @param patient
   * @returns {boolean}
   */
  checkHealthInfo(patient) {
    if (
      patient.healthInfo === undefined &&
      (!patient.nohealthConditions ||
        !patient.nodrugAllergies ||
        !patient.noadditionalMedication)
    ) {
      return false;
    }

    if (
      !patient.healthInfo.additionalMedication &&
      !patient.noadditionalMedication
    ) {
      return false;
    }

    if (!patient.healthInfo.healthConditions && !patient.nohealthConditions) {
      return false;
    }

    if (!patient.healthInfo.drugAllergies && !patient.nodrugAllergies) {
      return false;
    }

    return true;
  }

  /**
   * filter patient data before adding in payload.
   * removing payby handler for referrals and adding callmeoptions
   * in all referrals.
   * removing callmeoptions from patient.
   *
   * removing health information related checkbox properties.
   *
   * @param data
   * @returns {any}
   */
  filterPatientData(data) {
    const patient = JSON.parse(JSON.stringify(data));
    // tslint:disable-next-line: forin
    for (const index in patient.referrals) {
      patient.referrals[index].callMeReasons = Object.assign(
        patient.referrals[index].callMeReasons,
        data.callMeReasons
      );
      patient.referrals[index].clinical_review = data.clinical_review;
      delete patient.referrals[index].payBy;
      patient.referrals[index].isRefillReqCorrect = false;
      this.filterCreditcardDetails(patient.referrals[index].creditCards);
    }
    delete patient.clinical_review;
    delete patient.callMeReasons;
    delete patient.noadditionalMedication;
    delete patient.nohealthConditions;
    delete patient.nodrugAllergies;
    delete patient.add_update_svc_status;
    return patient;
  }

  filterCreditcardDetails(creditcards) {
    if (creditcards) {
      creditcards.forEach(item => {
        delete item.firstName;
        delete item.lastName;
        delete item.billingInfo;
        delete item.isDefault;
        delete item.isActive;

        let year = item.expiryYear;
        if (item.expiryYear.length > 2) {
          year = item.expiryYear.substring(2, item.expiryYear.length);
        }

        item.expdate = `${item.expiryMonth}/${year}`;
        delete item.expiryMonth;
        delete item.expiryYear;
      });
    }
  }

  /**
   * prepare checkout payload for cleased order and add in checkout payload
   */
  initCleansedPayload() {
    if (this.refillResponse !== undefined) {
      this._checkoutService.initPayload();
      const c_payload = <CleansedPayloadModel>{};
      const cdata = JSON.parse(
        JSON.stringify(this.refillResponse.checkoutDetails[0])
      );

      c_payload.prescriptionType = 'specialtyCleansed';
      c_payload.localSpecialty = false;
      c_payload.submittedToMsgQueue = cdata.submittedToMsgQueue;
      c_payload.customercare = cdata.customercare;
      c_payload.patient = [];

      if (this.speciality.patientsPayload) {
        this.speciality.patientsPayload.forEach(item => {
          // adding patient data in payload after filtering it.
          c_payload.patient.push(this.filterPatientData(item));
        });
      }

      this._checkoutService.orderPayload.checkoutDetails.push(c_payload);
      this.cleansedIndex =
        this._checkoutService.orderPayload.checkoutDetails.length - 1;
    }
  }

  submitSrxReminderOrder() {
    if (this.refillResponse !== undefined) {
      this.validateCleansedData();
    }

    if (this.refillResponse !== undefined) {
      if (this._checkoutService.valid.cleansed) {
        this._checkoutService.submit_state.cleansed = true;
      } else {
        this._checkoutService.submit_state.cleansed = false;
      }
    } else {
      this._checkoutService.submit_state.cleansed = true;
    }

    if (this._checkoutService.submit_state.cleansed) {
      this.furtherSubmitProcess();
    }
  }

  /**
   * further process speciality order and submit order for confirmation.
   */
  furtherSubmitProcess() {
    this.initCleansedPayload();
    sessionStorage.setItem(
      CHECKOUT.session.key_sp_data,
      JSON.stringify(this._checkoutService.orderPayload.checkoutDetails)
    );
    const OrderPayloadRequest = this.prepareOrderPayloadRequest(
      this._checkoutService.orderPayload.checkoutDetails
    );
    this.proceedToFinalSubmission(OrderPayloadRequest);
  }

  proceedToFinalSubmission(checkoutPayload) {
    this.loader = true;
    this.loaderOverlay = true;

    this._http
      .postData(Microservice.checkout_submit, checkoutPayload)
      .subscribe(
        res => {
          if (res.orderid || res.checkoutDetails.length > 0) {
            this._checkoutService.submitOrderPayload = res; // setting res to use in order-success.component

            // sending review event for speciality checkout.
            this._gaService.sendEvent(this.gaEvent());
            sessionStorage.removeItem(CHECKOUT.session.key_sp_context);
            sessionStorage.setItem(CHECKOUT.session.key_srx_reminder, 'true');
            this._router.navigateByUrl(
              ROUTES.checkout_sp.children.confirmation.absoluteRoute
            );
            this.loader = false;
            this.loaderOverlay = false;
          } else {
            window.scroll(0, 0);
            this._message.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
            this.loader = false;
            this.loaderOverlay = false;
          }
        },
        err => {
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );

          this.loader = false;
          this.loaderOverlay = false;
        }
      );
  }

  prepareOrderPayloadRequest(payload) {
    // tslint:disable-next-line: prefer-const
    let finalReqPayload = { checkoutDetails: [] },
      tempReq;
    for (let i = 0; i < payload.length; i++) {
      const orderReq = payload[i];
      if (
        orderReq.prescriptionType &&
        orderReq.prescriptionType === 'specialtyCleansed'
      ) {
        // cleaned payload
        for (const index in orderReq.patient) {
          orderReq.patient[index].referrals.forEach(referral => {
          tempReq = {
            type: 'SPECIALTY',
            subType: 'CLEANSED',
            flowType: '163',
            channel: 'RR_EMAIL',
            channelType: 'SIGNIN',
            scriptMedId: referral.scriptMedId,
            referralId: referral.referralId,
            creditCardList: this.generateSelectedCC(
              referral.boxDetails.shippingInfo.creditCard
            ),
            selectedDate: this._datePipe.transform(
              referral.boxDetails.shippingInfo.selectedDate.substring(0, 10),
              'EEE, LLL dd, yyyy'
            ),
            callMeReason: {
              prefDelDtNotAvailable: referral.callMeReasons.prefDelDtNotAvailable.toString(),
              pharmCounsilQtn: referral.clinical_review.pharmacistContact === 'true'
                ? 'true'
                : 'false',
              insuranceBillQtn: referral.callMeReasons.insuranceBillQtn.toString(),
              newInsurance: referral.callMeReasons.newInsurance.toString(),
              prescNotVisible: referral.callMeReasons.prescNotVisible.toString(),
              prscQty: referral.callMeReasons.prscQty.toString(),
              prescChange: referral.callMeReasons.prescChange.toString(),
              reqDiffPresc: referral.callMeReasons.reqDiffPresc.toString(),
              notes: referral.callMeReasons.notes,
              other: referral.callMeReasons.other.toString()
            }
          };
          /* let isReqToRemovePresc = this.getReqToRemovePresc(referral.prescriptionList);
          if(isReqToRemovePresc.length > 0) {
            tempReq.prescription = isReqToRemovePresc;
          }*/

          finalReqPayload.checkoutDetails.push(tempReq);
        });
      }
      } /*else if(orderReq.type && orderReq.type == "SPECIALTY" && orderReq.subType == "UNSOLICITED") {    // unsolicited payload
        tempReq = {
          "type": "SPECIALTY",
          "subType": "UNSOLICITED",
          "flowType": "DOTCOM",
          "channel": "RR_EMAIL",
          "channelType": "SIGNIN",
          "selectedDate": orderReq.boxDetails.shippingInfo.selectedDate
        };
        if(this.unsolicited.boxDetails.shippingInfo.addressForm) {
          let adr = this.unsolicited.boxDetails.shippingInfo.addressForm;
          tempReq.address = {
            "street1": adr.street1,
            "city": adr.city,
            "state": adr.state,
            "zip": adr.zipCode,
            "zipExt": adr.zipCodeOptional,
            "type": adr.reasonForNewAddress
          }
        }
        finalReqPayload.checkoutDetails.push(tempReq);
      } else if(orderReq.type && orderReq.type == "HOMEDELIVERY"){              // HD payload
        tempReq = {
          "type": "HOMEDELIVERY",
          "flowType": "153",
          "subType": "HOMEDELIVERY",
          "channel": "DOTCOM",
          "channelType": "SIGNIN",
          "address": {
            "shipMethod": orderReq.boxDetails.shippingInfo.selectedShippingOption
          }
        };
        if(this._checkoutService.needHDCreditCard) {
          tempReq.creditCard = { "saveAsExpressPay ": orderReq.boxDetails.shippingInfo.creditCard.saveAsExpressPay };
        }
        finalReqPayload.checkoutDetails.push(tempReq);
      }*/
    }

    return finalReqPayload;
  }

  generateSelectedCC(creditCard) {
    if (creditCard && creditCard.length) {
      const cc = [];
      for (let i = 0; i < creditCard.length; i++) {
        if (creditCard[i].isSelected) {
          cc.push({
            paymentMethodId: creditCard[i].paymentMethodId,
            dueNow: creditCard[i].dueNow
          });
        }
      }
      return cc;
    }
  }

  gaEvent() {
    const event = <GAEvent>{};
    event.category = this._checkoutService.isCombo
      ? GA.categories.checkout_combo
      : GA.categories.checkout_speciality;
    event.action = this._checkoutService.isCombo
      ? GA.actions.checkout_combo.review_speciality
      : GA.actions.checkout_speciality.review;
    return event;
  }

  addHealthInfo(checkoutDetails: any, healthHistoryInfo: any) {
    if (checkoutDetails) {
      checkoutDetails.forEach((item, index) => {
        const healthInfo = <any>{
          additionalMedication: [],
          healthConditions: [],
          drugAllergies: []
        };
        const {
          additionalMeds = null,
          drugAllergies = null,
          healthConditions = null
        } = healthHistoryInfo || {};
        healthInfo.additionalMedication = additionalMeds;
        healthInfo.drugAllergies = drugAllergies;
        healthInfo.healthConditions = healthConditions;
        checkoutDetails[index].healthInfo = healthInfo;

        /* if (checkoutDetails[index].healthInfo == undefined) {
            checkoutDetails[index].healthInfo = <any>{};

            checkoutDetails[index].healthInfo.additionalMedication = [];
            checkoutDetails[index].healthInfo.healthConditions = [];
            checkoutDetails[index].healthInfo.drugAllergies = [];

            checkoutDetails[index].healthInfo.additionalMedication = healthHistoryInfo.additionalMeds;
            checkoutDetails[index].healthInfo.drugAllergies = healthHistoryInfo.drugAllergies;
            checkoutDetails[index].healthInfo.healthConditions = healthHistoryInfo.healthConditions;
          } else {
            checkoutDetails[index].healthInfo.additionalMedication = healthHistoryInfo.additionalMeds;
            checkoutDetails[index].healthInfo.drugAllergies = healthHistoryInfo.drugAllergies;
            checkoutDetails[index].healthInfo.healthConditions = healthHistoryInfo.healthConditions;
          }*/
      });
    }
  }

  logoutAction() {
    sessionStorage.setItem(
      AppContext.CONST.login_callback_urlkey,
      `${window.location.pathname}${window.location.search}`
    );
    this._router.navigateByUrl('/logout');
  }
  onsendParameterForReminderError() {
    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );    
    this._common.navigate(ROUTES.refill.absoluteRoute);
    this.loader = false;
    this.loaderOverlay = false;
  }
}
