import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  fakeAsync,
  ComponentFixture,
  TestBed,
  tick,
  async
} from '@angular/core/testing';
import { CommonUtil } from '@app/core/services/common-util.service';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { AddressInfoComponent } from './address-info.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormArray,
  FormControl
} from '@angular/forms';

import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { Message } from '@app/models/message.model';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { RegistrationService } from '@app/core/services/registration.service';
import { UserService } from '@app/core/services/user.service';
import { PasswordCheckData, ArxUser } from '@app/models';
import { ROUTES } from '@app/config';
import { STATE_US } from '@app/config';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '@app/shared/shared.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { autheticateRes } from '../../../../../../tests/twofaFlow';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

const mockUserdata = {
  FirstName: 'test',
  LastName: 'test',
  EnterprisePersonId: '123',
  DOB: '123',
  Gender: 'M',
  PhoneNumber: '828282828282',
  PhoneType: 'CELL',
  EmailAddress: 'test@test.com',
  Address1: '123',
  Address2: '123',
  City: 'test',
  State: 'test',
  zip: '636366'
};

const headerInfo = {
  profileInd: {
    isPhotoUser: true,
    isRxHIPAAUser: true,
    isRxUser: false,
    isDHAUser: true,
    isAARPUser: true,
    isEMPLUser: true,
    isLoyaltyUser: true,
    isRxAuthenticatedUser: true,
    isPatIdExists: true,
    isMedhelpUser: true,
    isQRUser: true,
    isStepsUser: true,
    confirmOverlay: true
  },
  cartInfo: { cartId: '123', rxCount: 123, itemCount: 123 },
  notificationInfo: { msgCount: 123 },
  profileInfo: {
    firstName: 'test',
    lastName: 'test',
    geoTargetEnabled: true,
    phoneNumber: 'test',
    profileId: 'test',
    loggedIn: 'test',
    emailId: 'test',
    numberOfSiteVisits: 123,
    meHshId: 'test'
  }
};

