import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '../services/user.service';
import { HttpClientService } from '../services/http.service';
import { AppContext } from '../services/app-context.service';
import { CommonUtil } from '../services/common-util.service';
import { CheckoutGuard } from './checkout.guard';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '../services/checkout.service';
import { AddressBookService } from '../services/address-book.service';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { of } from 'rxjs/observable/of';

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
  let checkoutGuard: CheckoutGuard;
  let addressesService: AddressBookService;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _checkout: CheckoutService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [CheckoutGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
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

  it('Check CheckoutGuard instance is available', () => {
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - canActivate', done => {
    _checkout.data_deliveryOptions = undefined;
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    _checkout.isCombo = true;
    spyOn(_checkout, 'fetchAddressList').and.returnValue(
      of({ addresses: 'test', homeAddress: '' })
    );

    checkoutGuard.canActivate(route, state);
    done();
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - canActivate', () => {
    _checkout.data_deliveryOptions = undefined;
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    _checkout.isCombo = true;
    spyOn(_checkout, 'fetchAddressList').and.returnValue(Observable.throw({}));

    checkoutGuard.canActivate(route, state);
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - canActivate', () => {
    _checkout.data_deliveryOptions = undefined;
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/specialty-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    _checkout.isCombo = true;
    spyOn(_checkout, 'fetchAddressList').and.returnValue(Observable.throw({}));

    checkoutGuard.canActivate(route, state);
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - handleRoutesForCombo', () => {
    checkoutGuard.handleRoutesForCombo('');
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - getSelectedAddress', () => {
    localStorage.setItem('u_info', JSON.stringify(USER_PAYLOAD));
    addressesService.addresses = [{ preferred: true }];
    checkoutGuard.getSelectedAddress();
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - assignAddress', () => {
    const checkoutDetails = [
      {
        type: 'SPECIALTY',
        boxDetails: {
          shippingInfo: {
            srxDeliveryAddr: 'test'
          }
        }
      }
    ];
    _checkout.data_deliveryOptions = {
      checkoutDetails: [{ boxDetails: { shippingInfo: { deliveryAddr: '' } } }]
    };
    spyOn(_checkout, 'updateAddressCallFromReview').and.stub();
    checkoutGuard.assignAddress([]);
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - assignAddress - else', () => {
    const checkoutDetails = [
      {
        type: 'HOMEDELIVERY',
        boxDetails: {
          shippingInfo: {
            srxDeliveryAddr: 'test'
          }
        }
      }
    ];
    _checkout.data_deliveryOptions = {
      checkoutDetails: [{ boxDetails: { shippingInfo: { deliveryAddr: '' } } }]
    };
    spyOn(_checkout, 'updateAddressCallFromReview').and.stub();
    checkoutGuard.assignAddress([]);
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - assignHealthInfo', () => {
    _checkout.data_deliveryOptions = {
      checkoutDetails: [{ healthInfo: undefined }]
    };
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({}));
    spyOn(_checkout, 'fetchHealthHistoryInfoArray').and.stub();
    checkoutGuard.assignHealthInfo(
      [{ meId: 1234, type: 'SPECIALTY', healthInfo: undefined }],
      { healthInfo: undefined }
    );
    expect(checkoutGuard).toBeTruthy();
  });

  it('Should call - assignHealthCondition', () => {
    const res = { checkoutDetails: [{ meId: 1234 }] };
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({}));
    spyOn(_checkout, 'fetchHealthHistoryInfoArray').and.stub();
    checkoutGuard.assignHealthCondition(res);
    expect(checkoutGuard).toBeTruthy();
  });
});
