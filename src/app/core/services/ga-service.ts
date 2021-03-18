import { data } from './../../../../tests/nrx-conf-response';
import { GAEvent, TwoFAEnum, GaData } from '@app/models/ga/ga-event';
import { Injectable } from '@angular/core';
import { TwoFaGA } from '@app/config/ga-constants';
declare let gtag: any;
/**
 * Service to handle Google Analytics events.
 */
@Injectable()
export class GaService {
  private tracker: any;

  constructor() {
    if (window['ga']) {
      try {
        this.tracker = window['ga'].getAll()[0];
        this.tracker.set('transport', 'beacon');
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Send event to GA.
   *
   * @param {GAEvent} event
   */
  sendEvent(event: GAEvent): void {
    try {
      this.checkAndUpdateTracker();
      if (this.tracker) {
        // this.tracker.send(
        //   'event',
        //   event.category,
        //   event.action,
        //   event.label ? event.label : '',
        //   event.data ? event.data : {}
        // );

        gtag('event', event.action, {
          'event_category': event.category,
          'event_label': event.label ? event.label : '',
          'value': event.data ? event.data : {}
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * check tracker and create if not found on load.
   */
  checkAndUpdateTracker(): void {
    if (!this.tracker && window['ga']) {
      this.tracker = window['ga'].getAll()[0];
      this.tracker.set('transport', 'beacon');
    }
  }

  sendGoogleAnalytics(pageInfo: GaData) {
    const event = <GAEvent>{};
    const { category, action } = TwoFaGA;
    switch (pageInfo.type) {
      case TwoFAEnum.TOLL_CLICK:
        event.category = category.getCode;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.CODE_SENT:
        event.category = category.emailSentError;
        event.action = action.back;
        break;
      case TwoFAEnum.CONTINUE_CLICK:
        event.category = category.getCode;
        event.action = action.continue;
        break;
      case TwoFAEnum.TOLL_CLICK_SEC_ERROR:
        event.category = category.securityQuestionError;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.BACK_SEC_ERROR:
        event.category = category.securityQuestionError;
        event.action = action.back;
        break;
      case TwoFAEnum.CONTINUE_SEC_ERROR:
        event.category = category.securityQuestionError;
        event.action = action.continue;
        break;
      case TwoFAEnum.BANNER_CLOSE_SEC_ERROR:
        event.category = category.securityQuestionError;
        event.action = action.closebutton;
        break;

      case TwoFAEnum.BANNER_CLOSE_EMAIL_ERROR:
        event.category = category.emailSentError;
        event.action = action.closebutton;
        break;

      case TwoFAEnum.PHONE_CODE_RESEND:
        event.category = category.codeSent;
        event.action = action.codeEmail;
        break;
      case TwoFAEnum.PHONE_CONTINUE:
        event.category = category.codeSent;
        event.action = action.continue;
        break;
      case TwoFAEnum.PHONE_BACK_ACTION:
        event.category = category.codeSent;
        event.action = action.back;
        break;
      case TwoFAEnum.PHONE_TOLL_CLICK:
        event.category = category.codeSent;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.EMAIL_BACK_ACTION:
        event.category = category.emailSent;
        event.action = action.back;
        break;
      case TwoFAEnum.EMAIL_TOLL_CLICK:
        event.category = category.emailSent;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.PHONE_CODE_RESEND_BANNER:
        event.category = category.codeSent;
        event.action = action.codeResent;
        break;
      case TwoFAEnum.PHONE_ERROR_CODE_ENTERED:
        event.category = category.codeSentError;
        event.action = action.closebutton;
        break;
      case TwoFAEnum.PHONE_ERROR_CODE_RESEND:
        event.category = category.codeSentError;
        event.action = action.codeEmail;
        break;
      case TwoFAEnum.PHONE_ERROR_CONTINUE:
        event.category = category.codeSentError;
        event.action = action.continue;
        break;
      case TwoFAEnum.PHONE_ERROR_TOLL_CLICK:
        event.category = category.codeSentError;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.PHONE_ERROR_BACK_ACTION:
        event.category = category.codeSentError;
        event.action = action.back;
        break;
      case TwoFAEnum.REQ_NEW_CODE_SI:
        event.category = category.emailSent;
        event.action = action.codeEmail;
        break;
      case TwoFAEnum.CON_EMAIL_SI:
        event.category = category.emailSent;
        event.action = action.continue;
        break;
      case TwoFAEnum.BACK_SEC:
        event.category = category.securityQuestion;
        event.action = action.back;
        break;
      case TwoFAEnum.CONTINUE_SEC:
        event.category = category.securityQuestion;
        event.action = action.continue;
        break;
      case TwoFAEnum.TOLL_CLICK_SEC:
        event.category = category.securityQuestion;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.BACK_CLICK_2FA:
        event.category = category.getCode;
        event.action = action.back;
        break;
      case TwoFAEnum.EMAIL_OPT_CLICK:
        event.category = category.getCode;
        event.action = action.email;
        break;
      case TwoFAEnum.CELL_OPT_CLICK:
        event.category = category.getCode;
        event.action = action.cell;
        break;
      case TwoFAEnum.HOME_OPT_CLICK:
        event.category = category.getCode;
        event.action = action.home;
        break;
      case TwoFAEnum.WORK_OPT_CLICK:
        event.category = category.getCode;
        event.action = action.work;
        break;
      case TwoFAEnum.SECURITY_OPT_CLICK:
        event.category = category.getCode;
        event.action = action.secQuestion;
        break;
      case TwoFAEnum.MAX_ATTEMPT_PHONE:
        event.category = category.phoneMaxCodeSent;
        event.action = action.maxAttempt;
        break;
      case TwoFAEnum.MAX_ATTEMPT_EMAIL:
        event.category = category.emailMaxCodeSent;
        event.action = action.maxAttempt;
        break;
      case TwoFAEnum.MAX_ATTEMPT_SEC_QUES:
        event.category = category.secQuesMaxAttempt;
        event.action = action.maxAttempt;
        break;
      case TwoFAEnum.EMAIL_ERROR_TOLL_FREE_CLICK:
        event.category = category.emailSentError;
        event.action = action.tollFree;
        break;
      case TwoFAEnum.REQ_NEW_CODE_SI_ERROR:
        event.category = category.emailSentError;
        event.action = action.codeEmail;
        break;
      case TwoFAEnum.CON_EMAIL_SI_ERROR:
        event.category = category.emailSentError;
        event.action = action.continue;
        break;
      case TwoFAEnum.ORDER_STATUS_SPECIALTY_CLICK:
        event.category = category.orderStatus;
        event.action = action.contactSpecialty;
        break;
      case TwoFAEnum.ORDER_STATUS_HOME_CLICK:
        event.category = category.orderStatus;
        event.action = action.contactHome;
        break;
      case TwoFAEnum.PCA_CONTINUE_CLICK:
        event.category = category.pca_rx_prescription_review;
        event.action = action.pca_confirmation;
        break;
      case TwoFAEnum.PCA_REMOVE:
        event.category = category.pca_Prescription;
        event.action = action.pca_remove;
        break;
      case TwoFAEnum.PCA_CONFIRM_REMOVE:
        event.category = category.pca_Prescription;
        event.action = action.pca_delete;
        break;
      case TwoFAEnum.ADD_PRESCRIPTION:
        event.category = category.pca_Prescription;
        event.action = action.pca_addprescription;
        break;
      case TwoFAEnum.STATUS_CLICK:
        event.category = category.manage_prescriptions;
        event.action = action.status;
        break;
      case TwoFAEnum.REFILL_CLICK:
        event.category = category.orderStatus;
        event.action = action.refill;
        break;
      case TwoFAEnum.PCA_REVIEW_CANCEL:
        event.category = category.pca_rx_prescription_review;
        event.action = action.pca_cancel;
        break;
      case TwoFAEnum.PCA_REVIEW_SUBMIT:
        event.category = category.pca_rx_prescription_review;
        event.action = action.pca_submit;
        break;
      case TwoFAEnum.PCA_CANCEL_CONFIRM:
        event.category = category.pca_Prescription;
        event.action = action.pca_confirmation;
        break;
      case TwoFAEnum.CONFIRM_CANCEL_REVIEW:
        event.category = category.transferReview;
        event.action = action.confirmCancel;
        break;
      case TwoFAEnum.CONFIRM_CANCEL:
        event.category = category.transfer;
        event.action = action.confirmCancel;
        break;
      case TwoFAEnum.CONFIRM_CANCEL_NEW_PCA:
        event.category = category.pca_rx_prescription_review;
        event.action = action.confirmCancel;
        break;
      case TwoFAEnum.EDIT_PATIENT_INFO:
        event.category = category.transferReview;
        event.action = action.editPatientInfo;
        break;
      case TwoFAEnum.EDIT_PRESCPTIONS:
        event.category = category.transferReview;
        event.action = action.editPrescriptions;
        break;
      case TwoFAEnum.EDIT_SHIPPING_ADDRESS:
        event.category = category.transferReview;
        event.action = action.editShippingAddress;
        break;
      case TwoFAEnum.CANCEL:
        event.category = category.transfer;
        event.action = action.cancel;
        break;
      case TwoFAEnum.SUBMIT_REQUEST:
        event.category = category.transfer;
        event.action = action.submitRequest;
        break;
      case TwoFAEnum.SUBMIT_REQUEST_REVIEW:
        event.category = category.transferReview;
        event.action = action.submitRequest;
        break;
      case TwoFAEnum.CANCEL_REVIEW:
        event.category = category.transferReview;
        event.action = action.cancel;
        break;
      case TwoFAEnum.ADD_PRESCRIPTION_TRANSFER:
        event.category = category.transfer;
        event.action = action.pca_addprescription;
        break;
      case TwoFAEnum.PCA_REMOVE_TRANSFER:
        event.category = category.transfer;
        event.action = action.pca_remove;
        break;
      case TwoFAEnum.PCA_CONFIRM_REMOVE_TRANSFER:
        event.category = category.transfer;
        event.action = action.pca_delete;
        break;
      case TwoFAEnum.LANDING_NEW_PCA:
        event.category = category.pca_Landing;
        event.action = action.pca_new_landing;
        break;
      case TwoFAEnum.LANDING_TRANSFER_PCA:
        event.category = category.pca_Landing;
        event.action = action.pca_transfer_landing;
        break;
      case TwoFAEnum.PCA_SUBMIT_REQUEST:
        event.category = category.pca_Prescription;
        event.action = action.submitRequest;
        break;
      case TwoFAEnum.PCA_CANCEL_REQUEST:
        event.category = category.pca_Prescription;
        event.action = action.cancel;
        break;
      case TwoFAEnum.EDIT_PATIENT_INFO_NEW:
        event.category = category.pca_rx_prescription_review;
        event.action = action.editPatientInfo;
        break;
      case TwoFAEnum.EDIT_PRESCPTIONS_NEW:
        event.category = category.pca_rx_prescription_review;
        event.action = action.editPrescriptionInfo;
        break;
      case TwoFAEnum.EDIT_SHIPPING_ADDRESS_NEW:
        event.category = category.pca_rx_prescription_review;
        event.action = action.editShippingAddress;
        break;
      case TwoFAEnum.EDIT_DOCTOR_INFO:
        event.category = category.pca_Prescription;
        event.action = action.editDoctorInfo;
        break;
      case TwoFAEnum.ORDER_STATUS_DROPDOWN:
        event.category = category.orderstatus_dropdown;
        event.action = action.orderstatus_fam_mem_add;
        break;
      case TwoFAEnum.ORDER_STATUS_FAM_MEM_CHANGED_DROPDOWN:
        event.category = category.orderstatus_dropdown;
        event.action = action.orderstatus_fam_mem_changed;
        break;
        case TwoFAEnum.HEALTH_CONDTION_KNOWN_MEDICATION:
          event.category = category.specialty_checkout_confirm_info;
          event.action = action.addMedication;
          break;
          case TwoFAEnum.SP_CHECKOUT_CREDIT_CARD:
            event.category = category.specialty_checkout;
            event.action = action.addCreditCard;
            break;

      default:
        break;
    }
    this.sendEvent(event);
  }
}
