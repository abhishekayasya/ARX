import { Injectable, OnInit } from '@angular/core';
import { SpecialityContext } from '@app/models/checkout/speciality.context';
import { CHECKOUT } from '@app/config/checkout.constant';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GAEvent, GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { GA } from '@app/config/ga-constants';

@Injectable()
export class SpecialityService {
  hideHead = false;

  cleansedTermsAndConditions = false;

  patientsPayload = [];

  context: SpecialityContext;

  constructor(
    public checkoutService: CheckoutService,
    private _gaService: GaService
  ) {
    if (sessionStorage.getItem(CHECKOUT.session.key_sp_context) != null) {
      this.context = JSON.parse(
        sessionStorage.getItem(CHECKOUT.session.key_sp_context)
      );
    } else {
      this.context = <SpecialityContext>{};
    }
  }
  // this._gaService.sendGoogleAnalytics(<GaData>{
  //   type: TwoFAEnum.SUBMIT_REQUEST_REVIEW
  // });

  /**
   * save user selection in session store.
   *
   * @returns {Promise<void>}
   */
  async savePatientContext(payloadIndex, event?) {
    if (event.target.checked) {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.HEALTH_CONDTION_KNOWN_MEDICATION
      });
    }
    let existState = false;
    if (this.context.patient === undefined) {
      this.context.patient = [];
    }

    if (!this.context.healthInfo) {
      this.context.healthInfo = [];
    }

    const healthInfo = this.context.healthInfo.find(
      item => (item.id = this.patientsPayload[payloadIndex].scriptMedId)
    );
    if (healthInfo) {
      healthInfo.healthInfo = {
        nodrugAllergies: this.patientsPayload[payloadIndex].nodrugAllergies,
        noadditionalMedication: this.patientsPayload[payloadIndex]
          .noadditionalMedication,
        nohealthConditions: this.patientsPayload[payloadIndex]
          .nohealthConditions
      };
    } else {
      this.context.healthInfo.push({
        id: this.patientsPayload[payloadIndex].scriptMedId,
        healthInfo: {
          nodrugAllergies: this.patientsPayload[payloadIndex].nodrugAllergies,
          noadditionalMedication: this.patientsPayload[payloadIndex]
            .noadditionalMedication,
          nohealthConditions: this.patientsPayload[payloadIndex]
            .nohealthConditions
        }
      });
    }

    if (!this.context.clinical_review) {
      this.context.clinical_review = [];
    }

    const clinical_reviewInfo = this.context.clinical_review.find(
      item => (item.id = this.patientsPayload[payloadIndex].scriptMedId)
    );

    if (clinical_reviewInfo) {
      clinical_reviewInfo.clinical_review = this.patientsPayload[
        payloadIndex
      ].clinical_review;
      clinical_reviewInfo.callMeReasons = this.patientsPayload[
        payloadIndex
      ].callMeReasons;
    } else {
      this.context.clinical_review.push({
        id: this.patientsPayload[payloadIndex].scriptMedId,
        clinical_review: this.patientsPayload[payloadIndex].clinical_review,
        callMeReasons: this.patientsPayload[payloadIndex].callMeReasons
      });
    }

    // tslint:disable-next-line: forin
    for (const index in this.patientsPayload[payloadIndex].referrals) {
      const referral = this.patientsPayload[payloadIndex].referrals[index];
      const id = `${this.patientsPayload[payloadIndex].scriptMedId}_${referral.referralId}`;
      const context_updated = {
        payBy: referral.payBy,
        clDeliveryDate: referral.boxDetails.shippingInfo.selectedDate,
        prefDelDtNotAvailable: referral.callMeReasons.prefDelDtNotAvailable,
        id: id,
        dueNow: []
      };

      // if (referral.shippingInfo.selectedDate != undefined && referral.shippingInfo.selectedDate != "") {
      //   context_updated['unDeliveryDateBak'] = referral.shippingInfo.selectedDate;
      // }
      const creditCards = referral.boxDetails.shippingInfo.creditCard;
      if (creditCards) {
        creditCards.forEach(card => {
          if (card.isSelected) {
            context_updated.dueNow.push({
              id: card.paymentMethodId,
              amount: card.dueNow ? parseFloat(card.dueNow).toFixed(2) : '0.00'
            });
          }
        });
      }

      this.context.patient.forEach(item => {
        if (item.id === id) {
          existState = true;
          Object.assign(item, context_updated);
          return;
        }
      });

      if (!existState) {
        this.context.patient.push(context_updated);
      }

      this.checkoutService.persistSpecialityContext(this.context);
    }
  }

}
