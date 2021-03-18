import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClientService } from '@app/core/services/http.service';
import { PatientModel } from '@app/models/checkout/patient.model';
import { SpecialityService } from '@app/pages/checkout/specialty-checkout/speciality.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';
import { CHECKOUT } from '@app/config/checkout.constant';
import { CommonUtil } from '@app/core/services/common-util.service';
import { PARAM } from '@app/config/param.constant';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models';
import { UserService } from '@app/core/services/user.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA, TwoFaGA } from '@app/config/ga-constants';
import { GaData, TwoFAEnum } from '@app/models/ga/ga-event';

@Component({
  selector: 'arxrf-cleansed-pres-section',
  templateUrl: './cleansed-prescriptions-section.component.html',
  styleUrls: ['./cleansed-prescriptions-section.component.scss']
})
// tslint:disable-next-line: class-name
export class cleansedPrescriptionsSectionComponent implements OnInit {
  @Input()
  patientData: any;
  @Output()
  validate = new EventEmitter<PatientModel>();

  payload: PatientModel;
  payloadIndex: number;
  loaderState: boolean;
  user: string;
  ROUTES = ROUTES;

  clinical_review = {
    sideeffects: '',
    pharmacistcontact: '',
    assistance: ''
  };

  show_healthinfo_missing_error = false;

  constructor(
    public appContext: AppContext,
    private _http: HttpClientService,
    public checkoutService: CheckoutService,
    public speciality: SpecialityService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _messageService: MessageService,
    private _gaService: GaService
  ) {
    //console.log('arxrf-cleansed-pres-section');
  }

  ngOnInit(): void {
    this.checkAndProcessCleansedPayment();
    this.initPayload();
    this.user =
      this._userService.user.profile.basicProfile.firstName +
      ' ' +
      this._userService.user.profile.basicProfile.lastName;
    this.loadContext();
  }

  /**
   * Check payment information for referrals and process accordingly for
   * different cases.
   */
  checkAndProcessCleansedPayment() {
    const cleansed_addresses = [];
    // tslint:disable-next-line: forin
    for (const i in this.patientData.referrals) {
      const referral = this.patientData.referrals[i];

      // handling no due case
      // tslint:disable-next-line: radix
      //istanbul ignore else
      if (parseInt(referral.dueNow) === 0) {
        referral['noPaymentDue'] = true;
      } else {
        referral.payBy = '1';
      }
      const messages = referral.boxDetails.shippingInfo.messages;
      //istanbul ignore else
      if (messages !== undefined) {
        //istanbul ignore else
        if (messages[0].code === 'WAG_E_SRX_PAYMENTS_001') {
          referral.missingCCCase = true;
          referral.missingCCMessage = messages[0].message;
        }
        //istanbul ignore else
        if (messages[0].code === 'No CreditCard Found') {
          referral.missingCCCase = true;
          if (messages[0].message === 'ZERO STATE PLEASE ADD A CARD') {
            referral.missingCCMessage = 'Please add a card';
          } else {
            referral.missingCCMessage = messages[0].message;
          }
        }
      }
      const adresses = referral.boxDetails.shippingInfo.srxDeliveryAddr;
      //istanbul ignore else
      if (adresses && adresses.length > 0) {
        referral.selectedAdresss = adresses.find(address => {
          return address.preferred;
        });
      }
      //istanbul ignore else
      if (!referral.selectedAdresss) {
        referral.selectedAdresss = adresses[0];
      }

      cleansed_addresses.push({
        scriptMedId: referral.scriptMedId,
        referralId: referral.referralId,
        addresses: adresses
      });
    }
    sessionStorage.setItem(
      CHECKOUT.session.key_speciality_addresses,
      JSON.stringify(cleansed_addresses)
    );
  }

