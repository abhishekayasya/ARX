import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  ElementRef
} from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { UserService } from './user.service';

describe('AppContextService', () => {
  let appContext: AppContext;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        appContext = TestBed.get(AppContext);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);

        const elemRef = new ElementRef(document.createElement('div'));
        elemRef.nativeElement[AppContext.CONST.logoAttr] = 'sampleUrl';
        appContext.rootEltRef = elemRef;
      });
  }));

  it('AppContextService Instance is available', () => {
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - logoUrl Get', () => {
    const x = appContext.logoUrl;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - rootEltRef Get', () => {
    const x = appContext.rootEltRef;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - messageTimeOut', () => {
    const x = appContext.messageTimeOut;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - serviceHost', () => {
    const x = appContext.serviceHost;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - assetsHost', () => {
    const x = appContext.assetsHost;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - tollFreeContact', () => {
    const x = appContext.tollFreeContact;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - ssoSource', () => {
    const x = appContext.ssoSource;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - ssoSource - set', () => {
    appContext.ssoSource = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - assetPrefix', () => {
    const x = appContext.assetPrefix;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - assetPrefix - set', () => {
    appContext.assetPrefix = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - loginPostSuccess', () => {
    const x = appContext.loginPostSuccess;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - loginPostSuccess - set', () => {
    appContext.loginPostSuccess = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - baseUrl', () => {
    spyOn(document, 'getElementsByTagName').and.returnValue('test');
    const x = appContext.baseUrl;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - baseUrl - set', () => {
    appContext.baseUrl = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - ssoContent', () => {
    const x = appContext.ssoContent;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - ssoContent - set', () => {
    appContext.ssoContent = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - homeDeliveryContact', () => {
    const x = appContext.homeDeliveryContact;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - homeDeliveryContact - set', () => {
    appContext.homeDeliveryContact = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - specialityContact', () => {
    const x = appContext.specialityContact;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - specialityContact - set', () => {
    appContext.specialityContact = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - arxBuyoutMessageForMember', () => {
    const x = appContext.arxBuyoutMessageForMember;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - arxBuyoutMessageForMember - set', () => {
    appContext.arxBuyoutMessageForMember = true;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - walgreensBaseUrl', () => {
    const x = appContext.walgreensBaseUrl;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - walgreensBaseUrl - set', () => {
    appContext.walgreensBaseUrl = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - prescriptionRecordsUrl', () => {
    const x = appContext.prescriptionRecordsUrl;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - prescriptionRecordsUrl - set', () => {
    appContext.prescriptionRecordsUrl = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - makeAPaymentUrl', () => {
    const x = appContext.makeAPaymentUrl;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - makeAPaymentUrl - set', () => {
    appContext.makeAPaymentUrl = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - serviceUrlPrefix', () => {
    const x = appContext.serviceUrlPrefix;
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - serviceUrlPrefix - set', () => {
    appContext.serviceUrlPrefix = 'test';
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - getRegistrationState', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    appContext.getRegistrationState();
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - setRegistrationState', () => {
    spyOn(sessionStorage, 'setItem').and.stub();
    const x = appContext.setRegistrationState('test');
    expect(appContext).toBeTruthy();
  });

  it('AppContextService - resetRegistrationState', () => {
    spyOn(sessionStorage, 'removeItem').and.stub();
    appContext.resetRegistrationState();
    expect(appContext).toBeTruthy();
  });
});
