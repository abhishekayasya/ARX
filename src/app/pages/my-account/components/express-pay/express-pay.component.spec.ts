import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { ExpressPayComponent } from './express-pay.component';
import { GaService } from '@app/core/services/ga-service';
import { MessageService } from '@app/core/services/message.service';
import { autheticateRes_reject } from '../../../../../../tests/twofaFlow';
const MockPromoiseData1 = {
  messages: [
    { code: 'WAG_I_RX_SETTINGS_010', message: 'Login success', type: 'INFO' }
  ],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const MockPromoiseData2 = {
  messages: [
    { code: 'WAG_I_RX_SETTINGS_004', message: 'Login success', type: 'INFO' }
  ],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const MockPromoiseData3 = {
  messages: [{ message: 'Login success', type: 'INFO' }],
  links: [{ rel: 'redirect', href: '/youraccount/default.jsp' }]
};

const MockObservableeData4 = {
  status: '200 OK',
  tokenDetails: [{ transactionId: '0987654321' }]
};

const MockObservableeData5 = {
  status: '200 OK',
  tokenDetails: [{ transactionIds: '0987654321' }]
};

const miockData4 = {};
describe('ExpressPayComponent', () => {
  let component: ExpressPayComponent;
  let fixture: ComponentFixture<ExpressPayComponent>;
  let _commonUtil: CommonUtil;
  let _userService: UserService;
  let _gaService: GaService;
  let _regService: RegistrationService;
  let _httpService: HttpClientService;
  let _messageService: MessageService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpressPayComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ExpressPayComponent);
        component = fixture.componentInstance;
        _commonUtil = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _regService = TestBed.get(RegistrationService);
        _gaService = TestBed.get(GaService);
        _httpService = TestBed.get(HttpClientService);
        _messageService = TestBed.get(MessageService);
        fixture.detectChanges();
      });
  }));

  it('should create ExpressPayComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`Should call gaEvent`, () => {
    component.gaEvent('test');
  });

  it(`Should call gaEvent`, () => {
    component.gaEvent('test', 'test1');
  });

  it(`Should call fireCancelCreditCardGAEvent`, () => {
    component.fireCancelCreditCardGAEvent();
  });

  it(`Should call fireDeleteCreditCardGAEvent`, () => {
    component.fireDeleteCreditCardGAEvent();
  });

  it(`Should call fireSaveCreditCardGAEvent`, () => {
    component.fireSaveCreditCardGAEvent();
  });

  it(`Should call fireAddCreditCardGAEvent`, () => {
    component.fireAddCreditCardGAEvent();
  });

  it(`Should call updateCCType`, () => {
    const event = {
      type: 'test'
    };
    component.updateCCType(event);
  });

  it(`Should call showDeleteModal`, () => {
    component.showDeleteModal();
  });

  it(`Should call deleteModalUpdate`, () => {
    component.deleteModalUpdate(false);
  });

  it(`Should call deleteConfirm`, () => {
    component.deleteConfirm('event', true);
    fixture.detectChanges();
    component.deleteConfirm('event', false);
  });

  it(`Should call goBackToPreviousRoute`, () => {
    component.isPastRouteEdit = true;
    component.goBackToPreviousRoute();
    fixture.detectChanges();
    component.isPastRouteEdit = false;
    component.goBackToPreviousRoute();
  });

  it(`Should call goBackToPreviousRoute`, () => {
    component.isPastRouteEdit = true;
    component.goBackToPreviousRoute();
    fixture.detectChanges();
    component.isPastRouteEdit = false;
    component.goBackToPreviousRoute();
  });

  it(`Should call submitCCData`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData1 })
    );

    component.submitCCData('1234567890', true);
  });

  it(`Should call submitCCData`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData2 })
    );

    component.submitCCData('1234567890', false);
  });

  it(`Should call submitCCData`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData3 })
    );

    component.submitCCData('1234567890', false);
  });

  it(`Should call submitCCData catch error`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject) })
    );

    component.submitCCData('1234567890', false);
  });

  it(`Should call addCreditCard`, () => {
    spyOn(component, 'createExpressPayForm').and.stub();
    spyOn(component, 'setValueToEdit').and.stub();

    component.addCreditCard(true);
  });

  it(`Should call createExpressPayForm`, () => {
    component.createExpressPayForm();
  });

  it(`Should call setValueToEdit`, () => {
    component.createExpressPayForm();
    component.setValueToEdit();
  });

  it(`Should call getExpressPayCard`, () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({
        messages: 'test',
        status: '200 OK',
        creditCard: '12 3 45 678 90 12345 67 890 123 456 7890',
        expiryMonth: 'May',
        expiryYear: '2020',
        creditCardType: 'SAVINGS'
      })
    );

    component.getExpressPayCard();
  });

  it(`Should call getExpressPayCard else block`, () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({
        messages: 'test',
        status: '200 OK'
      })
    );

    component.getExpressPayCard();
  });

  it(`Should call getExpressPayCard else block`, () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({
        messages: 'test',
        status: '200 OK'
      })
    );

    component.getExpressPayCard(true);
  });

  it(`should call getExpressPayCard error response `, () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getExpressPayCard();
  });

  it('Should call saveCreditCard', () => {
    spyOn(_userService, 'getCCToken').and.returnValue(
      Observable.of(MockObservableeData4)
    );
    spyOn(_commonUtil, 'encryptCCNumber').and.callThrough();
    component.createExpressPayForm();
    component._expressPayForm.patchValue({
      ccNumber: '12 3 45 678 90 12345 67 890 123 456 7890'
    });

    component.saveCreditCard(false);
  });

  it('Should call saveCreditCard', () => {
    spyOn(_userService, 'getCCToken').and.returnValue(
      Observable.of(MockObservableeData4)
    );
    spyOn(_commonUtil, 'encryptCCNumber').and.callThrough();
    component.createExpressPayForm();
    component._expressPayForm.patchValue({
      ccNumber: '12 3 45 678 90 12345 67 890 123 456 7890'
    });

    component.saveCreditCard(false);
  });

  it('Should call saveCreditCard', () => {
    spyOn(_userService, 'getCCToken').and.returnValue(
      Observable.of(MockObservableeData5)
    );
    spyOn(_commonUtil, 'encryptCCNumber').and.callThrough();
    component.createExpressPayForm();
    component._expressPayForm.patchValue({
      ccNumber: '12 3 45 678 90 12345 67 890 123 456 7890'
    });

    component.saveCreditCard(false);
  });

  it(`should call saveCreditCard error response `, () => {
    spyOn(_userService, 'getCCToken').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.createExpressPayForm();
    component.saveCreditCard(false);
  });
});