  /**
   * initialize payload basic object for patient.
   */
  initPayload() {
    this.payload = this.patientData;
    this.patientData.isValid = false;
    this.payload.add_update_svc_status = false;
    this.payload.termsAndConditions = this.speciality.cleansedTermsAndConditions;

    // tslint:disable-next-line: forin
    for (const index in this.payload.referrals) {
      this.payload.referrals[index].callMeReasons = {
        prefDelDtNotAvailable: false
      };
      this.patientData.referrals[index].boxDetails.shippingInfo.availableDates =
        this.checkoutService.removeHolidays(this.patientData.referrals[index].boxDetails.shippingInfo.availableDates);
      this.payload.referrals[
        index
      ].boxDetails.shippingInfo.selectedDate = this.patientData.referrals[
        index
      ].boxDetails.shippingInfo.availableDates[0];
      //istanbul ignore else
      if (this.payload.healthInfo === undefined) {
        this.payload.healthInfo = <any>{};
      }
    }

    this.payload.callMeReasons = {
      newInsurance: false,
      newCreditCard: false,
      prescNotVisible: false,
      other: false,
      prescChange: false,
      reqDiffPresc: false,
      insuranceBillQtn: false,
      pharmCounsilQtn: 'false',
      prscQty: false,
      notes: ''
    };

    this.payload['clinical_review'] = this.clinical_review;
    this.speciality.patientsPayload.push(this.payload);
    this.payloadIndex = this.speciality.patientsPayload.length - 1;

    this.updateCCInformation();
  }

  /**
   * load context for patient selecte values.
   */
  loadContext() {
    //istanbul ignore else
    if (this.speciality.context && this.speciality.context.patient) {
      // tslint:disable-next-line: forin
      for (const index in this.speciality.patientsPayload[this.payloadIndex]
        .referrals) {
        const referral = this.speciality.patientsPayload[this.payloadIndex]
          .referrals[index];
        const id = `${
          this.speciality.patientsPayload[this.payloadIndex].scriptMedId
        }_${referral.referralId}`;

        const context = this.speciality.context.patient.find(item => {
          return item.id === id;
        });
        if (context) {
          referral.payBy = context.payBy;
          referral.boxDetails.shippingInfo.selectedDate =
            context.clDeliveryDate;
          referral.callMeReasons.prefDelDtNotAvailable =
            context['prefDelDtNotAvailable'];

          if (context.dueNow) {
            const creditCard = referral.boxDetails.shippingInfo.creditCard;
            if (creditCard) {
              creditCard.forEach(item => {
                item.isSelected = false;
                delete item.dueNow;
              });
              context.dueNow.forEach(item => {
                const payment = creditCard.find(card => {
                  return card.paymentMethodId === item.id;
                });
                payment.isSelected = true;
                payment.dueNow = item.amount;
              });
            }
          }
        }
      }
    }

    if (this.speciality.context && this.speciality.context.healthInfo) {
      const healthInfo = this.speciality.context.healthInfo.find(
        item =>
          (item.id = this.speciality.patientsPayload[
            this.payloadIndex
          ].scriptMedId)
      );
      if (healthInfo) {
        this.speciality.patientsPayload[this.payloadIndex].nodrugAllergies =
          healthInfo.healthInfo.nodrugAllergies;
        this.speciality.patientsPayload[this.payloadIndex].nohealthConditions =
          healthInfo.healthInfo.nohealthConditions;
        this.speciality.patientsPayload[
          this.payloadIndex
        ].noadditionalMedication = healthInfo.healthInfo.noadditionalMedication;
      }
    }

    if (this.speciality.context && this.speciality.context.clinical_review) {
      const clinical_reviewInfo = this.speciality.context.clinical_review.find(
        item =>
          (item.id = this.speciality.patientsPayload[
            this.payloadIndex
          ].scriptMedId)
      );
      if (clinical_reviewInfo) {
        this.speciality.patientsPayload[this.payloadIndex].clinical_review =
          clinical_reviewInfo.clinical_review;
        this.speciality.patientsPayload[this.payloadIndex].callMeReasons =
          clinical_reviewInfo.callMeReasons;
      }
    }
  }

  redirectToAddCard(referral) {
    this._gaService.sendEvent(
      this.gaEvent(
        TwoFaGA.category.specialty_checkout,
        TwoFaGA.action.addCreditCard
      )
    );
    if (referral.boxDetails.shippingInfo.creditCard === undefined) {
      sessionStorage.setItem(CHECKOUT.session.key_nocard, 'true');
    }
    this._common.navigate(
      `${ROUTES.checkout_sp.children.add_payment.absoluteRoute}?pid=${this.payload.scriptMedId}`
    );
  }

  redirectToAddressBook(subtype, scriptMedId, referralID, profileID = null) {
    this._gaService.sendEvent(
      this.gaEvent(
        TwoFaGA.category.specialty_checkout,
        TwoFaGA.action.editAddress
      )
    );
    this._common.navigate(
      // tslint:disable-next-line:max-line-length
      `${this.ROUTES.checkout_sp.children.address_book.absoluteRoute}?${PARAM.speciality_address_book.patient_id}=${scriptMedId}&${PARAM.speciality_address_book.referral_id}=${referralID}&profileId=${profileID}&${PARAM.speciality_address_book.subtype}=${subtype}`
    );
  }

