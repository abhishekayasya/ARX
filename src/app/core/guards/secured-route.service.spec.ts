import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '../services/user.service';
import { HttpClientService } from '../services/http.service';
import { AppContext } from '../services/app-context.service';
import { CommonUtil } from '../services/common-util.service';
import { CheckoutGuard } from './checkout.guard';
import { CheckoutService } from '../services/checkout.service';
import { AddressBookService } from '../services/address-book.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { SecuredRouteService } from './secured-route.service';

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

describe('SecuredRouteService', () => {
  let checkoutGuard: CheckoutGuard;
  let addressesService: AddressBookService;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _checkout: CheckoutService;
  let securedRouteService: SecuredRouteService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [CheckoutGuard, SecuredRouteService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        securedRouteService = TestBed.get(SecuredRouteService);
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        checkoutGuard = TestBed.get(CheckoutGuard);
        _checkout = TestBed.get(CheckoutService);
        addressesService = TestBed.get(AddressBookService);
      });
  }));

  afterEach(() => {
    localStorage.removeItem('u_info');
    sessionStorage.removeItem('ck_srx_rem');
  });

  it('should create SecuredRouteService', fakeAsync(() => {
    flush();
    expect(securedRouteService).toBeTruthy();
  }));

  it('should call - canActivate', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    state.url = '/transfer-home-delivery-prescription/confirmation-pca';
    securedRouteService.canActivate(route, state);
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - canActivate - 1', () => {
    localStorage.setItem('sData', '{"isRegistering":"true"}');
    localStorage.setItem('uid', '{"isRegistering":"true"}');
    spyOn(_appContext, 'setRegistrationState').and.stub();
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    // route.routeConfig.path='register';
    state.url = '/transfer-home-delivery-prescription/confirmation-pca';
    securedRouteService.canActivate(route, state);
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - isPublic', () => {
    securedRouteService.isPublic('1');
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - fireSignedoutHdNewRxGAEvent', () => {
    securedRouteService.fireSignedoutHdNewRxGAEvent();
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - fireSignedoutHdTransferRxGAEvent', () => {
    securedRouteService.fireSignedoutHdTransferRxGAEvent();
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - fireSignedInHdNewRxGAEvent', () => {
    securedRouteService.fireSignedInHdNewRxGAEvent();
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - fireSignedInHdTransferRxGAEvent', () => {
    securedRouteService.fireSignedInHdTransferRxGAEvent();
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - gaEvent', () => {
    securedRouteService.gaEvent('test', 'test', '');
    expect(securedRouteService).toBeTruthy();
  });

  it('should call - gaEventWithData', () => {
    securedRouteService.gaEventWithData('test', 'test', '', {});
    expect(securedRouteService).toBeTruthy();
  });
});
