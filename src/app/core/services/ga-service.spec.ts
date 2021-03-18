import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { GAEvent, TwoFAEnum, GaData } from '@app/models/ga/ga-event';
import { UserService } from './user.service';
import { GaService } from './ga-service';

describe('GaService', () => {
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let gaService: GaService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        gaService = TestBed.get(GaService);
      });
  }));
  it('Check GaService instance is available', () => {
    expect(GaService).toBeTruthy();
  });

  it('should call - sendEvent', () => {
    gaService.sendEvent({
      category: '',
      action: '',
      data: '',
      label: '',
      transport: ''
    });
  });

  it('should call - sendGoogleAnalytics', () => {
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CODE_SENT,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BACK_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.TOLL_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONTINUE_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.TOLL_CLICK_SEC_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BACK_SEC_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONTINUE_SEC_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BANNER_CLOSE_SEC_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BANNER_CLOSE_EMAIL_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_CODE_RESEND,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_CONTINUE,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_BACK_ACTION,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_TOLL_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EMAIL_BACK_ACTION,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EMAIL_TOLL_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_CODE_RESEND_BANNER,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_ERROR_CODE_ENTERED,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_ERROR_CODE_RESEND,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_ERROR_CONTINUE,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_ERROR_TOLL_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PHONE_ERROR_BACK_ACTION,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.REQ_NEW_CODE_SI,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CON_EMAIL_SI,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BACK_SEC,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONTINUE_SEC,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.TOLL_CLICK_SEC,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.BACK_CLICK_2FA,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EMAIL_OPT_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CELL_OPT_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.HOME_OPT_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.WORK_OPT_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.SECURITY_OPT_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.MAX_ATTEMPT_PHONE,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.MAX_ATTEMPT_EMAIL,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.MAX_ATTEMPT_SEC_QUES,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EMAIL_ERROR_TOLL_FREE_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.REQ_NEW_CODE_SI_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CON_EMAIL_SI_ERROR,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ORDER_STATUS_SPECIALTY_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ORDER_STATUS_HOME_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_CONTINUE_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_REMOVE,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_CONFIRM_REMOVE,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ADD_PRESCRIPTION,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.STATUS_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.REFILL_CLICK,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_REVIEW_SUBMIT,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_REVIEW_CANCEL,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_CANCEL_CONFIRM,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONFIRM_CANCEL_REVIEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONFIRM_CANCEL,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_PATIENT_INFO,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_PRESCPTIONS,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_SHIPPING_ADDRESS,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CANCEL,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CANCEL_REVIEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.SUBMIT_REQUEST,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.SUBMIT_REQUEST_REVIEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ADD_PRESCRIPTION_TRANSFER,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_REMOVE_TRANSFER,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_CONFIRM_REMOVE_TRANSFER,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.LANDING_NEW_PCA,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.LANDING_TRANSFER_PCA,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.CONFIRM_CANCEL_NEW_PCA,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_SUBMIT_REQUEST,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.PCA_CANCEL_REQUEST,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_PATIENT_INFO_NEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_PRESCPTIONS_NEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_SHIPPING_ADDRESS_NEW,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.EDIT_DOCTOR_INFO,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ORDER_STATUS_DROPDOWN,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.ORDER_STATUS_FAM_MEM_CHANGED_DROPDOWN,
      data: '',
      label: ''
    });
    gaService.sendGoogleAnalytics({
      type: TwoFAEnum.SCHEDULE_DELIVERY,
      data: '',
      label: ''
    });

    expect(GaService).toBeTruthy();
  });
});
