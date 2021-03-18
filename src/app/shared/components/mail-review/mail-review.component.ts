import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AppContext } from 'app/core/services/app-context.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTES, Microservice } from 'app/config/index';

import { HttpClientService } from 'app/core/services/http.service';
import { MessageService } from 'app/core/services/message.service';
import { ARX_MESSAGES } from 'app/config/index';
import { Message } from 'app/models/index';
import { Router } from '@angular/router';
import { CheckoutService } from 'app/core/services/checkout.service';
import { DateConfigModel } from 'app/models/date-config.model';
import { ValidateDate } from 'app/shared/validators/date.validator';
import { CommonUtil } from 'app/core/services/common-util.service';
import { HomeDeliveryModel } from 'app/models/checkout/home-delivery.model';
import { CHECKOUT } from 'app/config/checkout.constant';
import { HomeDeliveryService } from 'app/pages/checkout/home_delivery/home-delivery.service';
import { HomeDeliveryContext } from 'app/models/checkout/home-delivery.context';
import { RefillBaseService } from 'app/core/services/refill-base.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { UserService } from '@app/core/services/user.service';
import { AddressBookService } from '@app/core/services/address-book.service';

@Component({
  selector: 'arxrf-checkout-mailreview',
  templateUrl: './mail-review.component.html',
  styleUrls: ['./mail-review.component.scss']
})
export class MailReviewComponent implements OnInit {
  loader = false;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;
  payload: HomeDeliveryModel = <HomeDeliveryModel>{};

  needCreditCard = true;
  ccExpired = false;
  ccTransactionId: string;

  ccUpdateForm: FormGroup;
  shippingMethod: any;
  loaderState = false;

  newCCType: string;

  ROUTES = ROUTES;

  submitText = 'Submit request';

  context: HomeDeliveryContext;

  paymentMissing_error = 'Please add payment information before continue.';
  showPayment_error = false;

  presAdditionalInfo = [];

  // use to validate cc on blur
  ccNumberErrOnBlur = false;
  ccExpDateErrOnBlur = false;
  ccZipErrOnBlur = false;

  // this array is used to keep index of prescriptions to compare while pushing value into presAdditionalInfo
  additionalInfoMap = [];

  editAddressLink;
  editAddressParams;

  // data coming from home delivery refill reminder
  @Input() isHDRefillReminder;
  @Input() mailCheckoutDetails;
  @Input() mailPrescriptionList;
  @Input() mailBoxDetails;
  @Input() mailPrescriptionType;
  @Input() mailDataDeliveryMethod;
  @Input() mailDataCustomerCare;
  @Input() mailDataPrescriptions;
  @Input() disableFormValiation;

  constructor(
    private _http: HttpClientService,
    public checkout: CheckoutService,
    private _formBuilder: FormBuilder,
    public appContext: AppContext,
    private _common: CommonUtil,
    private _message: MessageService,
    public homeDelivery: HomeDeliveryService,
    private _router: Router,
    private _refillService: RefillBaseService,
    private _gaService: GaService,
    private _userService: UserService,
    public addressesService: AddressBookService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(true);
    }
    const dateConfig = new DateConfigModel();
    dateConfig.allowFuture = true;
    dateConfig.isCreditCardExpiryDate = true;

