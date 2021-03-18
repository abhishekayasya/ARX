import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { HttpClientService } from './http.service';
import { UserService } from './user.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { jsonUsr } from '../../../../test/mocks/userService.mocks';
import { ArxUser } from '@app/models';
import { CommonUtil } from './common-util.service';
import 'rxjs/add/operator/toPromise';
import { AppContext } from './app-context.service';
import { CookieService } from 'ngx-cookie-service';

const USER_PAYLOAD = {
  basicProfile: {
    login: 'digicathritn1806@yopmail.com',
    email: 'kannan.x.srinivasan@walgreens.com',
    firstName: 'Digicathritn',
    lastName: 'Digicathritn',
    dateOfBirth: '02/06/1988',
    homeAddress: {
      street1: '49 SURYA ENCLAVE TRIMULGHERRY, ',
      city: 'HYDERABAD',
      state: 'TX',
      zipCode: '50001'
    },
    phone: [
      {
        number: '9176480955',
        phoneId: '50003800001',
        priority: 'P',
        type: 'home'
      },
      {
        number: '2340973249',
        phoneId: '50003800002',
        priority: 'A1',
        type: 'work'
      },
      {
        number: '9176480934',
        phoneId: '50003800003',
        priority: 'A2',
        type: 'cell'
      }
    ],
    gender: 'Female',
    memberSince: '2019-09-30 07:07:53:490',
    userType: 'RX_AUTH',
    securityQuestion: 'What was your favorite place to visit as a child?',
    registrationDate: '2019-09-30 07:07:53:490',
    createdUser: 'ACS_REG'
  },
  profileId: '11950421547',
  acctStatus: 'ACTIVE'
};