  /**
   * update payload if preferred date is not available.
   *
   * @param {number} index
   * @param event
   */
  shippingDateNotAvailable(index: number, event) {
    if (event.target.checked) {
      this._gaService.sendEvent(
        this.gaEvent(
          TwoFaGA.category.specialty_checkout,
          TwoFaGA.action.preferredDate
        )
      );
      this.payload.referrals[index].callMeReasons.prefDelDtNotAvailable = true;
    } else {
      this.payload.referrals[index].callMeReasons.prefDelDtNotAvailable = false;
    }

    this.validatePatientData();
    this.speciality.savePatientContext(this.payloadIndex);
  }

  /**
   * Validate patient information.
   */
  validatePatientData() {
    this.show_healthinfo_missing_error = false;

    if (!this.payload.healthInfoChecked) {
      this.patientData.isValid = false;
      this.show_healthinfo_missing_error = true;
      return;
    }

    if (
      this.clinical_review.pharmacistcontact === '' ||
      this.clinical_review.assistance === ''
    ) {
      this.patientData.isValid = false;
      return;
    }

    this.patientData.referrals.forEach(
      function(item, index) {
        if (
          item.messages !== undefined &&
          item.messages.code === 'WAG_E_SRX_PAYMENTS_001'
        ) {
        } else {
          if (this.countSelected(item) === 0) {
            this.patientData.isValid = false;
            return;
          }
        }
      }.bind(this)
    );

    this.payload.referrals.forEach(
      function(item, index) {
        if (item.shippingInfo.address === undefined) {
          this.patientData.isValid = false;
          return;
        }

        if (
          item.shippingInfo.selectedDate === undefined &&
          (item.callMeReasons.prefDelDtNotAvailable === undefined ||
            !item.callMeReasons.prefDelDtNotAvailable)
        ) {
          this.patientData.isValid = false;
          return;
        }
      }.bind(this)
    );

    if (!this.payload.termsAndConditions) {
      this.patientData.isValid = false;
      return;
    }

    this.patientData.isValid = true;

    // tslint:disable-next-line: forin
    for (const i in this.payload.referrals) {
      this.payload.referrals[i].prescriptions = this.patientData.prescriptions[
        i
      ].prescriptions;
    }
    this.updateCCInformation();

    this.validate.emit(this.payload);
  }

  /**
   * Called on selecting any card. aby clickin on checkbox.
   *
   * @param {number} index
   * @param {number} cardIndex
   * @param event
   */
  onCardSelect(index: number, cardIndex: number, event) {
    if (!event.target.checked) {
      this.speciality.patientsPayload[this.payloadIndex].referrals[
        index
      ].boxDetails.shippingInfo.creditCard[cardIndex].isSelected = false;
      delete this.speciality.patientsPayload[this.payloadIndex].referrals[index]
        .boxDetails.shippingInfo.creditCard[cardIndex].dueNow;
      //istanbul ignore else
      if (
        this.speciality.patientsPayload[this.payloadIndex].referrals[index]
          .payBy === '2'
      ) {
        this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.creditCard.forEach(item => {
          if (item.isSelected) {
            item.dueNow = parseFloat(
              this.speciality.patientsPayload[this.payloadIndex].referrals[
                index
              ].dueNow
            ).toFixed(2);
          }
        });
      }
    } else {
      //istanbul ignore else
      if (
        this.speciality.patientsPayload[this.payloadIndex].referrals[index]
          .payBy === '1'
      ) {
        this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.creditCard.forEach(item => {
          item.isSelected = false;
          delete item.dueNow;
        });
      }
      this.speciality.patientsPayload[this.payloadIndex].referrals[
        index
      ].boxDetails.shippingInfo.creditCard[cardIndex].isSelected = true;
      //istanbul ignore else
      if (
        this.speciality.patientsPayload[this.payloadIndex].referrals[index]
          .payBy === '1'
      ) {
        this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.creditCard[
          cardIndex
        ].dueNow = this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.dueNow;
      }
      //istanbul ignore else
      if (
        this.speciality.patientsPayload[this.payloadIndex].referrals[index]
          .payBy === '2'
      ) {
        let selectedCard = 0;
        this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.creditCard.forEach(item => {
          if (item.isSelected) {
            selectedCard++;
            item.dueNow = parseFloat(
              this.speciality.patientsPayload[this.payloadIndex].referrals[
                index
              ].dueNow
            ).toFixed(2);
          }
        });

        if (selectedCard > 1) {
          this.speciality.patientsPayload[this.payloadIndex].referrals[
            index
          ].boxDetails.shippingInfo.creditCard[cardIndex].dueNow = '0';
        }
      }
    }
    this.speciality.savePatientContext(this.payloadIndex);
  }

