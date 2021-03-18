import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
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
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { TwoFaGA } from '@app/config/ga-constants';

@Component({
  selector: 'arxrf-checkout-speciality-patient',
  templateUrl: './cleansed-patient.component.html',
  styleUrls: ['./cleansed-patient.component.scss']
})
export class CleansedPatientComponent implements OnInit {
  @Input()
  patientData: any;
  @Input()
  cleansedPatientData: any;

  // @Output()
  // validate = new EventEmitter<PatientModel>();

  loaderState: boolean;

  ROUTES = ROUTES;

  payloadIndex: number;

  selectedShipDate: string;

  healthinfo_error = 'Please confirm to continue';

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
    public speciality: SpecialityService,
    private _gaService: GaService
  ) {}

  ngOnInit(): void {}

  /**
   * Get selected cards count for a given referral.
   *
   * @param referral
   * @returns {number}
   */
  countSelected(referral: any) {
    if (referral.creditCards === undefined) {
      return 0;
    }
    return referral.creditCards.filter(item => {
      return item.isSelected;
    }).length;
  }

  // addClinicalReviewInPayload() {
  //   this.clinical_review.sideeffects == '' || this.clinical_review.pharmacistcontact == '' || this.clinical_review.assistance == ''
  //   for ( var i in this.payload.referrals ) {
  //     this.payload.referrals[i].callMeReasons.sideEffects = this.clinical_review.sideeffects;
  //   }
  // }

  /**
   * enable do not want item option for prescriptions.
   *
   * @param {number} refIndex
   * @returns {boolean}
   */
  showDonotWantOption(refIndex: number): boolean {
    let state = false;
    if (this.patientData && this.patientData.prescriptions) {
      const prescriptions = this.patientData.prescriptions[refIndex]
        .prescriptions;
      const list = prescriptions.filter(item => {
        return !item.requestToRemove;
      });

      if (list.length > 1) {
        state = true;
      }
      return state;
    }
  }

  confirmAgreement(event) {
    if (event.target.checked) {
      this._gaService.sendEvent(this.gaEvent());
    }
  }

  gaEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = TwoFaGA.category.specialty_checkout;
    event.action = TwoFaGA.action.agreePricingTerms;
    return event;
  }
}
