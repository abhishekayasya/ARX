import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { ARX_MESSAGES, ROUTES, Microservice } from '@app/config';
import { Message } from '@app/models';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { PatientModel } from '@app/models/checkout/patient.model';
import { CheckoutService } from '@app/core/services/checkout.service';
import { PARAM } from '@app/config/param.constant';
import { SpecialityService } from '@app/pages/checkout/specialty-checkout/speciality.service';
import { CHECKOUT } from '@app/config/checkout.constant';
import { RefillReminderModule } from '@app/pages/refill-reminder/refill-reminder.module';
import { ReminderService } from '@app/pages/refill-reminder/reminder.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';

@Component({
  selector: 'arxrf-refillreminder-speciality-patient',
  templateUrl: './cleansed-patient.component.html',
  styleUrls: ['./cleansed-patient.component.scss']
})
export class CleansedPatientComponent implements OnInit {
  @Input()
  patientData: any;

  @Input()
  familyMemberInfo: any;

  @Output()
  validate = new EventEmitter<PatientModel>();

  loaderState = false;
  loaderOverlay = false;

  ROUTES = ROUTES;

  showMedicationsSearch: boolean;
  showAllergiesSearch: boolean;
  showConditionsSearch: boolean;
  showAddPricription = true;
  patientsPayload: any = {};
  isSpRxRemainder = false;
  healthInfoServiceErr = {
    addMedication: false,
    drugAllergies: false,
    healthConditions: false,
    errMessage: ARX_MESSAGES.ERROR.service_failed
  };

  @Input()
  payloadIndex: number;

  selectedShipDate: string;

  healthinfo_error = 'Please confirm to continue';
  show_healthinfo_missing_error = false;

  payload: PatientModel;

  clinical_review = {
    sideeffects: '',
    pharmacistcontact: '',
    assistance: ''
  };

  constructor(
    public appContext: AppContext,
    private _http: HttpClientService,
    private router: Router,
    private _messageService: MessageService,
    private _common: CommonUtil,
    private _userService: UserService,
    public checkoutService: CheckoutService,
    public speciality: ReminderService,
    private _gaService: GaService
  ) { sessionStorage.removeItem(AppContext.CONST.spRRUrl); }

  resetHealthInfoServiceErr() {
    this.healthInfoServiceErr.addMedication = false;
    this.healthInfoServiceErr.drugAllergies = false;
    this.healthInfoServiceErr.healthConditions = false;
  }

  showHealthInfoErrMsg(healthType) {
    if (healthType === 'Medications') {
      this.healthInfoServiceErr.addMedication = true;
    } else if (healthType === 'Drug Allergies') {
      this.healthInfoServiceErr.drugAllergies = true;
    } else {
      this.healthInfoServiceErr.healthConditions = true;
    }
    let errTimeout;
    clearTimeout(errTimeout);
    errTimeout = setTimeout(() => {
      this.resetHealthInfoServiceErr();
    }, 3000);
  }