    this.initCCForm(dateConfig);
  }

  initCCForm(dateConfig) {
    this.ccUpdateForm = this._formBuilder.group({
      ccNumber: ['', Validators.required],
      expDate: ['', [Validators.required, ValidateDate(dateConfig)]],
      zipCode: ['', Validators.required],
      saveAsExpress: ['']
    });
    // istanbul ignore else
    if (this.disableFormValiation) {
      this.ccUpdateForm.disable();
    }
  }

  ngOnInit(): void {
    if (this.isHDRefillReminder) {
      this.editAddressParams = { isHDReminder: true };
      this.editAddressLink = this.ROUTES.home_delivery_refill_reminder.children.address_book.absoluteRoute;
    } else {
      this.editAddressLink = this.ROUTES.checkout_hd.children.address_book.absoluteRoute;
    }

    this.checkout.currentComboNavState = CHECKOUT.comboState.mail;
    this.checkout.loader = true;
    if (this.checkout.isCombo) {
      this.submitText = 'Continue';
    }
    this.initPayload();
    // this.updateAddressSelected();
    this.calculateMailPrescriptionsDays();
    this.processCreditCardInformation();
    this.prepareLayout();
    this.loadUserContext();
  }

  calculateMailPrescriptionsDays() {
    const daysFinal = this.payload.boxDetails.shippingInfo.shippingOptions.filter(
      method => method.selected === true
    );

    // istanbul ignore else
    if (daysFinal.length > 0) {
      this.shippingMethod = daysFinal[0];
    }
  }

  processCreditCardInformation() {
    const creditCards = this.payload.boxDetails.shippingInfo.creditCard;
    // istanbul ignore else
    if (creditCards && creditCards.length > 0) {
      const creditCardInfo = creditCards[0];
      if (creditCardInfo.creditCardNumber === undefined) {
        this.needCreditCard = true;
        this.checkout.needHDCreditCard = true;
      } else if (creditCardInfo.creditCardNumber !== undefined) {
        this.needCreditCard = false;
        this.checkout.needHDCreditCard = false;
        // istanbul ignore else
        if (!this.isExpiryDateValid(creditCardInfo.expDate)) {
          this.ccExpired = true;
          this.needCreditCard = true;
          this.checkout.needHDCreditCard = true;
        }
      }
    }
  }

  /**
   * Checking credit card validity.
   *
   * @param expDate
   * @returns {boolean}
   */
  isExpiryDateValid(expDate) {
    let status = true;
    const month = expDate.substring(0, 2);
    const year = expDate.substring(3, 5);

    const currentYear = new Date()
      .getFullYear()
      .toString()
      .substring(2, 4);

    // tslint:disable-next-line: radix
    if (parseInt(year) < parseInt(currentYear)) {
      status = false;
    } else {
      // istanbul ignore else
      // tslint:disable-next-line: radix
      if (parseInt(year) === parseInt(currentYear)) {
        // istanbul ignore else
        // tslint:disable-next-line: radix
        if (parseInt(month) < new Date().getMonth() + 1) {
          status = false;
        }
      }
    }

    return status;
  }

  initPayload() {
    this.payload = new HomeDeliveryModel();
    if (!this.isHDRefillReminder) {
      const deliveryOptions = this.checkout.data_deliveryOptions.checkoutDetails.find(
        item => {
          return item.subType === CHECKOUT.type.HD;
        }
      );

      this.payload = deliveryOptions;
      // this.payload = deliveryOptions.customerCareContact;
      // istanbul ignore else
      if (this.payload && this.payload.prescriptionList) {
        this.checkAndDisplayPrescriptionsErrorMessage();
      }
    } else {
      this.payload.deliveryMethod = this.mailDataDeliveryMethod;
      this.payload.customercare = this.mailDataCustomerCare;
      this.payload.checkoutDetails = this.mailCheckoutDetails;
      this.payload.prescriptionList = this.mailPrescriptionList;
      this.payload.boxDetails = this.mailBoxDetails;
    }

    // this.payload.deliveryMethod.prescriptionType = CHECKOUT.type.HD;
  }

  checkAndDisplayPrescriptionsErrorMessage() {
    // get additional details
    this.payload.prescriptionList.forEach(prescription => {
      // istanbul ignore else
      if (prescription.messages) {
        if (
          prescription.messages[0].code === 'WAG_RXHOMEDELIVERY_001' ||
          prescription.messages[0].code === 'WAG_RXHOMEDELIVERY_VAL_001' ||
          prescription.isValidRx === 'false'
        ) {
          this._message.addMessage(
            new Message(
              prescription.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.WARN
            )
          );
        }
      }
    });
  }

  /**
   * Checking prescription from checkout service an if not available
   * then sending request to fetch prescriptions data.
   *
   * Fetching prescriptions for hom delivery and updating payload.
   */
  prepareLayout() {
    const updatePrescriptions = () => {
      if (!this.isHDRefillReminder) {
        // this.payload.prescriptions = this.checkout.data_deliveryOptions.checkoutDetails.find(
        //   (item) => {
        //     return item.subType == CHECKOUT.type.HD;
        //   }
        // ).prescriptionList;
      } else {
        if (this.payload.prescriptionList === undefined) {
          this.payload.prescriptionList = this.checkout.data_deliveryOptions;
        }
      }

      this.checkout.storeHomeDeliveryItemsInCache(
        this.payload.prescriptionList
      );

      if (!this.isHDRefillReminder) {
        this.updateItemsForSpecialityIfMissing();
      }

      // get additional details
      if (
        this.payload.prescriptionList &&
        this.payload.prescriptionList.length > 0
      ) {
        this.payload.prescriptionList.forEach(prescription => {
          // istanbul ignore else
          if (prescription.rxViewId && prescription.type !== 'BUYOUT') {
            this.additionalInfoMap.push(prescription.rxNumber);
            this.getAdditionalDetails(prescription);
          }
        });
      }
    };

    if (this.checkout.data_deliveryOptions === undefined) {
      if (!this.isHDRefillReminder) {
        this.checkout.deliveryOptions().subscribe(
          response => {
            this.checkout.loader = false;
            this.checkout.data_prescriptions = response;
            updatePrescriptions();
            this.checkout.displayInsuranceMessageForHD();
            // remove flag for enroll insurance flow
            window.sessionStorage.removeItem('insurance_enroll_flow');
          },
          error => {
            this.checkout.loader = false;
            this._message.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.service_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        );
      } else {
        this.checkout.loader = false;
        this.checkout.data_prescriptions = this.mailDataPrescriptions;
        updatePrescriptions();
      }
    } else {
      this.checkout.loader = false;
      updatePrescriptions();
    }
  }

  updateItemsForSpecialityIfMissing() {
    const cleansedPrescriptions = this.checkout.data_deliveryOptions.checkoutDetails.find(
      item => {
        return item.subType === CHECKOUT.type.SC;
      }
    );
    if (cleansedPrescriptions) {
      this.checkout.storeCleansedItemsCache(cleansedPrescriptions.patient);
    }

    const unPrescriptions = this.checkout.data_deliveryOptions.checkoutDetails.find(
      item => {
        return item.subType === CHECKOUT.type.SU;
      }
    );
    if (unPrescriptions) {
      this.checkout.storeUnsolicitedItemsCache(
        unPrescriptions.prescriptionList
      );
    }
  }

  /**
   * Prepare home delivery data after validating card and address state.
   */
  prepareMailData() {
    if (this.needCreditCard && this.ccUpdateForm.invalid) {
      this.showPayment_error = true;
      this.scrollToError();
      return;
    } else if (
      this.payload.boxDetails.shippingInfo.deliveryAddr === undefined
    ) {
      return;
    } else {
      // adding selected shipping method.
      this.payload.boxDetails.shippingInfo.selectedShippingOption = this.context.selectedShipping;
      this.checkout.valid.mail = true;
      if (this.needCreditCard) {
        // preparing new credit card related detaails in case it is updated
        // adding new encrypted cc number and remove old on from json
        const encrypt_cc = this._common.encryptCCNumber(
          this.ccUpdateForm.value.ccNumber
        );
        this.payload.boxDetails.shippingInfo.isCreditCardChanged = true;
        this.payload.boxDetails.shippingInfo.ccTokenNumber = encrypt_cc.number;
        this.payload.boxDetails.shippingInfo.subfid9B = encrypt_cc.subfid9B;

        this.payload.boxDetails.shippingInfo.expDate = this.ccUpdateForm.value.expDate;
        this.payload.boxDetails.shippingInfo.creditCardType = this.newCCType;

        const isExpressPay = this.payload.boxDetails.shippingInfo.creditCard
          ? this.payload.boxDetails.shippingInfo.creditCard.isExpressPay
          : null;
        this.payload.boxDetails.shippingInfo.creditCard = {
          zipCode: this.ccUpdateForm.value.zipCode,
          saveAsExpressPay: this.ccUpdateForm.value.saveAsExpress
            ? 'yes'
            : 'no',
          isExpressPay: isExpressPay
        };

        // remove old cc number from json
        delete this.payload.boxDetails.shippingInfo.creditCardNumber;
      }
      this.furtherRedirection();
    }
  }

  /**
   * update cc type on cc number enter.
   *
   * @param event
   */
  updateCCType(event) {
    this.newCCType = event.type;
    this.ccExpired = false;
    this.saveContext();
  }

  removePrescription(rxNumber: string, id: string) {
    const api = Microservice.remove_rx;
    this.loader = true;
    this.loaderOverlay = true;

    const post_data = {
      rxId: [id]
    };

    this._http.postData(api, post_data).subscribe(
      res => {
        if (res) {
          // if removeRx response success
          this.checkout.storeReviewRefresh('true');
          this.checkout.deliveryOptions().subscribe(response => {
            this.checkout.loader = false;
            this.checkout.loaderOverlay = false;
            this._userService.updateCartRxCount();

            const removeCached = () => {
              sessionStorage.removeItem(CHECKOUT.session.key_hd_data);
              localStorage.removeItem(CHECKOUT.session.key_items_hd);
              sessionStorage.removeItem(CHECKOUT.session.key_hd_context);
            };
            if (response.checkoutDetails.length) {
              const info = response.checkoutDetails.find(item => {
                return item.type === CHECKOUT.type.HD;
              });
              response.checkoutDetails.forEach((item, index) => {
                this.checkout.isAllPrescriptionValid(
                  response.checkoutDetails[0].prescriptionList
                );
                if (!this.checkout.isAllPrescriptionInvalid) {
                  return true;
                }
              });

              if (info === undefined) {
                removeCached();
                // navigating to speciality
                this._common.navigate(ROUTES.checkout_sp.absoluteRoute);
              } else {
                this.checkout.removePrescriptionFromSession(
                  rxNumber,
                  CHECKOUT.type.HD
                );
                // this.payload.prescriptions = info.prescriptionList;  //update when remove
                this.payload.prescriptionList = info.prescriptionList;
                sessionStorage.setItem(
                  CHECKOUT.session.key_hd_data,
                  JSON.stringify(this.payload)
                );
                this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
              }
            } else if (response.messages.length) {
              this._message.addMessage(
                new Message(
                  res.messages[0].messgae,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            } else {
              removeCached();
              this.payload = undefined;
              sessionStorage.removeItem(CHECKOUT.session.key);
              this._common.navigate(ROUTES.refill.absoluteRoute);
            }
          });
        } else {
          // if removeRx response Error
          this.loaderState = false;
          this.checkout.loader = false;
          this.checkout.loaderOverlay = false;
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      },
      err => {
        this.loaderState = false;
        this.checkout.loader = false;
        this.checkout.loaderOverlay = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  /**
   * proceed further and submit or continue order.
   */
  furtherRedirection() {
    if (this.needCreditCard) {
      this.checkout.hdCCReqPayload = {
        creditCard: [
          {
            creditCardType: this.payload.boxDetails.shippingInfo.creditCardType,
            expDate: this.payload.boxDetails.shippingInfo.expDate,
            ccTokenNumber: this.payload.boxDetails.shippingInfo.ccTokenNumber,
            rxType: 'HOMEDELIVERY',
            subfid9B: this.payload.boxDetails.shippingInfo.subfid9B,
            zipCode: this.payload.boxDetails.shippingInfo.creditCard.zipCode
          }
        ]
      };
    }

    if (this.checkout.isCombo) {
      this._gaService.sendEvent(this.gaEvent());
      this.payload.boxDetails.shippingInfo.hdCCReqPayload = this.checkout.hdCCReqPayload;
      sessionStorage.setItem(
        CHECKOUT.session.key_hd_data,
        JSON.stringify(this.payload)
      );
      this.checkout.comboState = CHECKOUT.comboState.speciality;
      this.checkout.currentComboNavState = CHECKOUT.comboState.speciality;
      this._router.navigateByUrl(
        this.ROUTES.checkout_combined.children.specialty.absoluteRoute
      );
    } else {
      this.checkout.initPayload();
      this.checkout.orderPayload.checkoutDetails.push(this.payload);
      this.loader = true;
      this.loaderOverlay = true;

      if (this.needCreditCard) {
        this._userService.getCCToken(this.checkout.hdCCReqPayload).subscribe(
          res => {
            if (res.tokenDetails[0].transactionId) {
              this.ccTransactionId = res.tokenDetails[0].transactionId;
              this.submitMailData();
            } else {
              // handle error
              this.checkout.loader = false;
              this.checkout.loaderOverlay = false;
              this._message.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          },
          err => {
            this.onfurtherRedirectionError();
          }
        );
      } else {
        this.submitMailData();
      }
    }
  }

  submitMailData() {
    // let api = this.isHDRefillReminder ? Microservice.checkout_submit : Microservice.checkout_submit;
    const api = Microservice.checkout_submit;
    let orderPayloadRequest;
    /*orderPayloadRequest = {
      "checkoutDetails": [
          {
              "flowType": `${this.isHDRefillReminder ? '153' : 'DOTCOM'}`,
              "type":  `${this.isHDRefillReminder ? 'HOMEDELIVERY' : 'SPECIALTY'}`,
              "subType": `${this.isHDRefillReminder ? 'HOMEDELIVERY' : 'CLEANSED'}`,
              "channel": "DOTCOM",
              "channelType": "SIGNIN",
              "address": {
                  "shipMethod": this.payload.boxDetails.shippingInfo.selectedShippingOption
              }
          }
      ],
  };*/

    orderPayloadRequest = {
      checkoutDetails: [
        {
          flowType: `${this.isHDRefillReminder ? '153' : 'DOTCOM'}`,
          type: `HOMEDELIVERY`,
          subType: 'HOMEDELIVERY',
          channel: 'DOTCOM',
          channelType: 'SIGNIN',
          address: {
            shipMethod: this.payload.boxDetails.shippingInfo
              .selectedShippingOption
          }
        }
      ]
    };
    // istanbul ignore else
    if (this.needCreditCard) {
      orderPayloadRequest.checkoutDetails[0].creditCard = {
        saveAsExpressPay: this.payload.boxDetails.shippingInfo.creditCard
          .saveAsExpressPay,
        transactionId: this.ccTransactionId
      };
    }
    // this._http.postData(api, this.checkout.orderPayload).subscribe((res) => {
    this._http.postData(api, orderPayloadRequest).subscribe(
      res => {
        this.checkout.loader = false;
        this.checkout.loaderOverlay = false;

        // istanbul ignore else
        if (this.checkValidSubmission(res)) {
          if (this.isHDRefillReminder) {
            this._gaService.sendEvent(this.gaEvent());
            sessionStorage.removeItem(CHECKOUT.session.key_hd_context);
            this.checkout.submitOrderPayload = res;
            // sessionStorage.setItem(AppContext.CONST.hd_rr_orderinfo, JSON.stringify(res));
            this._router.navigateByUrl(
              ROUTES.home_delivery_refill_reminder.children.confirmation
                .absoluteRoute
            );
          } else if (res.checkoutDetails.length) {
            this._gaService.sendEvent(this.gaEvent());
            sessionStorage.removeItem(CHECKOUT.session.key_hd_context);
            this.checkout.submitOrderPayload = res; // set response to use in order-success.component
            this._router.navigateByUrl(
              ROUTES.checkout_hd.children.confirmation.absoluteRoute
            );
          } else {
            this._message.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
      },
      err => {
        this.onfurtherRedirectionError();
      }
    );
  }

  /**
   * Load home delivery context from session store if found.
   */
  loadUserContext() {
    if (sessionStorage.getItem(CHECKOUT.session.key_hd_context) != null) {
      this.context = JSON.parse(
        sessionStorage.getItem(CHECKOUT.session.key_hd_context)
      );
      // istanbul ignore else
      if (this.context.isCardUpdated) {
        this.ccUpdateForm.patchValue(this.context.ccInfo);
        this.needCreditCard = true;
        this.checkout.needHDCreditCard = true;
        this.newCCType = this.context.cardType;
      }
    } else {
      this.context = <HomeDeliveryContext>{};
    }

    this.updateShippingDetailsOnScreen();
  }

  // validate CC on blur
  validateCConBlur(e) {
    if (e.target.id === 'ccNumber') {
      this._common.validateForm(this.ccUpdateForm);
      // istanbul ignore else
      if (this.ccUpdateForm.invalid) {
        this.ccNumberErrOnBlur = true;
        return;
      }
    }

    if (e.target.id === 'expDate') {
      this._common.validateForm(this.ccUpdateForm);
      // istanbul ignore else
      if (this.ccUpdateForm.invalid) {
        this.ccExpDateErrOnBlur = true;
        return;
      }
    }

    // istanbul ignore else
    if (e.target.id === 'zipCode') {
      this._common.validateForm(this.ccUpdateForm);
      // istanbul ignore else
      if (this.ccUpdateForm.invalid) {
        this.ccZipErrOnBlur = true;
        return;
      }
    }
  }

  /**
   * save home delivery context in session store.
   *
   * calling async method from checkout service to same all information.
   */
  saveContext() {
    // istanbul ignore else
    if (this.needCreditCard || this.ccExpired) {
      this.context.isCardUpdated = true;
      this.context.ccInfo = this.ccUpdateForm.value;
      this.context.cardType = this.newCCType;
    }
    this.checkout.persistHomeDeliveryContext(this.context);
    this.updateShippingDetailsOnScreen();
  }

  /**
   * selecting shipping method from context to display dats and price on screen
   */
  updateShippingDetailsOnScreen() {
    // istanbul ignore else
    if (this.context.selectedShipping === undefined) {
      this.context.selectedShipping = this.payload.boxDetails.shippingInfo.shippingOptions[0].value;
    }

    const ships = this.payload.boxDetails.shippingInfo.shippingOptions.filter(
      method => method.value === this.context.selectedShipping
    );

    // istanbul ignore else
    if (ships && ships.length > 0) {
      this.shippingMethod = ships[0];
    }
  }

  getAdditionalDetails(pres) {
    const index = this.additionalInfoMap.indexOf(pres.rxNumber);
    this._refillService.fetchRxHistory(pres).subscribe(
      response => {
        if (response.prescriptions) {
          const prescription = response.prescriptions.find(item => {
            return (
              this.prepareRxNumber(item.rxNumber) ===
              this.prepareRxNumber(pres.rxNumber)
            );
          });

          if (prescription) {
            this.presAdditionalInfo[index] = {
              price:
                '$' +
                  prescription.fillDetails[0]['statusPrice']['price'] +
                  '*' || 'Price not available'
            };
          } else {
            this.presAdditionalInfo[index] = { price: 'Price not available' };
          }
        } else {
          this.presAdditionalInfo[index] = { price: 'Price not available' };
        }
      },
      () => {
        this.presAdditionalInfo[index] = { price: 'Price not available' };
      }
    );
  }

  /**
   * utility to update rxnumber based on 5 digit store code.
   *
   * @param {string} rxNumber
   * @returns {string}
   */
  prepareRxNumber(rxNumber: string): string {
    let updatedRxNumber = '';
    if (rxNumber.indexOf('-') > -1) {
      if (
        rxNumber.substring(rxNumber.indexOf('-') + 1, rxNumber.length).length <
        5
      ) {
        updatedRxNumber = `${rxNumber.substring(
          0,
          rxNumber.indexOf('-') + 1
        )}0${rxNumber.substring(rxNumber.indexOf('-') + 1, rxNumber.length)}`;
      } else {
        updatedRxNumber = rxNumber;
      }
    } else {
      updatedRxNumber = rxNumber;
    }
    return updatedRxNumber;
  }

  gaEvent() {
    const event = <GAEvent>{};
    event.category = this.checkout.isCombo
      ? GA.categories.checkout_combo
      : GA.categories.checkout_mail;
    event.action = this.checkout.isCombo
      ? GA.actions.checkout_combo.review_HD
      : GA.actions.checkout_mail.review;
    event.label = this.isHDRefillReminder ? GA.label.hd_refill_reminder : '';
    return event;
  }

  /**
   * checking for error messages in submit order response.
   *
   * @param res
   * @returns {boolean}
   */
  checkValidSubmission(res): boolean {
    let isValid = true;
    try {
      // checking for any error message at root in response json.
      if (res.messages) {
        if (
          res.messages[0].type.toLocaleLowerCase() ===
          ARX_MESSAGES.MESSAGE_TYPE.ERROR.toLocaleLowerCase()
        ) {
          isValid = false;
          this._message.addMessage(
            new Message(
              res.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else if (res.messages[0].code === 'WAG_RXCHECKOUT_002') {
          // isValid = false;
          this._message.addMessage(
            new Message(res.messages[0].message, ARX_MESSAGES.MESSAGE_TYPE.WARN)
          );
        }
      } else if (res.checkoutDetails[0].messages) {
        // istanbul ignore else
        if (
          res.checkoutDetails[0].messages[0].type.toLocaleLowerCase() ===
          ARX_MESSAGES.MESSAGE_TYPE.ERROR.toLocaleLowerCase()
        ) {
          isValid = false;
          this._message.addMessage(
            new Message(
              res.checkoutDetails[0].messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      } else if (
        res.checkoutDetails[0].boxDetails.shippingInfo.creditCard.messages
      ) {
        //checking for errors in credit card section in response json.
        if (
          res.checkoutDetails[0].boxDetails.shippingInfo.creditCard.messages[0].type.toLocaleLowerCase() ===
          ARX_MESSAGES.MESSAGE_TYPE.ERROR.toLocaleLowerCase()
        ) {
          isValid = false;
          this._message.addMessage(
            new Message(
              res.checkoutDetails[0].boxDetails.shippingInfo.creditCard.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      }
    } catch (e) {
      console.error(e);
    }

    return isValid;
  }

  scrollToError() {
    window.setTimeout(function() {
      document
        .querySelector('.input__error-text')
        .scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // added to update address in HD checkout flow
  updateAddressSelected(addresses: any) {
    // istanbul ignore else
    if (addresses && addresses.length) {
      for (const idx in addresses) {
        // istanbul ignore else
        if (addresses[idx].preferred || addresses[idx].isPreferred) {
          this.payload.boxDetails.shippingInfo.deliveryAddr = addresses[idx];
        }
      }
    }
  }

  onfurtherRedirectionError() {
    this.checkout.loader = false;
    this.checkout.loaderOverlay = false;
    this._message.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
}