  /**
   * Updating payby value for given referral and reseting card selection to default.
   *
   * @param event
   * @param referral
   */
  onPayByChange(event, referral) {
    referral.payBy = event.target.value;

    for (const i in referral.boxDetails.shippingInfo.creditCard) {
      if (referral.boxDetails.shippingInfo.creditCard[i].selected === true) {
        referral.boxDetails.shippingInfo.creditCard[i].isSelected = true;
        referral.boxDetails.shippingInfo.creditCard[i].dueNow = parseFloat(
          referral.dueNow
        ).toFixed(2);
      } else {
        referral.boxDetails.shippingInfo.creditCard[i].isSelected = false;
        delete referral.boxDetails.shippingInfo.creditCard[i].dueNow;
      }
    }
    this.speciality.savePatientContext(this.payloadIndex);
  }

  /**
   * amount calculation in case of pay by 2 cards selected.
   *
   * @param event
   * @param refIndex
   */
  calculateAmount(event, refIndex) {
    if (event.type === 'focus') {
      if (event.target.value === 0) {
        event.target.value = '';
      }
    }
    if (event.type === 'blur') {
      if (event.target.value === '' || event.target.value === '.') {
        event.target.value = '0.00';
      }
    }
    if (event.type === 'keyup') {
      if (event.target.value === '') {
        const referral = this.patientData.referrals[refIndex];
        const remaining = referral.dueNow;
        const card = referral.boxDetails.shippingInfo.creditCard.filter(
          item => {
            return item.paymentMethodId === event.target.name;
          }
        )[0];
        const otherCard = referral.boxDetails.shippingInfo.creditCard.filter(
          item => {
            return (
              item.isSelected && item.paymentMethodId !== card.paymentMethodId
            );
          }
        )[0];

        otherCard.dueNow = parseFloat(remaining.toString()).toFixed(2);
      }
    }

    if (!isNaN(parseFloat(event.target.value))) {
      const referral = this.patientData.referrals[refIndex];
      if (this.countSelected(referral) === 1) {
        event.target.value = parseFloat(referral.dueNow).toFixed(2);
      }

      const amount = parseFloat(event.target.value);

      const card = referral.boxDetails.shippingInfo.creditCard.filter(item => {
        return item.paymentMethodId === event.target.name;
      })[0];

      if (amount > this.patientData.referrals[refIndex].dueNow) {
        card['dueNowValid'] = false;
        return;
      } else {
        if (event.type === 'blur') {
          card.dueNow = parseFloat(amount.toString()).toFixed(2);
        }

        const remaining = this.patientData.referrals[refIndex].dueNow - amount;

        const otherCard = referral.boxDetails.shippingInfo.creditCard.filter(
          item => {
            return (
              item.isSelected && item.paymentMethodId !== card.paymentMethodId
            );
          }
        )[0];

        if (otherCard) {
          otherCard.dueNow = parseFloat(remaining.toString()).toFixed(2);
          card['dueNowValid'] = true;
          otherCard['dueNowValid'] = true;
        }
      }

      this.updateCCInformation();
      this.speciality.savePatientContext(this.payloadIndex);
    }
  }

