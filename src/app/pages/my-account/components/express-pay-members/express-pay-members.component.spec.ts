import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { ExpressPayMembersComponent } from './express-pay-members.component';
import { GaService } from '@app/core/services/ga-service';
import { MessageService } from '@app/core/services/message.service';
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

const miockData4 = {};
describe('ExpressPayMembersComponent', () => {
  let component: ExpressPayMembersComponent;
  let fixture: ComponentFixture<ExpressPayMembersComponent>;
  let _commonUtil: CommonUtil;
  let _userService: UserService;
  let _gaService: GaService;
  let _regService: RegistrationService;
  let _httpService: HttpClientService;
  let _messageService: MessageService;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExpressPayMembersComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ExpressPayMembersComponent);
        component = fixture.componentInstance;
        _commonUtil = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _regService = TestBed.get(RegistrationService);
        _gaService = TestBed.get(GaService);
        _httpService = TestBed.get(HttpClientService);
        _messageService = TestBed.get(MessageService);
        // fixture.detectChanges();
      });
  }));

  it('should create ExpressPayMembersComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should create ngOnInit', () => {
    component.ngOnInit();
  });
  xit('should execute getExpressPayCard', () => {
    spy = spyOn(_httpService, 'getData').and.returnValue(
      Observable.of({
        expressPay: {
          messages: 'test',
          status: '200 OK',
          cardNumber: 1234567890,
          creditCard: '12 3 45 678 90 12345 67 890 123 456 7890',
          expiryMonth: 'May',
          expiryYear: '2020',
          creditCardType: 'SAVINGS',
          zipCode: '600060'
        }
      })
    );
    component.getExpressPayCard();
  });
  it('should execute getExpressPayCard else', () => {
    spy = spyOn(_httpService, 'getData').and.returnValue(
      Observable.of({
        messages: 'test',
        status: '200 OK'
      })
    );
    component.getExpressPayCard();
    expect(spy).toHaveBeenCalled();
  });
  it(`should excute getExpressPayCard error`, () => {
    spy = spyOn(_httpService, 'getData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getExpressPayCard();
    expect(spy).toHaveBeenCalled();
  });
  it(`should excute addCreditCard`, () => {
    component.addCreditCard(true);
  });
  it(`should excute saveCreditCard1`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData1 })
    );
    component.saveCreditCard(true);
  });
  xit(`should excute saveCreditCard`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData2 })
    );
    component.saveCreditCard(false);
  });
  it(`should excute saveCreditCard else`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MockPromoiseData3 })
    );
    component.saveCreditCard(true);
  });
  it(`should excute goBackToPreviousRoute`, () => {
    component.isPastRouteEdit = true;
    component.goBackToPreviousRoute();
  });
  it(`should excute goBackToPreviousRoute else`, () => {
    component.goBackToPreviousRoute();
    expect(component.addCardBlock).toBe(true);
    expect(component.addCardForm).toBe(false);
    expect(component.showCardBlock).toBe(false);
  });
  it(`should excute deleteConfirm`, () => {
    const event = { preventDefault() {} };
    component.deleteConfirm(event, true);
  });
  it(`should excute deleteConfirm`, () => {
    const event = { preventDefault() {} };
    component.deleteConfirm(event, false);
  });
  it(`should excute deleteModalUpdate`, () => {
    component.deleteModalUpdate(false);
    expect(component.isDeleteModalVisible).toBe(false);
  });
  it(`should excute showDeleteModal`, () => {
    component.showDeleteModal();
    expect(component.isDeleteModalVisible).toBe(true);
  });
  it(`should excute updateCCType`, () => {
    const event = { type: true };
    component.updateCCType(event);
  });
  it(`should excute updateMember`, () => {
    const event = { type: true };
    component.updateMember(event);
    expect(component.loaderOverlay).toBe(true);
  });
});
