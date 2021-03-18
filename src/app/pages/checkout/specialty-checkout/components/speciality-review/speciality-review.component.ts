import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppContext } from "@app/core/services/app-context.service";
import {
  ARX_MESSAGES,
  CoreConstants,
  ROUTES,
  STATE_US,
  Microservice
} from "@app/config";
import { Message, Address } from "@app/models";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { CheckoutService } from "@app/core/services/checkout.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { UnsolicitedPayloadModel } from "@app/models/checkout/unsolicited-payload.model";
import { CheckoutOrderModel } from "@app/models/checkout-order.model";
import { CleansedPayloadModel } from "@app/models/checkout/cleansed-payload.model";
import { CHECKOUT } from "@app/config/checkout.constant";
import { SpecialityService } from "@app/pages/checkout/specialty-checkout/speciality.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PARAM } from "@app/config/param.constant";
import { GAEvent } from "@app/models/ga/ga-event";
import { GA } from "@app/config/ga-constants";
import { GaService } from "@app/core/services/ga-service";
import { generate } from "rxjs/observable/generate";
import { UserService } from "@app/core/services/user.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "arxrf-checkout-speciality",
  templateUrl: "./speciality-review.component.html",
  styleUrls: ["./speciality-review.component.scss"]
})
export class SpecialityReviewComponent implements OnInit {
  @Input()
  cleansed: any;

  @Input()
  unsolicited: any;

  cleansedIndex: number;

  unlockErrors = false;

  ROUTES = ROUTES;

  STATE_US = STATE_US;

  unsolicitedAddressForm: FormGroup;

  constructor(
    public appContext: AppContext,
    private router: Router,
    private _http: HttpClientService,
    private _messageService: MessageService,
    public _checkoutService: CheckoutService,
    private _common: CommonUtil,
    public speciality: SpecialityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _gaService: GaService,
    private _userService: UserService,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this._checkoutService.currentComboNavState = CHECKOUT.comboState.speciality;
    this.initPayloads();
    if (this.unsolicited) {
      this.unsolicited.boxDetails.shippingInfo.availableDates =
        this._checkoutService.removeHolidays(this.unsolicited.boxDetails.shippingInfo.availableDates);
      this.unsolicited.boxDetails.shippingInfo.selectedDate = this.unsolicited.boxDetails.shippingInfo.availableDates[0];
      this.loadUnsolicitedContext();
    }
  }

