import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';

import { CommonUtil } from './common-util.service';
import { UserService } from './user.service';
import { ArxUser } from '@app/models';
import { CheckoutService } from './checkout.service';
import { HttpClientService } from './http.service';
import { MessageService } from './message.service';
import {
  prescriptions,
  CLEANSED_PRES
} from '../../../../test/mocks/prescriptions';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';

describe('AppContextService', () => {
  let checkoutService: CheckoutService;
  let _userService: UserService;
  let _common: CommonUtil;
  let _http: HttpClientService;
  let _message: MessageService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        checkoutService = TestBed.get(CheckoutService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _http = TestBed.get(HttpClientService);
        _message = TestBed.get(MessageService);
      });
  }));

  it('AppContextService Instance is available', () => {
    expect(checkoutService).toBeTruthy();
  });

  it('should call - deliveryOptions', () => {
    spyOn(sessionStorage, 'getItem').and.stub();
    spyOn(_http, 'postData').and.stub();
    checkoutService.deliveryOptions();
    expect(_http.postData).toHaveBeenCalled();
  });

  it('should call - storeReviewRefresh', () => {
    spyOn(sessionStorage, 'setItem').and.stub();
    checkoutService.storeReviewRefresh('');
    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  it('should call - storeCheckoutStateInSession - HOMEDELIVERY', () => {
    checkoutService.data_deliveryOptions = {
      specialtyCombo: 'test',
      checkoutDetails: [{ subType: 'HOMEDELIVERY' }]
    };
    spyOn(sessionStorage, 'setItem').and.stub();
    checkoutService.storeCheckoutStateInSession();
    expect(sessionStorage.setItem).toHaveBeenCalled();
  });

  it('should call - storeCheckoutStateInSession - CLEANSED', () => {
    checkoutService.data_deliveryOptions = {
      specialtyCombo: '',
      checkoutDetails: [{ subType: 'CLEANSED' }]
    };
    spyOn(sessionStorage, 'removeItem').and.stub();
    checkoutService.storeCheckoutStateInSession();
    expect(sessionStorage.removeItem).toHaveBeenCalled();
  });

  it('should call - storeCheckoutStateInSession- UNSOLICITED', () => {
    checkoutService.data_deliveryOptions = {
      specialtyCombo: '',
      checkoutDetails: [{ subType: 'UNSOLICITED' }]
    };
    spyOn(sessionStorage, 'removeItem').and.stub();
    checkoutService.storeCheckoutStateInSession();
    expect(sessionStorage.removeItem).toHaveBeenCalled();
  });

  it('should call - displayServiceNotification', () => {
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.displayServiceNotification();
    expect(_message.addMessage).toHaveBeenCalled();
  });

  it('should call - addPrescriptionInSession', () => {
    const prescription = { rxNumber: 123, viewId: 'test' };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(['162877081903', '162877081699'])
    );
    checkoutService.addPrescriptionInSession(prescription, 'HOMEDELIVERY');
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should call - addPrescriptionInSession', () => {
    const prescription = { rxNumber: 0, viewId: 'test' };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(['162877081903', '162877081699'])
    );
    checkoutService.addPrescriptionInSession(prescription, 'HOMEDELIVERY');
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should call - addPrescriptionInSession', () => {
    const prescription = { rxNumber: 123, viewId: 'test' };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(['162877081903', '162877081699'])
    );
    checkoutService.addPrescriptionInSession(prescription, 'CLEANSED');
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should call - removePrescriptionFromSession', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(['162877081903', '162877081699'])
    );
    checkoutService.removePrescriptionFromSession(
      '162877081903',
      'HOMEDELIVERY'
    );
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should call - removePrescriptionFromSession', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(['162877081903', '162877081699'])
    );
    checkoutService.removePrescriptionFromSession('162877081903', 'CLEANSED');
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('should call - resetCheckoutStatus', () => {
    spyOn(localStorage, 'removeItem').and.stub();
    spyOn(sessionStorage, 'removeItem').and.stub();
    checkoutService.resetCheckoutStatus();
    expect(localStorage.removeItem).toHaveBeenCalled();
  });

  it('should call - initPayload', () => {
    checkoutService.initPayload();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - countSelected - creditCard is undefined', () => {
    const referral = {
      boxDetails: { shippingInfo: { creditCard: undefined } }
    };
    checkoutService.countSelected(referral);
    expect(checkoutService).toBeTruthy();
  });

  it('should call - countSelected', () => {
    const referral = {
      boxDetails: { shippingInfo: { creditCard: [123, 345, 56] } }
    };
    checkoutService.countSelected(referral);
    expect(checkoutService).toBeTruthy();
  });

  it('should call - isAllPrescriptionValid', () => {
    const prescription = prescriptions.prescriptions;
    checkoutService.isAllPrescriptionValid(prescription);
    expect(checkoutService).toBeTruthy();
  });

  it('should call - storeHomeDeliveryItemsInCache', fakeAsync(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue('[162877081699]');
    checkoutService.storeHomeDeliveryItemsInCache(prescriptions.prescriptions);
    flush();
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('should call - storeUnsolicitedItemsCache', fakeAsync(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue('[162877081699]');
    checkoutService.storeUnsolicitedItemsCache(CLEANSED_PRES);
    flush();
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('should call - storeCleansedItemsCache', fakeAsync(() => {
    spyOn(localStorage, 'setItem').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue('[162877081699]');
    checkoutService.storeCleansedItemsCache(CLEANSED_PRES);
    flush();
    expect(localStorage.setItem).toHaveBeenCalled();
  }));

  it('should call - displayInsuranceMessageForHD', () => {
    spyOn(_message, 'addMessage').and.stub();
    spyOn(sessionStorage, 'getItem').and.returnValue(
      JSON.stringify({ name: 'test' })
    );
    checkoutService.displayInsuranceMessageForHD();
    expect(_message.addMessage).toHaveBeenCalled();
  });

  it('should call - fetchAddressList', fakeAsync(() => {
    spyOn(_http, 'postData').and.stub();
    spyOn(localStorage, 'getItem').and.returnValue('123');
    checkoutService.fetchAddressList();
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - updateAddressCall', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.updateAddressCall(CLEANSED_PRES[0].selectedAdresss);
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - updateAddressCall - error case', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(Observable.throw({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.updateAddressCall(CLEANSED_PRES[0].selectedAdresss);
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - updateAddressCallFromReview', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.updateAddressCallFromReview(CLEANSED_PRES);
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - updateAddressCallFromReview - error case', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(Observable.throw({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.updateAddressCallFromReview(CLEANSED_PRES);
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - fetchHealthHistory - with message', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ message: 'test' })
    );
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistory();
    flush();
    expect(_http.postData).toHaveBeenCalled();
  }));

  it('should call - fetchHealthHistory - without healthInfo', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistory();
    expect(_http.postData).toHaveBeenCalled();
  });

  it('should call - fetchHealthHistory - with healthInfo', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ healthInfo: 'test' })
    );
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistory();
    expect(_http.postData).toHaveBeenCalled();
  });

  it('should call - fetchHealthHistory - error case', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ insuranceOnFile: true })
    );
    spyOn(checkoutService, 'onfetchHealthHistoryInfoError').and.stub();
    checkoutService.fetchHealthHistoryInfo();
    expect(checkoutService.onfetchHealthHistoryInfoError).toHaveBeenCalled();
  });

  it('should call - fetchHealthHistoryInfo - with message', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ message: 'test' })
    );
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistoryInfo();
    flush();
    expect(checkoutService).toBeTruthy();
  }));

  it('should call - fetchHealthHistoryInfo - without healthInfo', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistoryInfo();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - fetchHealthHistoryInfo - with healthInfo', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ healthInfo: 'test' })
    );
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.fetchHealthHistoryInfo();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - fetchHealthHistoryInfo - error case', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ insuranceOnFile: true })
    );
    spyOn(checkoutService, 'onfetchHealthHistoryInfoError').and.stub();
    checkoutService.fetchHealthHistoryInfo();
    expect(checkoutService.onfetchHealthHistoryInfoError).toHaveBeenCalled();
  });

  it('should call - getCheckoutType - mail & Spec', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(prescriptions.prescriptions)
    );
    checkoutService.getCheckoutType();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - getCheckoutType - mail & mail', () => {
    const pres = [
      {
        prescriptionName: 'XANAX 0.5MG TABLETS',
        rxNumber: '10',
        isValidRx: true,
        prescriptionType: 'mail'
      },
      {
        prescriptionName: 'LIPITOR 10MG TABLETS',
        rxNumber: '20',
        isValidRx: true,
        prescriptionType: 'mail'
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(pres));
    checkoutService.getCheckoutType();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - getCheckoutType - Spec & Spec', () => {
    const pres = [
      {
        prescriptionName: 'XANAX 0.5MG TABLETS',
        rxNumber: '10',
        isValidRx: true,
        prescriptionType: 'specialty'
      },
      {
        prescriptionName: 'LIPITOR 10MG TABLETS',
        rxNumber: '20',
        isValidRx: true,
        prescriptionType: 'specialty'
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(pres));
    checkoutService.getCheckoutType();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - getCheckoutType - Spec & mail', () => {
    const pres = [
      {
        prescriptionName: 'XANAX 0.5MG TABLETS',
        rxNumber: '10',
        isValidRx: true,
        prescriptionType: 'specialty'
      },
      {
        prescriptionName: 'LIPITOR 10MG TABLETS',
        rxNumber: '20',
        isValidRx: true,
        prescriptionType: 'mail'
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(pres));
    checkoutService.getCheckoutType();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - getCheckoutType - Spec & mail', () => {
    const pres = [
      {
        prescriptionName: 'XANAX 0.5MG TABLETS',
        rxNumber: '10',
        isValidRx: true,
        prescriptionType: 'cleansed'
      },
      {
        prescriptionName: 'LIPITOR 10MG TABLETS',
        rxNumber: '20',
        isValidRx: true,
        prescriptionType: 'cleansed'
      }
    ];
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(pres));
    checkoutService.getCheckoutType();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - getInsuranceStatus', () => {
    spyOn(_http, 'postData').and.stub();
    checkoutService.getInsuranceStatus();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - fetchInsuranceStatusData', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ insuranceOnFile: true })
    );
    spyOn(localStorage, 'setItem').and.stub();
    checkoutService.fetchInsuranceStatusData();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - updateAddressCallError', () => {
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.updateAddressCallError();
    expect(checkoutService).toBeTruthy();
  });

  it('should call - onfetchHealthHistoryInfoError', () => {
    spyOn(_message, 'addMessage').and.stub();
    checkoutService.onfetchHealthHistoryInfoError();
    expect(checkoutService.loaderState).toBeFalsy();
    expect(checkoutService).toBeTruthy();
  });
});
