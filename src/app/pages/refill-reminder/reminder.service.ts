import {Injectable} from '@angular/core';
import { SpecialityContext } from '@app/models/checkout/speciality.context';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CHECKOUT } from '@app/config/checkout.constant';

@Injectable()
export class ReminderService {

  patientsPayload = [];

 // constructor(){}

  hideHead = false;

  cleansedTermsAndConditions = false;

 // patientsPayload = [];

  context: SpecialityContext;

  constructor(
    public checkoutService: CheckoutService,
  ) {
      //istanbul ignore else
    if (sessionStorage.getItem(CHECKOUT.session.key_sp_context) != null) {
      this.context = JSON.parse(sessionStorage.getItem(CHECKOUT.session.key_sp_context));
    } else {
      this.context = <SpecialityContext>{};
    }
  }

   /**
     * save user selection in session store.
     *
     * @returns {Promise<void>}
     */
    async savePatientContext(payloadIndex) {
      let existState = false;
      //istanbul ignore else
      if (this.context.patient === undefined) {
          this.context.patient = [];
      }
//istanbul ignore else
      if (!this.context.healthInfo) {
          this.context.healthInfo = [];
      }

      const healthInfo = this.context.healthInfo.find(item => item.id = this.patientsPayload[payloadIndex].scriptMedId);
      if (healthInfo) {
          healthInfo.healthInfo = {
              nodrugAllergies: this.patientsPayload[payloadIndex].nodrugAllergies,
              noadditionalMedication: this.patientsPayload[payloadIndex].noadditionalMedication,
              nohealthConditions: this.patientsPayload[payloadIndex].nohealthConditions
          };
      } else {
          this.context.healthInfo.push({
              id: this.patientsPayload[payloadIndex].scriptMedId,
              healthInfo: {
                  nodrugAllergies: this.patientsPayload[payloadIndex].nodrugAllergies,
                  noadditionalMedication: this.patientsPayload[payloadIndex].noadditionalMedication,
                  nohealthConditions: this.patientsPayload[payloadIndex].nohealthConditions
              }
          });
      }

      if (!this.context.clinical_review) {
          this.context.clinical_review = [];
      }

      const clinical_reviewInfo = this.context.clinical_review.find(item => item.id = this.patientsPayload[payloadIndex].scriptMedId);

      if (clinical_reviewInfo) {
          clinical_reviewInfo.clinical_review = this.patientsPayload[payloadIndex].clinical_review;
          clinical_reviewInfo.callMeReasons = this.patientsPayload[payloadIndex].callMeReasons;
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

          const creditCards = referral.boxDetails.shippingInfo.creditCard;
          //istanbul ignore else
          if (creditCards) {
              creditCards.forEach(
                  (card) => {
                      if (card.isSelected) {
                          context_updated.dueNow.push({
                              id: card.paymentMethodId,
                              amount: (card.dueNow) ? parseFloat(card.dueNow).toFixed(2) : '0.00'
                          });
                      }
                  }
              );
          }

          this.context.patient.forEach((item) => {
              //istanbul ignore else
              if (item.id === id) {
                  existState = true;
                  Object.assign(item, context_updated);
                  return;
              }
          });
          //istanbul ignore else
          if (!existState) {
              this.context.patient.push(context_updated);
          }

          this.checkoutService.persistSpecialityContext(this.context);
      }
  }





}