  /**
   * Remove unsolicited prescription from cart.
   *
   * @param {string} viewId
   */
  removePrescription(rxnumber, index, id) {
    this._gaService.sendEvent(
      this.gaCommonEvent("/specialty-checkout", "Remove referral")
    );
    // let api = '/svc/rxorders/retail/prescriptions/' + id;
    const api = Microservice.remove_rx;
    this._checkoutService.loader = true;
    this._checkoutService.loaderOverlay = true;

    const post_data = { rxId: [id] };

    this._http.postData(api, post_data).subscribe(
      response => {
        if (response === true) {
          // handle success removeRx
          this._checkoutService.storeReviewRefresh("true");
          this._checkoutService.deliveryOptions().subscribe(
            res => {
              this._checkoutService.loader = false;
              this._checkoutService.loaderOverlay = false;

              if (res.checkoutDetails) {
                const info = res.checkoutDetails.find(item => {
                  return (
                    item.type === "SPECIALTY" && item.subType === "UNSOLICITED"
                  );
                });
                if (!res.checkoutDetails.length) {
                  this._common.navigate(ROUTES.refill.absoluteRoute);
                }
                if (info === undefined) {
                  this.unsolicited = undefined;
                  this._checkoutService.removePrescriptionFromSession(
                    rxnumber,
                    CHECKOUT.type.SC
                  );
                  sessionStorage.removeItem(
                    CHECKOUT.session.key_speciality_addresses
                  );
                  if (this._checkoutService.isCombo) {
                    sessionStorage.removeItem(CHECKOUT.session.key_hd_data);
                    sessionStorage.removeItem(CHECKOUT.session.combo_key);
                    this._checkoutService.isCombo = false;
                    if (!res.specialtyCombo) {
                      this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
                    } else {
                      this._checkoutService.isCombo = true;
                    }
                  }
                } else {
                  if (
                    this.unsolicited.prescriptionList.length ===
                    info.prescriptionList.length
                  ) {
                    this._messageService.addMessage(
                      new Message(
                        "Unable to remove prescription, please try again after some time",
                        ARX_MESSAGES.MESSAGE_TYPE.ERROR
                      )
                    );
                  } else {
                    this.unsolicited.prescriptionList = info.prescriptionList;
                    this._checkoutService.removePrescriptionFromSession(
                      rxnumber,
                      CHECKOUT.type.SC
                    );
                  }
                }
              } else if (res.messages) {
                this._messageService.addMessage(
                  new Message(
                    "Unable to remove prescription, please try again after some time",
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              } else {
                this.unsolicited.prescriptions = [];
                localStorage.removeItem(CHECKOUT.session.key_items_sp);
                this._common.navigate(ROUTES.refill.absoluteRoute);
              }
            },
            err => {
              this.ondeliveryOptionsError();
            }
          );
        } else {
          // if removeRx response error
          this._checkoutService.loader = false;
          this._checkoutService.loaderOverlay = false;
          this._messageService.addMessage(
            new Message(
              "Unable to remove prescription, please try again after some time",
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      },
      err => {
        this.ondeliveryOptionsError();
      }
    );
  }

  initPayloads() {
    this._checkoutService.loader = true;
    if (this._checkoutService.data_deliveryOptions) {
      this.unsolicited = this._checkoutService.data_deliveryOptions.checkoutDetails.find(
        item => {
          return item.subType === CHECKOUT.type.SU;
        }
      );
      this.cleansed = this._checkoutService.data_deliveryOptions.checkoutDetails.find(
        item => {
          return item.subType === CHECKOUT.type.SC;
        }
      );
    }
    const updatePrescriptions = () => {
      if (this.unsolicited !== undefined) {
        this._checkoutService.storeUnsolicitedItemsCache(
          this.unsolicited.prescriptionList
        );
      }

      if (this.cleansed !== undefined) {
        this._checkoutService.storeUnsolicitedItemsCache(
          this.cleansed.prescriptionList
        );
      }

      const healthInfoDetails = this._checkoutService.data_deliveryOptions
        .healthInfo;
      const cdata = this._checkoutService.data_deliveryOptions.checkoutDetails.filter(
        item => {
          return item.subType === CHECKOUT.type.SC;
        }
      );
      if (cdata && cdata.length > 0) {
        const uniquePatients = [];
        this.cleansed = {
          patient: []
        };
        cdata.forEach(item => {
          if (item.scriptMedId) {
            if (uniquePatients.indexOf(item.scriptMedId) === -1) {
              uniquePatients.push(item.scriptMedId);
            }
          }
        });

        uniquePatients.forEach(scriptMedId => {
          const patientObject = {
            scriptMedId: scriptMedId,
            referrals: [],
            meId: "",
            healthInfo: {}
          };
          cdata.forEach(item => {
            if (item.scriptMedId === scriptMedId) {
              patientObject.referrals.push(item);
              patientObject.meId = item.meId;
            }
          });
          if (healthInfoDetails !== undefined) {
            patientObject.healthInfo = healthInfoDetails;
          }
          this.cleansed.patient.push(patientObject);
        });

        // sort cleansed prescriptions - make admin prescription the first one
        const currentUserId = window.localStorage.getItem("uid");
        this.cleansed.patient.sort(function(a, b) {
          if (currentUserId === a.meId) {
            return -1;
          } else if (currentUserId === b.meId) {
            return 1;
          }
        });

        this._checkoutService.storeCleansedItemsCache(this.cleansed.patient);
      }
    };

    if (this._checkoutService.data_deliveryOptions === undefined) {
      this._checkoutService.deliveryOptions().subscribe(
        response => {
          this._checkoutService.loader = false;
          this._checkoutService.data_deliveryOptions = response;
          updatePrescriptions();
        },
        error => {
          this._checkoutService.loader = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    } else {
      this._checkoutService.loader = false;
      updatePrescriptions();
    }
    if (
      this.unsolicited !== undefined &&
      this.unsolicited.boxDetails.shippingInfo.srxDeliveryAddr === undefined
    ) {
      this.unsolicitedAddressForm = this._formBuilder.group({
        street1: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
        city: ["", Validators.required],
        state: ["", Validators.required],
        zipCode: ["", Validators.required],
        zipCodeOptional: [""],
        reasonForNewAddress: ["", Validators.required]
      });
    } else if (this.unsolicited !== undefined) {
      this.unsolicited.boxDetails.shippingInfo.selectedAddress = this.unsolicited.boxDetails.shippingInfo.srxDeliveryAddr.find(
        item => {
          return item.preferred;
        }
      );
    }
  }

  /**
   * action on submit order click.
   */
  submitSpecialityOrder() {
    this.unlockErrors = true;
    if (this.unsolicited) {
      this.validateUnsolicitedData();
    }

    if (this.cleansed) {
      this.validateCleansedData();
    }

    if (this.unsolicited) {
      if (this._checkoutService.valid.unsolicited) {
        this._checkoutService.submit_state.unsolicited = true;
      } else {
        this._checkoutService.submit_state.unsolicited = false;
      }
    } else {
      this._checkoutService.submit_state.unsolicited = true;
    }

    if (this.cleansed) {
      if (this._checkoutService.valid.cleansed) {
        this._checkoutService.submit_state.cleansed = true;
      } else {
        this._checkoutService.submit_state.cleansed = false;
      }
    } else {
      this._checkoutService.submit_state.cleansed = true;
    }

    if (
      this._checkoutService.submit_state.unsolicited &&
      this._checkoutService.submit_state.cleansed
    ) {
      this.furtherSubmitProcess();
    }

    // scroll to error
    this.scrollToError();
  }

  /**
   * Validate all parameters required for unsolicited order submission.
   */
  validateUnsolicitedData() {
    if (
      this.unsolicited.boxDetails.shippingInfo.selectedAddress === undefined
    ) {
      if (this.unsolicitedAddressForm.invalid) {
        this._common.validateForm(this.unsolicitedAddressForm);
        this._checkoutService.valid.unsolicited = false;
        return;
      } else {
        this.unsolicited.boxDetails.shippingInfo.addressForm = this.unsolicitedAddressForm.value;
      }
    }
    if (
      (this.unsolicited.boxDetails.shippingInfo.selectedAddress !== undefined ||
        this.unsolicited.boxDetails.shippingInfo.addressForm !== undefined) &&
      this.unsolicited.boxDetails.shippingInfo.selectedDate !== undefined
    ) {
      this._checkoutService.valid.unsolicited = true;
    }
  }

  /**
   * further process speciality order and submit order for confirmation.
   */
  furtherSubmitProcess() {
    this._checkoutService.initPayload();
    // adding unsolicited payload.
    if (this.unsolicited) {
      this.unsolicited.faxDetails = {
        "12314": "8775617784",
        "15438": "8883173799",
        "15443": "8003714538",
        "15625": "8442832231",
        "15626": "8442832231",
        "15627": "8442832231",
        "16280": "8442832231",
        "16287": "8664229811",
        "16568": "8778283939"
      };
      this.unsolicited.needDate = this._datePipe.transform(
        this.unsolicited.boxDetails.shippingInfo.selectedDate.substring(0, 10),
        "EEE, LLL dd, yyyy"
      );
      this._checkoutService.orderPayload.checkoutDetails.push(this.unsolicited);
    }
    if (this.cleansed) {
      this.initCleansedPayload();
    }

    // save data in session store
    sessionStorage.setItem(
      CHECKOUT.session.key_sp_data,
      JSON.stringify(this._checkoutService.orderPayload.checkoutDetails)
    );

    if (this._checkoutService.isCombo) {
      const hdData = JSON.parse(
        sessionStorage.getItem(CHECKOUT.session.key_hd_data)
      );
      this._checkoutService.orderPayload.checkoutDetails.push(hdData);
      if (hdData.boxDetails.shippingInfo.isCreditCardChanged === true) {
        this._checkoutService.needHDCreditCard = true;
        this._checkoutService.hdCCReqPayload =
          hdData.boxDetails.shippingInfo.hdCCReqPayload;
      }
    }

    this._checkoutService.loader = true;
    this._checkoutService.loaderOverlay = true;
    const OrderPayloadRequest = this.prepareOrderPayloadRequest(
      this._checkoutService.orderPayload.checkoutDetails
    );

    if (this._checkoutService.needHDCreditCard) {
      this._userService
        .getCCToken(this._checkoutService.hdCCReqPayload)
        .subscribe(
          res => {
            if (res.tokenDetails[0].transactionId) {
              // update transactionId in  HD ccDetails in orderPayloadRequest
              OrderPayloadRequest.checkoutDetails.forEach(function(order) {
                if (order.type === "HOMEDELIVERY") {
                  order.creditCard.transactionId =
                    res.tokenDetails[0].transactionId;
                }
              });
              // proceed to final submission
              this.proceedToFinalSubmission(OrderPayloadRequest);
            } else {
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
            this._checkoutService.loader = false;
            this._checkoutService.loaderOverlay = false;
          },
          err => {
            this.ondeliveryOptionsError();
          }
        );
    } else {
      this.proceedToFinalSubmission(OrderPayloadRequest);
    }
  }

  proceedToFinalSubmission(checkoutPayload) {
    // let api = '/svc/rxorders';
    // this._checkoutService.loader = true;
    // this._checkoutService.loaderOverlay = true;

    this._http
      .postData(Microservice.checkout_submit, checkoutPayload)
      .subscribe(
        res => {
          if (res.checkoutDetails) {
            this._checkoutService.submitOrderPayload = res; // setting res to use in order-success.component
            // sending review event for speciality checkout.
            this._gaService.sendEvent(this.gaEvent());
            sessionStorage.removeItem(CHECKOUT.session.key_sp_context);
            if (this._checkoutService.isCombo) {
              this._checkoutService.comboState =
                CHECKOUT.comboState.confirmation;
              this._checkoutService.currentComboNavState =
                CHECKOUT.comboState.confirmation;
              this._checkoutService.loader = false;
              this._checkoutService.loaderOverlay = false;
              this._router.navigateByUrl(
                ROUTES.checkout_combined.children.confirmation.absoluteRoute
              );
            } else {
              this._checkoutService.loader = false;
              this._checkoutService.loaderOverlay = false;
              this._router.navigateByUrl(
                ROUTES.checkout_sp.children.confirmation.absoluteRoute
              );
            }
          } else {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
          this._checkoutService.loader = false;
          this._checkoutService.loaderOverlay = false;
        },
        err => {
          this.ondeliveryOptionsError();
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
        orderReq.prescriptionType === "specialtyCleansed"
      ) {
        // cleaned payload
        for (const index in orderReq.patient) {
          orderReq.patient[index].referrals.forEach(referral => {
          tempReq = {
            type: "SPECIALTY",
            subType: "CLEANSED",
            flowType: "DOTCOM",
            channel: "RR_EMAIL",
            channelType: "SIGNIN",
            scriptMedId: referral.scriptMedId,
            referralId: referral.referralId,
            creditCardList: this.generateSelectedCC(
              referral.boxDetails.shippingInfo.creditCard
            ),
            selectedDate: this._datePipe.transform(
              referral.boxDetails.shippingInfo.selectedDate.substring(0, 10),
              "EEE, LLL dd, yyyy"
            ),
            callMeReason: {
              prefDelDtNotAvailable: referral.callMeReasons.prefDelDtNotAvailable.toString(),
              pharmCounsilQtn: referral.clinical_review.pharmacistcontact.toString(),
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
          const isReqToRemovePresc = this.getReqToRemovePresc(
            referral.prescriptionList
          );
          if (isReqToRemovePresc.length > 0) {
            tempReq.prescription = isReqToRemovePresc;
          }

          finalReqPayload.checkoutDetails.push(tempReq);
        });
      }
      } else if (
        orderReq.type &&
        orderReq.type === "SPECIALTY" &&
        orderReq.subType === "UNSOLICITED"
      ) {
        // unsolicited payload
        tempReq = {
          type: "SPECIALTY",
          subType: "UNSOLICITED",
          flowType: "DOTCOM",
          channel: "RR_EMAIL",
          channelType: "SIGNIN",
          selectedDate: this._datePipe.transform(
            orderReq.boxDetails.shippingInfo.selectedDate.substring(0, 10),
            "EEE, LLL dd, yyyy"
          )
        };
        if (this.unsolicited.boxDetails.shippingInfo.addressForm) {
          const adr = this.unsolicited.boxDetails.shippingInfo.addressForm;
          tempReq.address = {
            street1: adr.street1,
            city: adr.city,
            state: adr.state,
            zip: adr.zipCode,
            zipExt: adr.zipCodeOptional,
            type: adr.reasonForNewAddress
          };
        }
        finalReqPayload.checkoutDetails.push(tempReq);
      } else if (orderReq.type && orderReq.type === "HOMEDELIVERY") {
        // HD payload
        tempReq = {
          type: "HOMEDELIVERY",
          flowType: "153",
          subType: "HOMEDELIVERY",
          channel: "DOTCOM",
          channelType: "SIGNIN",
          address: {
            shipMethod: orderReq.boxDetails.shippingInfo.selectedShippingOption
          }
        };
        if (this._checkoutService.needHDCreditCard) {
          tempReq.creditCard = {
            "saveAsExpressPay ":
              orderReq.boxDetails.shippingInfo.creditCard.saveAsExpressPay
          };
        }
        finalReqPayload.checkoutDetails.push(tempReq);
      }
    }

    return finalReqPayload;
  }

  getReqToRemovePresc(pList) {
    // return requiered requestPayload of prescList when requestToRemove checkbox is checked.
    const prescList = [];
    if (pList.length > 0) {
      pList.forEach(presc => {
        if (presc.requestToRemove && presc.requestToRemove === true) {
          const presObj = {};
          presObj["drugName"] = presc.drugName;
          presObj["rxNumber"] = presc.rxNumber;
          presObj["specialityRequestToRemove"] = presc.requestToRemove;
          prescList.push(presObj);
        }
      });
    }

    return prescList;
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

  /**
   * prepare checkout payload for cleased order and add in checkout payload
   */
  initCleansedPayload() {
    if (this.cleansed !== undefined) {
      const c_payload = <CleansedPayloadModel>{};
      if (this._checkoutService.data_deliveryOptions) {
        const cdata = this._checkoutService.data_deliveryOptions.checkoutDetails.find(
          item => {
            return item.subType === CHECKOUT.type.SC;
          }
        );
        c_payload.prescriptionType = "specialtyCleansed";
        c_payload.localSpecialty = false;
        c_payload.submittedToMsgQueue = cdata.submittedToMsgQueue;
        c_payload.customercare = cdata.customercare;
        c_payload.patient = [];
      }
      this.speciality.patientsPayload.forEach(item => {
        // adding patient data in payload after filtering it.
        c_payload.patient.push(this.filterPatientData(item));
      });

      this._checkoutService.orderPayload.checkoutDetails.push(c_payload);
      this.cleansedIndex =
        this._checkoutService.orderPayload.checkoutDetails.length - 1;

      if ( window && window['ARX_Util'] ) {
        window['ARX_Util'].FORESEE.isCleansed( true );
      }
    }
  }

  /**
   * looping from  all patients available in speciality service patientsPayload and test each one
   * for all the validations.
   *
   * if invalid found then set cleansed state false in checkout service.
   */
  validateCleansedData() {
    if (
      this.speciality.patientsPayload &&
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

  /**
   * All the validations we need for a patient for be a valid order.
   *
   * @param patient
   */
  validateSinglePatient(patient) {
    const state = true;
    // checking additional medications, known drug allergies and known health conditions
    if (
      (patient.healthInfo.additionalMeds.length === 0 && !patient.noadditionalMedication) ||
      (patient.healthInfo.drugAllergies.length === 0 && !patient.nodrugAllergies) ||
      (patient.healthInfo.healthConditions.length === 0 && !patient.nohealthConditions)
    ) {
      return false;
    }
    // checking if health information checkbox is clicked.
    if (!patient.healthInfoChecked) {
      return false;
    }
    // checking if clinical review section options are selected.
    if (patient.clinical_review.assistance === "") {
      return false;
    }

    // check payment information
    if (!this._checkoutService.checkPaymentInfo(patient)) {
      return false;
    }

    // check address information.
    patient.referrals.forEach((item, index) => {
      if (item.boxDetails.shippingInfo.srxDeliveryAddr === undefined) {
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
    if (!this.speciality.cleansedTermsAndConditions) {
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
      patient.healthInfo &&
      !patient.healthInfo.additionalMeds &&
      !patient.noadditionalMedication
    ) {
      return false;
    }

    if (
      patient.healthInfo &&
      !patient.healthInfo.healthConditions &&
      !patient.nohealthConditions
    ) {
      return false;
    }

    if (
      patient.healthInfo &&
      !patient.healthInfo.drugAllergies &&
      !patient.nodrugAllergies
    ) {
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
      // patient.referrals[index].clinical_review = Object.assign(patient.referrals[index].clinical_review, data.clinical_review);
      patient.referrals[index].clinical_review = data.clinical_review;
      delete patient.referrals[index].payBy;
      patient.referrals[index].isRefillReqCorrect = false;
      this.filterCreditcardDetails(
        patient.referrals[index].boxDetails.shippingInfo.creditCard
      );
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

        // let year = item.expiryYear;
        // if (item.expiryYear.length > 2) {
        //   year = item.expiryYear.substring(2, item.expiryYear.length);
        // }

        // item.expdate = `${item.expiryMonth}/${year}`;
        delete item.expiryMonth;
        delete item.expiryYear;
      });
    }
  }

  redirectToAddressBook(subtype, patientID) {
    this._common.navigate(
      // tslint:disable-next-line:max-line-length
      `${this.ROUTES.checkout_sp.children.address_book.absoluteRoute}?${PARAM.speciality_address_book.patient_id}=${patientID}&${PARAM.speciality_address_book.subtype}=${subtype}`
    );
  }

  /**
   * save unsolicited selection in session store
   */
  saveUnsolicitedContext() {
    this.speciality.context.unDeliveryDate = this.unsolicited.boxDetails.shippingInfo.selectedDate;
    if (
      this.unsolicited.boxDetails.shippingInfo.srxDeliveryAddr === undefined
    ) {
      this.speciality.context.unAddress = this.unsolicitedAddressForm.value;
    }
    this._checkoutService.persistSpecialityContext(this.speciality.context);
  }

  /**
   * retrieve and load user selection for unsolicited.
   */
  loadUnsolicitedContext() {
    if (this.speciality.context && this.speciality.context.unDeliveryDate) {
      this.unsolicited.boxDetails.shippingInfo.selectedDate = this.speciality.context.unDeliveryDate;
      if (
        this.unsolicited.boxDetails.shippingInfo.srxDeliveryAddr === undefined
      ) {
        this.unsolicitedAddressForm.patchValue(
          this.speciality.context.unAddress
        );
      }
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

  scrollToError() {
    window.setTimeout(function() {
      if (document.querySelector(".input__error-text")) {
        document
          .querySelector(".input__error-text")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }
  ondeliveryOptionsError() {
    this._checkoutService.loader = false;
    this._checkoutService.loaderOverlay = false;
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
  prefillAddressComponents(data) {
    this.unsolicitedAddressForm.patchValue({
      city: data.city,
      state: data.state,
      zipCode: data.zipCode
    });
    this.saveUnsolicitedContext();
  }

  gaCommonEvent(category, action): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    return event;
  }
}