  /**
   * Update cc information from patient data to payload
   */
  updateCCInformation() {
    const payloadIndex = this.speciality.patientsPayload[this.payloadIndex];
    // tslint:disable-next-line: forin
    for (const index in payloadIndex.referrals) {
      // set isSelected where selected is found in CC
      const ccList =
        payloadIndex.referrals[index].boxDetails.shippingInfo.creditCard;
      //istanbul ignore else
      if (ccList) {
        ccList.forEach(cc => {
          if (
            cc.selected &&
            this.countSelected(payloadIndex.referrals[index]) !== 2
          ) {
            cc.isSelected = true;
          }
        });
      }
      //istanbul ignore else
      if (this.countSelected(payloadIndex.referrals[index]) === 1) {
        const dueNow = payloadIndex.referrals[index].dueNow;
        // sort CC list
        ccList.sort(function(a, b) {
          return a.isSelected ? -1 : b.isSelected === true ? 1 : 0;
        });
        for (const i in payloadIndex.referrals[index].boxDetails.shippingInfo
          .creditCard) {
          if (ccList[i].isSelected) {
            ccList[i].dueNow = dueNow;
          }
        }
      }
    }
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

  isDisableSelection(referral, requestToRemove): boolean {
    const presCount = referral.prescriptionList.length - 1;
    const selectedPresCnt = referral.prescriptionList.filter(prescription => {
      return prescription.requestToRemove === true;
    }).length;

    return presCount === selectedPresCnt && !requestToRemove;
  }

  donotNeedItem(prescription, event) {
    //istanbul ignore else
    if (event) {
      this._gaService.sendEvent(
        this.gaEvent(
          TwoFaGA.category.specialty_checkout,
          TwoFaGA.action.removePrescription
        )
      );
    }
    //istanbul ignore else
    if (prescription.requestToRemove) {
      prescription.requestToRemove = true;
      prescription.showRequestToRemove = true;

      (function(pres) {
        window.setTimeout(() => {
          pres.showRequestToRemove = false;
        }, 5000);
      })(prescription);
    } else {
      prescription.requestToRemove = false;
      prescription.showRequestToRemove = false;
    }
  }

  /**
   * remove a referral for patient.
   *
   * @param refIndex
   * @param id
   */
  removeReferral(refIndex, removeReferral) {
    this._gaService.sendEvent(
      this.gaCommonEvent('/specialty-checkout', 'Remove referral')
    );
    // let api = "/svc/rxorders/retail/prescriptions/" + "S" + id;
    const removeRefIds = removeReferral.prescriptionList.map(
      () => `S${removeReferral.referralId}`
    );
    const api = Microservice.remove_rx;
    // this.loaderState = true;
    this.checkoutService.loader = true;
    this.checkoutService.loaderOverlay = true;
    const post_data = {
      rxId: removeRefIds
    };

    this._http.postData(api, post_data).subscribe(
      response => {
        if (response === true) {
          // if removeRx response success
          this._userService.updateCartRxCount(); //getInCartRedisCount service call supposed to happen after the removal of RX
          this.checkoutService.storeReviewRefresh('true');
          this.checkoutService.deliveryOptions().subscribe(
            res => {
              // this.loaderState = false;
              this.checkoutService.loader = false;
              this.checkoutService.loaderOverlay = false;
              //istanbul ignore else
              if (res.checkoutDetails.length > 0) {
                const info = res.checkoutDetails.find(item => {
                  return (
                    item.type === 'SPECIALTY' && item.subType === 'CLEANSED'
                  );
                });
                //istanbul ignore else
                if (info === undefined) {
                  let json = JSON.parse(
                    localStorage.getItem(CHECKOUT.session.key_items_sp)
                  );
                  this.speciality.patientsPayload[this.payloadIndex].referrals[
                    refIndex
                  ].prescriptionList.forEach(item => {
                    if (json.indexOf(item.rxNumber) !== -1) {
                      json = json.filter(rx => {
                        return rx !== item.rxNumber;
                      });
                    }
                  });

                  localStorage.setItem(
                    CHECKOUT.session.key_items_sp,
                    JSON.stringify(json)
                  );
                  if (!json || json.length === 0) {
                    localStorage.removeItem(CHECKOUT.session.key_items_sp);
                    this._common.navigate(this.ROUTES.refill.absoluteRoute);
                  }
                  // reloading page to fetch delivery options again.
                  const unsolicited = res.checkoutDetails.find(item => {
                    return (
                      item.type === 'SPECIALTY' &&
                      item.subType === 'UNSOLICITED'
                    );
                  });
                  if (unsolicited) {
                    window.location.reload();
                  } else {
                    if (this.checkoutService.isCombo) {
                      sessionStorage.removeItem(
                        CHECKOUT.session.key_speciality_addresses
                      );
                      sessionStorage.removeItem(CHECKOUT.session.key_hd_data);
                      sessionStorage.removeItem(CHECKOUT.session.combo_key);
                      this.checkoutService.isCombo = false;
                      // Navigation for Combo checkout
                      this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
                    }
                  }
                } else {
                  let json = JSON.parse(
                    localStorage.getItem(CHECKOUT.session.key_items_sp)
                  );
                  const referral = this.speciality.patientsPayload[
                    this.payloadIndex
                  ].referral
                    ? this.speciality.patientsPayload[this.payloadIndex]
                        .referral
                    : this.speciality.patientsPayload[this.payloadIndex]
                        .referrals;
                  referral[refIndex].prescriptionList.forEach(item => {
                    //istanbul ignore else
                    if (json.indexOf(item.rxNumber) !== -1) {
                      json = json.filter(rx => {
                        return rx !== item.rxNumber;
                      });
                    }
                  });

                  localStorage.setItem(
                    CHECKOUT.session.key_items_sp,
                    JSON.stringify(json)
                  );
                  if (!json || json.length === 0) {
                    localStorage.removeItem(CHECKOUT.session.key_items_sp);
                    this._common.navigate(this.ROUTES.refill.absoluteRoute);
                  }
                  this.speciality.patientsPayload[
                    this.payloadIndex
                  ].referrals = this.speciality.patientsPayload[
                    this.payloadIndex
                  ].referrals.filter(item => {
                    return item.referralId !== removeReferral.referralId;
                  });
                  if (
                    this.speciality.patientsPayload[this.payloadIndex]
                      .prescriptionList
                  ) {
                    this.speciality.patientsPayload[
                      this.payloadIndex
                    ].prescriptionList = this.speciality.patientsPayload[
                      this.payloadIndex
                    ].prescriptionList.slice(refIndex, 1);
                  }
                }

                // reload when presc removal is completed
                // this._common.navigate(this.ROUTES.refill.absoluteRoute);
              } else if (res.messages.length) {
                this._messageService.addMessage(
                  new Message(
                    'Unable to remove referral, please try again after some time',
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              } else {
                this.speciality.patientsPayload = [];
                sessionStorage.removeItem(
                  CHECKOUT.session.key_speciality_addresses
                );
                localStorage.removeItem(CHECKOUT.session.key_items_sp);
                this._common.navigate(this.ROUTES.refill.absoluteRoute);
              }
            },
            err => {
              this.ondeliveryOptionsError();
            }
          );
        } else {
          // if removeRx response Error
          this.ondeliveryOptionsError();
        }
      },
      err => {
        this.ondeliveryOptionsError();
      }
    );
  }

  /**
   * called to check disabled stated for card checkbox.
   *
   * @param card
   * @param referral
   * @returns {boolean}
   */
  cardStateCheck(card: any, referral: any) {
    let state = false;
    //istanbul ignore else
    if (!card.isSelected) {
      //istanbul ignore else
      if (referral.payBy === '1' && this.countSelected(referral) === 1) {
        state = true;
        //istanbul ignore else
      } else if (referral.payBy === '2' && this.countSelected(referral) === 2) {
        state = true;
      }
    }
    return state;
  }

  /**
   * convert amount to decimal places
   *
   * @param event
   * @param refIndex
   */
  convertToDecimal(event, i) {
    event.target.value = parseFloat(event.target.value).toFixed(2);
  }

  redirectToUpdateCard(id) {
    this._common.navigate(
      `${ROUTES.checkout_sp.children.update_payment.absoluteRoute}?id=${id}&pid=${this.payload.scriptMedId}`
    );
  }

  isCCExpired(ccDetails) {
    const expDate = ccDetails.expDate.split('/');
    // tslint:disable-next-line: radix
    const ccExpMonth = parseInt(expDate[0]);
    // tslint:disable-next-line: radix
    const ccExpYear = parseInt(expDate[1]);

    const currentDate = new Date();
    let isCardInvalid = true;
    //istanbul ignore else
    if (ccExpYear > currentDate.getFullYear() % 100) {
      isCardInvalid = false;
    }
    //istanbul ignore else
    if (ccExpYear === currentDate.getFullYear() % 100) {
      if (ccExpMonth >= currentDate.getMonth() + 1) {
        isCardInvalid = false;
      } else {
        isCardInvalid = true;
      }
    }
    return isCardInvalid;
  }
  ondeliveryOptionsError() {
    this.checkoutService.loader = false;
    this.checkoutService.loaderOverlay = false;
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
  gaEvent(category, action): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    return event;
  }
  changeScheduleDate(value) {
    const date_value = value.split(':');
    this._gaService.sendEvent(
      this.gaEventwithData(
        TwoFaGA.category.specialty_checkout,
        TwoFaGA.action.changeDelivery,
        '',
        `Change date ${date_value[0]}`
      )
    );
  }

  gaEventwithData(category, action, label = '', data): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    event.label = label;
    event.data = data;
    return event;
  }
  addMorePres() {
    this._gaService.sendEvent(
      this.gaCommonEvent(
        TwoFaGA.category.specialty_checkout,
        TwoFaGA.action.addMorePres
      )
    );
  }
  gaCommonEvent(category, action): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    return event;
  }
}