  /**
   * Check payment information for referrals and process accordingly for
   * different cases.
   */
  checkAndProcessCleansedPayment() {
    const cleansed_addresses = [];
    const referral = this.patientData;

    // handling no due case
    if (parseInt(referral.dueNow, 10) === 0) {
      referral['noPaymentDue'] = true;
    } else {
      referral.payBy = '1';
    }

    const messages = referral.boxDetails.shippingInfo.messages;
    if (messages !== undefined) {
      if (messages[0].code === 'WAG_E_SRX_PAYMENTS_001') {
        referral.missingCCCase = true;
        referral.missingCCMessage = messages[0].message;
      }
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
    if (adresses && adresses.length > 0) {
      referral.selectedAdresss = adresses.find(address => {
        return address.preferred;
      });
    }
    if (!referral.selectedAdresss) {
      referral.selectedAdresss = adresses[0];
    }

    cleansed_addresses.push({
      scriptMedId: referral.scriptMedId,
      referralId: referral.referralId,
      addresses: adresses
    });
  }

  ngOnInit(): void {
    this.checkAndProcessCleansedPayment();
    this.patientData.boxDetails.shippingInfo.availableDates =
      this.checkoutService.removeHolidays(this.patientData.boxDetails.shippingInfo.availableDates);
    this.initPayload();
    this.isSpRxRemainder = localStorage.getItem('isSpecialityRefillRemainder') === 'true';
    this.showAddPricription =
      this.isSpRxRemainder !== undefined && this.isSpRxRemainder ? false : true;
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

  /**
   * called to check disabled stated for card checkbox.
   *
   * @param card
   * @param referral
   * @returns {boolean}
   */
  cardStateCheck(card: any, referral: any) {
    let state = false;
    if (!card.isSelected) {
      if (referral.payBy === '1' && this.countSelected(referral) === 1) {
        state = true;
      } else if (referral.payBy === '2' && this.countSelected(referral) === 2) {
        state = true;
      }
    }
    return state;
  }

  isCCExpired(ccDetails) {
    const expDate = ccDetails.expDate.split('/');
    // tslint:disable-next-line: radix
    const ccExpMonth = parseInt(expDate[0]);
    // tslint:disable-next-line: radix
    const ccExpYear = parseInt(expDate[1]);

    const currentDate = new Date();
    let isCardInvalid = true;

    if (ccExpYear > currentDate.getFullYear() % 100) {
      isCardInvalid = false;
    }
    if (ccExpYear === currentDate.getFullYear() % 100) {
      if (ccExpMonth >= currentDate.getMonth() + 1) {
        isCardInvalid = false;
      } else {
        isCardInvalid = true;
      }
    }
    return isCardInvalid;
  }

  /**
   * Updating payby value for given referral and reseting card selection to default.
   *
   * @param event
   * @param referral
   */

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
        return;
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
   * convert amount to decimal places
   *
   * @param event
   * @param refIndex
   */
  convertToDecimal(event, i) {
    event.target.value = parseFloat(event.target.value).toFixed(2);
  }

  /**
   * remove a referral for patient.
   *
   * @param refIndex
   * @param id
   */
  removeReferral(refIndex, id) {
    this._gaService.sendEvent(
      this.gaCommonEvent('/specialty-checkout', 'Remove referral')
    );
    const api = Microservice.remove_rx;
    const post_data = {
      rxId: ['S' + id]
    };

    this._http.postData(api, post_data).subscribe(
      res => {
        this.loaderState = false;

        if (res.rxorders !== undefined) {
          const info = res.rxorders.find(item => {
            return item.prescriptionType === 'specialtyCleansed';
          });

          if (info === undefined) {
            let json = JSON.parse(
              localStorage.getItem(CHECKOUT.session.key_items_sp)
            );
            this.speciality.patientsPayload[this.payloadIndex].referrals[
              refIndex
            ].prescriptions.forEach(item => {
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
            // reloading page to fetch delivery options again.
            this._common.navigate(this.ROUTES.checkout_sp.absoluteRoute);
          } else {
            let json = JSON.parse(
              localStorage.getItem(CHECKOUT.session.key_items_sp)
            );
            this.speciality.patientsPayload[this.payloadIndex].referral[
              refIndex
            ].prescriptions.forEach(item => {
              if (json.indexOf(item.rxNumber)) {
                json = json.filter(rx => {
                  return rx !== item.rxNumber;
                });
              }
            });

            localStorage.setItem(
              CHECKOUT.session.key_items_sp,
              JSON.stringify(json)
            );

            this.speciality.patientsPayload[
              this.payloadIndex
            ].referrals = this.speciality.patientsPayload[
              this.payloadIndex
            ].referrals.filter(item => {
              return item.referralId !== id;
            });
            this.speciality.patientsPayload[
              this.payloadIndex
            ].prescriptions = this.speciality.patientsPayload[
              this.payloadIndex
            ].prescriptions.slice(refIndex, 1);
          }
        } else if (res.messages !== undefined) {
          this._messageService.addMessage(
            new Message(
              'Unable to remove referral, please try again after some time',
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        } else {
          this.speciality.patientsPayload = [];
          localStorage.removeItem(CHECKOUT.session.key_items_sp);
          if (this.isSpRxRemainder) {
            this.setSpRRUrl();
          }
          this._common.navigate(this.ROUTES.refill.absoluteRoute);
        }
      },
      err => {
        this.loaderState = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  /**
   * close medications search window.
   *
   * @param event
   */
  closeMedications(event) {
    this.showMedicationsSearch = event;
  }

  /**
   * Update selected values to show.
   *
   * @param event
   */
  updateMedications(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .additionalMedication === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.additionalMedication = [];
    }
    this.submitHealthData('Medications', event);
  }

  /**
   * close allergies search window.
   *
   * @param event
   */
  closeAllergies(event) {
    this.showAllergiesSearch = event;
  }

  /**
   * Update selected values for allergies.
   *
   * @param event
   */
  updateAllergies(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .drugAllergies === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.drugAllergies = [];
    }
    this.submitHealthData('Drug Allergies', event);
  }

  /**
   * close conditions search window.
   *
   * @param event
   */
  closeConditions(event) {
    this.showConditionsSearch = event;
  }

  /**
   * Update selected values for conditions.
   *
   * @param event
   */
  updateConditions(event) {
    if (
      this.speciality.patientsPayload[this.payloadIndex].healthInfo
        .healthConditions === undefined
    ) {
      this.speciality.patientsPayload[
        this.payloadIndex
      ].healthInfo.healthConditions = [];
    }
    this.submitHealthData('Health Conditions', event);
  }

  deleteHealthItem(id: string, type: string, index: number, allergyCode?: string): void {
    this.loaderState = true;
    this.loaderOverlay = true;
    const healthHistoryRequestPayload = { flow: 'ARX' };
    const deletePayload = {
      healthHistoryType: `${type}`,
      drugList: [this._userService.deleteDrugObj(type, id, allergyCode)],
      flow: 'ARX'
    };
    if (this.familyMemberInfo.isFM) {
      healthHistoryRequestPayload["fId"] = this.familyMemberInfo.fid;
      deletePayload["fId"] = this.familyMemberInfo.fid;
    }

    this._http
      .postData(Microservice.health_history_retrieve, healthHistoryRequestPayload)
      .subscribe(() => {
        this._http
          .postData(Microservice.health_history_delete, deletePayload)
          .subscribe(response => {
            if (response.message.code === 'WAG_I_HEALTH_HISTORY_DELETE_006') {
              this.removeHealthItemFromList(id, type, allergyCode);
              this._http
                .postData(Microservice.health_history_retrieve, healthHistoryRequestPayload)
                .subscribe();
            }
            this.loaderState = false;
            this.loaderOverlay = false;
          });
      });
  }

  removeHealthItemFromList(id: string, type: string, allergyCode: string) {
    switch (type) {
      case 'Health Conditions':
        this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.healthConditions = this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.healthConditions.filter(item => {
          return item.drugId !== id && item.healthConditionCd !== id;
        });
        break;

      case 'Drug Allergies':
        this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.drugAllergies = this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.drugAllergies.filter(item => {
          return item.allergyCode ? item.allergyCode !== allergyCode : item.drugId !== id;
        });
        break;

      case 'Medications':
        this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.additionalMedication = this.speciality.patientsPayload[
          this.payloadIndex
        ].healthInfo.additionalMedication.filter(item => {
          return item.drugId !== id;
        });
        break;
    }
  }

  /**
   * initialize payload basic object for patient.
   */
  initPayload() {
    if (this.speciality.patientsPayload.length > 0) {
      this.payload = this.speciality.patientsPayload[this.payloadIndex];
    } else {
      this.payload = this.patientData;
      this.patientData.isValid = false;
      this.payload.add_update_svc_status = false;
      this.payload.termsAndConditions = false;

      const adresses = this.patientData.boxDetails.shippingInfo.srxDeliveryAddr;

      if (adresses && adresses.length > 0) {
        this.payload.selectedAddress = adresses.find(address => {
          return address.preferred || address.isPreferred;
        });
      }
      const payloadRef = { ...this.payload };
      this.payload.referrals = [];
      this.payload.referrals.push(payloadRef);

      if (!this.payload.selectedAddress) {
        this.payload.selectedAddress = adresses[0];
      }

      // tslint:disable-next-line: forin
      for (const index in this.payload.referrals) {
        this.payload.referrals[index].callMeReasons = {
          prefDelDtNotAvailable: false
        };

        this.payload.referrals[
          index
        ].boxDetails.shippingInfo.selectedDate = this.patientData.boxDetails.shippingInfo.availableDates[0];

        if (this.payload.healthInfo === undefined) {
          this.payload.healthInfo = <any>{};
        }

        this.payload.referrals[
          index
        ].prescriptions = this.patientData.prescriptionList;
      }

      this.payload.callMeReasons = {
        newInsurance: false,
        prescNotVisible: false,
        other: false,
        prescChange: false,
        reqDiffPresc: false,
        insuranceBillQtn: false,
        pharmCounsilQtn: '  ',
        prscQty: false,
        pharmacistContact: false,
        notes: ''
      };

      this.payload['clinical_review'] = this.clinical_review;
      this.speciality.patientsPayload.push(this.payload);
      this.payloadIndex = this.speciality.patientsPayload.length - 1;
      this.speciality.patientsPayload[
        this.payloadIndex
      ].boxDetails.shippingInfo.selectedDate = this.patientData.boxDetails.shippingInfo.availableDates[0];
      this.updateCCInformation();
      if (this.payload.healthInfo) {
        this.updateValuesLocally(
          'Medications',
          this.payload.healthInfo.additionalMedication
        );
        this.updateValuesLocally(
          'Health Conditions',
          this.payload.healthInfo.healthConditions
        );
        this.updateValuesLocally(
          'Drug Allergies',
          this.payload.healthInfo.drugAllergies
        );
      }
    }
    this.patientsPayload = this.speciality.patientsPayload[this.payloadIndex];
  }

  /**
   * update payload if preferred date is not available.
   *
   * @param {number} index
   * @param event
   */
  shippingDateNotAvailable(index: number, event) {
    if (event.target.checked) {
      this.payload.referrals[index].callMeReasons.prefDelDtNotAvailable = true;
      // this.payload.referrals[index].shippingInfo.selectedDate = "";
    } else {
      this.payload.referrals[index].callMeReasons.prefDelDtNotAvailable = false;
    }

    this.validatePatientData();
    // this.speciality.savePatientContext(this.payloadIndex);
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
      this.clinical_review.sideeffects === '' ||
      this.clinical_review.pharmacistcontact === '' ||
      this.clinical_review.assistance === ''
    ) {
      this.patientData.isValid = false;
      return;
    }

    this.patientData.referrals.forEach(
      function (item, index) {
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
      function (item, index) {
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
      this.payload.referrals[i].prescriptions = this.patientData.referrals[
        i
      ].prescriptions;
    }

    this.updateCCInformation();

    this.validate.emit(this.payload);
  }

  /**
   * Update cc information from patient data to payload
   */
  updateCCInformation() {
    // tslint:disable-next-line: forin
    for (const index in this.speciality.patientsPayload[this.payloadIndex]
      .referrals) {
      // set isSelected where selected is found in CC
      const ccList = this.speciality.patientsPayload[this.payloadIndex]
        .referrals[index].boxDetails.shippingInfo.creditCard;
      if (ccList) {
        ccList.forEach(cc => {
          if (cc.selected) {
            cc.isSelected = true;
          }
        });
      }

      if (
        this.countSelected(
          this.speciality.patientsPayload[this.payloadIndex].referrals[index]
        ) === 1
      ) {
        const dueNow = this.speciality.patientsPayload[this.payloadIndex]
          .referrals[index].dueNow;
        // sort CC list
        this.speciality.patientsPayload[this.payloadIndex].referrals[
          index
        ].boxDetails.shippingInfo.creditCard.sort(function (a, b) {
          return a.isSelected === true ? -1 : b.isSelected === true ? 1 : 0;
        });
        for (const i in this.speciality.patientsPayload[this.payloadIndex]
          .referrals[index].boxDetails.shippingInfo.creditCard) {
          if (
            this.speciality.patientsPayload[this.payloadIndex].referrals[index]
              .boxDetails.shippingInfo.creditCard[i].isSelected
          ) {
            this.speciality.patientsPayload[this.payloadIndex].referrals[
              index
            ].boxDetails.shippingInfo.creditCard[i].dueNow = dueNow;
          }
        }
      }
    }
  }

  /**
   * enable do not want item option for prescriptions.
   *
   * @param {number} refIndex
   * @returns {boolean}
   */
  showDonotWantOption(): boolean {
    let state = false;
    const prescriptions = this.patientData.prescriptionList;
    const list = prescriptions.filter(item => {
      return !item.isRequestToRemove;
    });

    if (list.length > 1) {
      state = true;
    }
    return state;
  }

  redirectToAddCard(referral) {
    if (this.isSpRxRemainder) {
      this.setSpRRUrl();
    }
      if (referral.boxDetails.shippingInfo.creditCard === undefined) {
        sessionStorage.setItem(CHECKOUT.session.key_nocard, 'true');
      }

    this._common.navigate(
      `${ROUTES.checkout_sp.children.add_payment.absoluteRoute}?pid=${this.payload.scriptMedId}`
    );
  }


  setSpRRUrl() {
    const srRRLink = sessionStorage.getItem(AppContext.CONST.login_callback_urlkey);
    sessionStorage.setItem(AppContext.CONST.spRRUrl, srRRLink);
  }

  redirectToUpdateCard(id) {
    if (this.isSpRxRemainder) {
      this.setSpRRUrl();
    }
    this._common.navigate(
      `${ROUTES.checkout_sp.children.update_payment.absoluteRoute}?id=${id}&pid=${this.payload.scriptMedId}`
    );
  }
  redirectToAddressBook(scriptMedId, referralID) {
    if (this.isSpRxRemainder) {
      this.setSpRRUrl();
    }
    this._common.navigate(
      // tslint:disable-next-line: max-line-length
      `${this.ROUTES.checkout_sp.children.address_book.absoluteRoute}?${PARAM.speciality_address_book.patient_id}=${scriptMedId}&${PARAM.speciality_address_book.referral_id}=${referralID}&subtype=${this.payload['subType']}`
    );
  }

  donotNeedItem(prescription, event) {
    if (event.target.checked) {
      prescription.requestToRemove = true;
      prescription.showRequestToRemove = true;
      prescription.isRequestToRemove = true;

      (function (pres) {
        window.setTimeout(() => {
          pres.showRequestToRemove = false;
        }, 5000);
      })(prescription);
    } else {
      prescription.requestToRemove = false;
      prescription.showRequestToRemove = false;
      prescription.isRequestToRemove = false;
    }
  }

  submitHealthData(type: string, list: Array<any>): void {
    this.loaderState = true;
    this.loaderOverlay = true;
    const healthHistoryRequestPayload = { flow: 'ARX' };
    const submitPayload = {
      healthHistoryType: type,
      drugList: []
    }
    if (this.familyMemberInfo.isFM) {
      healthHistoryRequestPayload["fId"] = this.familyMemberInfo.fid;
      submitPayload['fId'] = this.familyMemberInfo.fid;
    }

    this._http
      .postData(Microservice.health_history_retrieve, healthHistoryRequestPayload)
      .subscribe(() => {
        (list || []).forEach(item => {
          const obj = this._userService.getDrugObj(type, item);
          submitPayload.drugList.push(obj);
        });

        this._http
          .postData(Microservice.health_history_submit, submitPayload)
          .subscribe(
            response => {
              this.loaderState = false;
              this.loaderOverlay = false;
              if (response.message.code === 'WAG_I_HEALTH_HISTORY_SUBMIT_010') {
                this._http
                  .postData(Microservice.health_history_retrieve, healthHistoryRequestPayload)
                  .subscribe();
                this.updateValuesLocally(type, list);
              } else {
                this._messageService.addMessage(
                  new Message(
                    response.message.message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              }
            },

            () => {
              this.loaderState = false;
              this.loaderOverlay = false;

              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.service_failed,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );
        ////////
      });
  }

  updateValuesLocally(type: string, list: Array<any>): void {
    switch (type) {
      case 'Medications':
        (list || []).forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.additionalMedication.find(exist => {
            return item.drugId === exist.drugId;
          });
          if (!found) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.additionalMedication.push(item);
          }
        });
        break;

      case 'Health Conditions':
        (list || []).forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.healthConditions.find(exist => {
            if (item.drugId) {
              return item.drugId === exist.healthConditionCd;
            } else if (item.healthConditionCd) {
              return item.healthConditionCd === exist.healthConditionCd;
            } else {
              return item.drugId === exist.healthConditionCd;
            }
          });
          if (!found) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.healthConditions.push(item);
          }
        });
        break;

      case 'Drug Allergies':
        (list || []).forEach(item => {
          const found = this.speciality.patientsPayload[
            this.payloadIndex
          ].healthInfo.drugAllergies.find(exist => {
            if (item.drugId && exist.drugId) {
              return item.drugId === exist.drugId;
            } else if (item.drugId && exist.allergyCode) {
              return item.drugId === exist.allergyCode;
            } else if (item.allergyCode && exist.allergyCode) {
              return item.allergyCode === exist.allergyCode;
            } else {
              return item.drugId === exist.drugId;
            }

            // return (item.drugId == exist.drugId || item.drugId == exist.allergyCode || item.allergyCode == exist.allergyCode)
          });
          if (!found) {
            this.speciality.patientsPayload[
              this.payloadIndex
            ].healthInfo.drugAllergies.push(item);
          }
        });
        break;
    }
  }

  gaCommonEvent(category, action): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    return event;
  }
}
