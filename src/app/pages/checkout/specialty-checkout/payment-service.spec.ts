import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { fakeAsync, TestBed } from '@angular/core/testing';
import { CheckoutService } from '@app/core/services/checkout.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { PaymentService } from './payment.service';

describe('paymentService', () => {
  let paymentService: PaymentService;
  let _userService: UserService;
  let _common: CommonUtil;
  let _http: HttpClientService;
  let _message: MessageService;
  let gaService: GaService;
  let _checkout: CheckoutService;
  let _util: CommonUtil;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        paymentService = TestBed.get(PaymentService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _http = TestBed.get(HttpClientService);
        _message = TestBed.get(MessageService);
        gaService = TestBed.get(GaService);
        _checkout = TestBed.get(CheckoutService);
        _util = TestBed.get(CommonUtil);
      });
  }));
  it('paymentService Instance is available', fakeAsync(() => {
    expect(paymentService).toBeTruthy();
  }));
  it(`should call gaEvent function`, () => {
    paymentService.gaEvent(true);
  });
  xit('should call - getCardData - HOMEDELIVERY', () => {
    const data = {
      checkoutDetails: [{ subType: 'HOMEDELIVERY' }],
      boxDetails: { shippingInfo: 'test' }
    };
    spyOn(sessionStorage, 'setItem').and.stub();
    paymentService.getCardData(data, '');
  });
  it(`should call saveCardInfo function`, () => {
    const cardPayload = {
      creditCard: [
        {
          creditCardType: '1234',
          expDate: '01/01/2024',
          ccTokenNumber: '1234',
          subfid9B: '1234',
          zipCode: '85002',
          rxType: 'test'
        }
      ]
    };
    paymentService.saveCardInfo(cardPayload, false, '');
  });
  it(`should call fetchCardData function`, () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({ rxorders: {} }));
    spyOn(paymentService, 'getCardData').and.returnValue('');
    paymentService.fetchCardData('');
  });

  it('should call fetchCardData function - no rxorders', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({
        rxorders: null,
        messages: [{ message: 'test' }]
      })
    );
    spyOn(paymentService, 'getCardData').and.returnValue('');
    paymentService.fetchCardData('');
  });

  it(`should call fetchCardData function - error`, () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ rxorders: {} })
    );
    spyOn(paymentService, 'getCardData').and.returnValue('');
    spyOn(_message, 'addMessage').and.stub();
    paymentService.fetchCardData('');
  });

  it(`should call saveCardInfo function`, () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({
        messages: [{ message: 'test' }],
        messageList: [{ code: 'WAG_I_SRX_PAYMENTS_001' }]
      })
    );
    spyOn(_checkout, 'storeReviewRefresh').and.stub();
    spyOn(paymentService, 'getCardData').and.returnValue('');
    spyOn(_message, 'addMessage').and.stub();
    spyOn(_util, 'navigate').and.stub();
    paymentService.saveCardInfo('', '', undefined);
  });

  it(`should call saveCardInfo function - error`, () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ rxorders: {} })
    );
    spyOn(paymentService, 'getCardData').and.returnValue('');
    spyOn(_message, 'addMessage').and.stub();
    paymentService.saveCardInfo('', '', undefined);
  });
});