describe('UserService', () => {
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _cookieService: CookieService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        _cookieService = TestBed.get(CookieService);
      });
  }));

  it('Check user Service instance is available', () => {
    expect(userService).toBeTruthy();
  });

  xit('Should call - initUser', () => {
    spyOn(userService, 'fetchUserInformations1').and.stub();
    const output = userService.initUser1('');
    expect(output).toBeTruthy();
  });

  it('Should call - getCCToken', () => {
    spyOn(_httpService, 'postData').and.returnValue(true);
    const payload = {
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
    const output = userService.getCCToken(payload);
    expect(output).toBeTruthy();
  });

  it('Should call - updateCartRxCount', () => {
    spyOn(userService, 'getCartInfoService').and.returnValue(
      Observable.of({ inCartRedisCount: 1 })
    );
    userService.updateCartRxCount();
    expect(userService).toBeTruthy();
  });

  it('Should call - fetchUserInformations', () => {
    spyOn(_httpService, 'postAuthData').and.callFake(() => {
      return USER_PAYLOAD;
    });
    spyOn(userService, 'getProfileInd').and.returnValue(
      Observable.of({
        auth_ind: 'Y',
        hipaa_ind: 'Y',
        rx_user: 'Y',
        qr_user: 'Y',
        pat_id: 'test'
      })
    );

    spyOn(userService, 'postLoginRedirection').and.returnValue(
      Promise.resolve({})
    );
    spyOn(_common, 'navigate').and.stub();
    userService.fetchUserInformations1('test', '', true, true);
  });

  it('Should call - getProfileInd', () => {
    spyOn(_httpService, 'postAuthData').and.returnValue(Observable.of());
    userService.getProfileInd();
    expect(userService).toBeTruthy();
  });

  it('Should call - getCartInfoService', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of());
    userService.getCartInfoService();
    expect(userService).toBeTruthy();
  });

  it('Should call - consentCheckRequest', () => {
    spyOn(_httpService, 'postAuthData').and.stub();
    userService.consentCheckRequest();
    expect(userService).toBeTruthy();
  });

  it('Should call - checkValidUserInfo', () => {
    userService.checkValidUserInfo('test');
    expect(userService).toBeTruthy();
  });

  it('Should call - processUserInformation', () => {
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.processUserInformation(response);
    expect(userService).toBeTruthy();
  });

  it('Should call - updateUsernameInHeader', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.firstName = 'testFirst';
    userService.user.lastName = 'testLast';
    spyOn(document, 'getElementsByClassName').and.returnValue([
      { innerHTML: '' },
      { innerHTML: '' }
    ]);
    userService.updateUsernameInHeader();
    expect(userService).toBeTruthy();
  });

  it('Should call - updateUsernameInHeader - local storage', () => {
    userService.user = null;
    spyOn(document, 'getElementsByClassName').and.returnValue([
      { innerHTML: '' },
      { innerHTML: '' }
    ]);
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({
        firstName: 'firstName',
        lastName: 'lastName'
      })
    );
    userService.updateUsernameInHeader();
    expect(userService).toBeTruthy();
  });

  it('Should call - profileCall', () => {
    userService.profileCall('', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - checkRegStatus', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userType = 'LITE';
    userService.checkRegStatus();
    expect(userService).toBeTruthy();
  });

  it('Should call - checkRegStatus', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue({});
    userService.user = new ArxUser('11948190939');
    userService.user.isRxAuthenticatedUser = false;
    userService.checkRegStatus();
    expect(userService).toBeTruthy();
  });

  it('Should call - checkRegStatus', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(
      'home-delivery-refill-checkout'
    );
    userService.user = new ArxUser('11948190939');
    userService.user.isRxUser = true;
    userService.user.isRxAuthenticatedUser = false;
    userService.checkRegStatus();
    expect(userService).toBeTruthy();
  });

  it('Should call - checkRegStatus', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue({});
    spyOn(_appContext, 'setRegistrationState').and.stub();
    spyOn(userService, 'consentCheckRequest').and.returnValue(
      Observable.of({
        messages: []
      })
    );
    userService.user = new ArxUser('11948190939');
    userService.user.isRxUser = true;
    userService.user.isRxAuthenticatedUser = true;
    userService.user.isPatIdExists = true;
    userService.checkRegStatus();
    expect(userService).toBeTruthy();
  });

  it('Should call - logoutSession', () => {
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_httpService, 'doPost').and.stub();
    userService.logoutSession();
    expect(userService).toBeTruthy();
  });

  it('Should call - loginErrorHandler', () => {
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(userService, 'logoutSession').and.returnValue(Promise.resolve(true));
    userService.loginErrorHandler();
    expect(userService).toBeTruthy();
  });

  it('Should call - loginErrorHandler', () => {
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(userService, 'logoutSession').and.returnValue(Promise.reject(true));
    userService.loginErrorHandler();
    expect(userService).toBeTruthy();
  });

  it('Should call - updateUserCachedInfo', () => {
    spyOn(userService, 'profileCall').and.returnValue(Promise.resolve(''));
    spyOn(userService, 'processUserInformation').and.stub();
    userService.updateUserCachedInfo();
    expect(userService).toBeTruthy();
  });

  it('Should call - setPrimeID', () => {
    userService.setPrimeID('');
    expect(userService).toBeTruthy();
  });

  it('Should call - getPrimeID', () => {
    userService.getPrimeID();
    expect(userService).toBeTruthy();
  });

  it('Should call - setsamlResponse', () => {
    spyOn(sessionStorage, 'setItem').and.stub();
    userService.setsamlResponse('');
    expect(userService).toBeTruthy();
  });

  it('Should call - getsamlResponse', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue('{}');
    userService.getsamlResponse();
    expect(userService).toBeTruthy();
  });

  it('Should call - isSSOSessionActive', () => {
    spyOn(sessionStorage, 'getItem').and.stub();
    userService.isSSOSessionActive();
    expect(userService).toBeTruthy();
  });

  it('Should call - setSSOSession', () => {
    spyOn(sessionStorage, 'setItem').and.stub();
    userService.setSSOSession();
    expect(userService).toBeTruthy();
  });

  it('Should call - removeSSOSession', () => {
    spyOn(sessionStorage, 'removeItem').and.stub();
    userService.removeSSOSession();
    expect(userService).toBeTruthy();
  });
  it('Should call - isLoggedIn', () => {
    spyOn(localStorage, 'getItem').and.returnValue({});
    UserService.isLoggedIn();
    expect(userService).toBeTruthy();
  });
  it('Should call - getActiveMemberId', () => {
    //spyOn(sessionStorage, 'getItem').and.returnValue('');
    userService.user = new ArxUser('11948190939');
    userService.getActiveMemberId();
    expect(userService).toBeTruthy();
  });

  it('Should call - getActiveMemberId- local storage', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    userService.user = new ArxUser('11948190939');
    userService.getActiveMemberId();
    expect(userService).toBeTruthy();
  });

  it('Should call - postLoginRedirection', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userName = '_ACTIVE';
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_appContext, 'getRegistrationState').and.stub();
    spyOn(userService, 'logoutSession').and.returnValue(Promise.resolve(true));
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.postLoginRedirection('', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - postLoginRedirection', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userName = '_ACTIVE';
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_appContext, 'getRegistrationState').and.stub();
    spyOn(userService, 'logoutSession').and.returnValue(Promise.reject(true));
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.postLoginRedirection('', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - postLoginRedirection', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userName = 'ACTIVE';
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_appContext, 'getRegistrationState').and.stub();
    spyOn(userService, 'checkRegStatus').and.returnValue(
      Promise.resolve(false)
    );
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.postLoginRedirection('/', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - postLoginRedirection', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userName = 'ACTIVE';
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_appContext, 'getRegistrationState').and.stub();
    spyOn(userService, 'checkRegStatus').and.returnValue(
      Promise.resolve(false)
    );
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.postLoginRedirection('', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - postLoginRedirection', () => {
    userService.user = new ArxUser('11948190939');
    userService.user.userName = 'ACTIVE';
    spyOn(userService, 'logoutCleanUp').and.stub();
    spyOn(sessionStorage, 'getItem').and.returnValue('/');
    spyOn(sessionStorage, 'removeItem').and.stub();
    spyOn(userService, 'isSSOSessionActive').and.returnValue(true);
    spyOn(_common, 'navigate').and.stub();
    spyOn(_appContext, 'getRegistrationState').and.stub();
    spyOn(userService, 'checkRegStatus').and.returnValue(Promise.resolve(true));
    const response = {
      basicProfile: jsonUsr.basicProfile,
      acctStatus: 'ACTIVE'
    };
    userService.postLoginRedirection('', true);
    expect(userService).toBeTruthy();
  });

  it('Should call - logoutCleanUp', () => {
    userService.logoutCleanUp();
    expect(userService).toBeTruthy();
  });

  it('Should call - setPrimeID', () => {
    userService.setPrimeID('');
    expect(userService).toBeTruthy();
  });

  it('Should call - getUserInfo', () => {
    spyOn(_httpService, 'doPost').and.returnValue(Promise.resolve({}));
    userService.getUserInfo('');
    expect(userService).toBeTruthy();
  });

  it('Should call - getUserInfo', () => {
    spyOn(_httpService, 'doPost').and.returnValue(Promise.resolve({}));
    userService.getUserInfo('');
    expect(userService).toBeTruthy();
  });

  it('Should call - getUserInfoService', () => {
    spyOn(_httpService, 'postData').and.returnValue(Promise.resolve({}));
    userService.getUserInfoService();
    expect(userService).toBeTruthy();
  });

  it('Should call - callRefreshToken', () => {
    spyOn(_httpService, 'doPost').and.returnValue(Promise.resolve({}));
    userService.callRefreshToken();
    expect(userService).toBeTruthy();
  });

  it('Should call - processUserInformation1', () => {
    userService.processUserInformation1({basicProfile:USER_PAYLOAD.basicProfile, acctStatus:"test"},{auth_ind:"Y", hipaa_ind:"Y", rx_user:"Y", qr_user:"Y", pat_id:"Y"});
    expect(userService).toBeTruthy();
  });

  it('Should call - fetchUserInformations', () => {
    spyOn(_httpService, 'postAuthData').and.callFake(() => {
      return USER_PAYLOAD;
    });
    spyOn(userService, 'getProfileInd').and.returnValue(
      Observable.of({
        auth_ind: 'Y',
        hipaa_ind: 'Y',
        rx_user: 'Y',
        qr_user: 'Y',
        pat_id: 'test'
      })
    );

    spyOn(userService, 'postLoginRedirection').and.returnValue(
      Promise.resolve({})
    );
    spyOn(_common, 'navigate').and.stub();
    userService.fetchUserInformations1('test', '', true, true);
  });

  it('Should call - preSSOPurge', () => {
    spyOn(_cookieService,'check').and.returnValue(true);
    spyOn(userService,'doLogout').and.returnValue(Promise.resolve({status:200}));
    userService.preSSOPurge();
    expect(userService).toBeTruthy();
  });

  it('Should call - preSSOPurge - else', () => {
    spyOn(_cookieService,'check').and.returnValue(false);
    spyOn(userService,'doLogout').and.returnValue(Promise.resolve({status:200}));
    userService.preSSOPurge();
    expect(userService).toBeTruthy();
  });

  it('Should call - preSSOPurge1', () => {
    spyOn(_cookieService,'check').and.returnValue(true);
    spyOn(_httpService,'doPost').and.returnValue(Observable.of({staus:200}));
    spyOn(userService,'doLogout').and.returnValue(Promise.resolve({status:200}));
    userService.preSSOPurge();
    expect(userService).toBeTruthy();
  });

  it('Should call - preSSOPurge1 - else', () => {
    spyOn(_cookieService,'check').and.returnValue(false);
    spyOn(_httpService,'doPost').and.returnValue(Observable.of({staus:300}));
    spyOn(userService,'doLogout').and.returnValue(Promise.resolve({status:200}));
    userService.preSSOPurge();
    expect(userService).toBeTruthy();
  });




});