describe('BuyoutPrescriptionsComponent', () => {
  let component: AddressInfoComponent;
  let fixture: ComponentFixture<AddressInfoComponent>;
  let _common: CommonUtil;
  let _regservice: RegistrationService;
  let _userService: UserService;
  // tslint:disable-next-line: prefer-const
  let _contentService: JahiaContentService;
  // tslint:disable-next-line: prefer-const
  let _httpService: HttpClientService;
  let _http: HttpTestingController;
  let _messageService: MessageService;
  let _gaService: GaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [AddressInfoComponent],
      providers: [
        AppContext,
        HttpClientService,
        MessageService,
        DatePipe,
        CommonUtil,
        BrowserModule,
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddressInfoComponent);
        component = fixture.componentInstance;
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _regservice = TestBed.get(RegistrationService);
        _contentService = TestBed.get(JahiaContentService);
        _http = TestBed.get(HttpTestingController);
        _httpService = TestBed.get(HttpClientService);
        _messageService = TestBed.get(MessageService);
        _gaService = TestBed.get(GaService);

        const formData = {
          dateOfBirth: '11/11/1994',
          phoneNumber: '3333333333',
          city: 'abc',
          state: 'abc',
          zipCode: '60015',
          street1: 'abc1',
          aptSuite: 'N',
          disclaimerStatus: 'N',
          phoneType: 'Cell',
          login: 'test876@test.com',
          password: 'testing1',
          securityQuestionCode: '4',
          securityQuestionAnswer: 'test',
          address: {
            city: 'DEERFIELD',
            state: 'IL',
            zipCode: '60015',
            street1: '1419 LAKE COOK RD'
          },
          tncAcceptInd: true,
          smsOptInInd: true,
          emailOptInInd: true,
          gender: 'Male',
          firstName: 'aaa',
          lastName: 'bbb',
          primeId: '',
          regSource: 'rx',
          flow: 'ARX'
        };

        component.addressForm.setControl(
          'address',
          new FormControl(formData.address, [])
        );
        component.addressForm.setControl(
          'tncAcceptInd',
          new FormControl(true, [])
        );
        component.addressForm.setControl(
          'smsOptInInd',
          new FormControl(true, [])
        );
        component.addressForm.setControl(
          'emailOptInInd',
          new FormControl(true, [])
        );
        component.addressForm.setControl(
          'firstName',
          new FormControl('testwq', [])
        );
        component.addressForm.setControl(
          'lastName',
          new FormControl('testre', [])
        );
        component.addressForm.setControl('primeId', new FormControl('', []));
        component.addressForm.setControl(
          'regSource',
          new FormControl('rx', [])
        );
        component.addressForm.setControl('flow', new FormControl('ARX', []));
        component.addressForm.setValue(formData);
        _userService.user = new ArxUser('11942712532');
        spyOn(_userService, 'isSSOSessionActive').and.returnValues(true, false);
        fixture.detectChanges();
      });
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should call submitAdditionalDetails1', async(() => {
    component.addressForm.reset();
    component.isSSO = true;
    fixture.detectChanges();
    component.submitAdditionalDetails();
  }));

  it('should call submitAdditionalDetails2', async(() => {
    component.isSSO = true;
    component.provideOption = true;
    component.isUpgrading = true;
    fixture.detectChanges();
    component.submitAdditionalDetails();
  }));

  xit('should call submitAdditionalDetails3', () => {
    //Error Promise
    component.isSSO = false;
    component.isUpgrading = false;
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({ _body: JSON.stringify({ type: 'Error' }) })
    );
    fixture.detectChanges();
    component.submitAdditionalDetails();
  });

  it('should call submitAdditionalDetails4', async(() => {
    component.isSSO = false;
    component.isUpgrading = false;
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ ok: true, json: () => autheticateRes })
    );
    spyOn(component, 'processResponse').and.stub();
    fixture.detectChanges();
    component.submitAdditionalDetails();
  }));

  it('should call submitAdditionalDetails Error', async(() => {
    component.isSSO = false;
    component.isUpgrading = false;
    spyOn(_httpService, 'doPost').and.returnValue(Promise.reject('Error'));
    spyOn(component, 'processResponse').and.stub();
    fixture.detectChanges();
    component.submitAdditionalDetails();
  }));

  it('should call submitAdditionalDetails with Invalid form', async(() => {
    component.isSSO = false;
    component.isUpgrading = false;
    component.addressForm.setErrors({ invalid: true });
    fixture.detectChanges();
    component.submitAdditionalDetails();
  }));

  it(`Should call hideOption`, async(() => {
    component.hideOption(false);
  }));

  it('should call submitUpgradeRequest', async(() => {
    component.addressForm.controls.disclaimerStatus.setValue(false);
    // spyOn(_userService, 'isSSOSessionActive').and.returnValue(true);
    fixture.detectChanges();
    component.submitUpgradeRequest();
  }));

  it('should call processResponse', async(() => {
    const body = { messages: [{ code: 'WAG_W_REG_1047' }] };
    component.processResponse(body);
  }));

  it('should call processResponse2', async(() => {
    const body = { messages: [{ code: 'WAG_W_REG_1048' }] };
    component.processResponse(body);
  }));

  it('should call processResponse3', async(() => {
    const body = { links: {} };
    spyOn(_regservice, 'endureState').and.stub();
    spyOn(_gaService, 'sendEvent').and.stub();
    spyOn(_userService, 'initUser1').and.stub();
    component.processResponse(body);
  }));

  it('should call processResponse3', async(() => {
    spyOn(component, 'getQuestions').and.stub();
    spyOn(component, 'fetchUserInformationForSSO').and.stub();
    component.checkAndProcessSSO();
  }));

  it('should call checkboxFlag', async(() => {
    const event = { target: { checked: true } };
    component.checkboxFlag(event);
  }));

  it('should call checkboxFlag2', async(() => {
    const event = { target: { checked: false } };
    component.checkboxFlag(event);
  }));

  it('should call sendToLogin', async(() => {
    spyOn(_common, 'navigate').and.stub();
    component.isSSO = true;
    component.sendToLogin();
  }));

  it('should call sendToLogin2', async(() => {
    spyOn(_common, 'navigate').and.stub();
    component.isSSO = false;
    component.sendToLogin();
  }));

  it('should call checkdata', async(() => {
    component.checkdata();
  }));

  it('should call dobUpdater', async(() => {
    const event = { target: { checked: false } };
    component.dobUpdater(event);
  }));

  it('should call dobUpdater', async(() => {
    const data = {};
    component.prefillAddressComponents(data);
  }));

  it('should call populateSignUpCache', async(() => {
    component.populateSignUpCache();
  }));

  it('should call hideUpgradeCancelModel', async(() => {
    const event = true;
    component.hideUpgradeCancelModel(event);
  }));

  it('should call hideUpgradeCancelModel2', async(() => {
    const event = false;
    component.hideUpgradeCancelModel(event);
  }));

  it('should call cancelUpgradeProcess', async(() => {
    spyOn(_common, 'navigate').and.stub();
    component.cancelUpgradeProcess();
  }));

  it('should call declarationReadAndAgreeToPolicy', async(() => {
    const event = { target: { value: true } };
    component.declarationReadAndAgreeToPolicy(event);
  }));

  it('should call declarationReadAndAgreeToPolicy2', async(() => {
    const event = { target: { value: false } };
    component.declarationReadAndAgreeToPolicy(event);
  }));

  it('should call gaEvent', async(() => {
    component.isUpgrading = true;
    component.gaEvent();
  }));

  it('should call checkPassword', async(() => {
    const event = {};
    const response = {
      ok: true,
      json: () => {
        return { messages: [{ type: 'WARN', message: 'Warning' }] };
      }
    };
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.resolve(response)
    );
    component.checkPassword(event);
  }));

  it('should call checkPassword', async(() => {
    const event = {};
    const response = {
      ok: true,
      json: () => {
        return { messages: [{ type: 'ERROR', message: 'Warning' }] };
      }
    };
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.resolve(response)
    );
    component.checkPassword(event);
  }));

  it('should call checkPassword Error', async(() => {
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.reject('Error')
    );
    component.checkPassword({});
  }));

  it('should call preparePhoneNumber', async(() => {
    component.preparePhoneNumber('123', '123');
  }));

  it('should call preparePhoneNumber', async(() => {
    component.preparePhoneNumber(false, '123');
  }));

  it('should call getQuestions', async(() => {
    const response = {
      ok: true,
      json: () => {
        return { securityQuestions: [] };
      }
    };
    spyOn(_httpService, 'doGet').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.resolve(response)
    );
    component.getQuestions();
  }));

  it('should call getQuestions Error', async(() => {
    spyOn(_httpService, 'doGet').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.reject('Error')
    );
    component.getQuestions();
  }));

  it('should call checkEmail', async(() => {
    const response = {
      ok: true,
      json: () => {
        return { messages: [{ type: 'ERROR', message: 'Warning' }] };
      }
    };
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.resolve(response)
    );
    component.checkEmail({});
  }));

  it('should call checkEmail2', async(() => {
    const response = {
      ok: true,
      json: () => {
        return {};
      }
    };
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.resolve(response)
    );
    component.checkEmail({});
  }));

  it('should call checkEmail Error', async(() => {
    spyOn(_httpService, 'doPost').and.returnValue(
      // tslint:disable-next-line: arrow-return-shorthand
      Promise.reject('Error')
    );
    component.checkEmail({});
  }));

  it('should call checkAndProcessHeaderInfo', async(() => {
    _userService.user = new ArxUser('11948190939');
    _userService.user['headerInfo'] = headerInfo;
    _regservice.signupDataCache['address'] = '123';
    spyOn(component, 'populateSignUpCache').and.stub();
    spyOn(component, 'getQuestions').and.stub();
    component.checkAndProcessHeaderInfo();
  }));

  it('should call checkAndProcessHeaderInfo1', async(() => {
    _userService.user = new ArxUser('11948190939');
    headerInfo.profileInd.isRxUser = true;
    _userService.user['headerInfo'] = headerInfo;
    _regservice.signupDataCache['address'] = '123';
    spyOn(component, 'populateSignUpCache').and.stub();
    spyOn(component, 'getQuestions').and.stub();
    component.checkAndProcessHeaderInfo();
  }));

  it('should call fetchUserInformationForSSO', async(() => {
    spyOn(_userService, 'getsamlResponse').and.returnValue({
      _body: JSON.stringify(mockUserdata)
    });
    component.fetchUserInformationForSSO();
  }));

  it('should call fetchUserInformationForSSO2', async(() => {
    mockUserdata.Gender = 'F';
    mockUserdata.PhoneType = 'HOME';
    spyOn(_userService, 'getsamlResponse').and.returnValue({
      _body: JSON.stringify(mockUserdata)
    });
    component.fetchUserInformationForSSO();
  }));

  it('should call fetchUserInformationForSSO2', async(() => {
    mockUserdata.Gender = 'H';
    mockUserdata.PhoneType = 'WORK';
    spyOn(_userService, 'getsamlResponse').and.returnValue({
      _body: JSON.stringify(mockUserdata)
    });
    component.fetchUserInformationForSSO();
  }));

  it('should call fetchUserInformationForSSO2', async(() => {
    mockUserdata.Gender = 'H';
    mockUserdata.PhoneType = 'WORK';
    delete mockUserdata.PhoneNumber;
    spyOn(_userService, 'getsamlResponse').and.returnValue({
      _body: JSON.stringify(mockUserdata)
    });
    component.fetchUserInformationForSSO();
  }));

  it('should call fetchUserInformationForSSO2', async(() => {
    mockUserdata.PhoneType = 'test';
    spyOn(_userService, 'getsamlResponse').and.returnValue({
      _body: JSON.stringify(mockUserdata)
    });
    component.fetchUserInformationForSSO();
  }));
});
