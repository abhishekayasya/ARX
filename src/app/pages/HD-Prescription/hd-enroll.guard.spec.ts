import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HdEnrollGuard } from './hd-enroll.guard';
import { Observable } from 'rxjs/Observable';
import { EnrollInsuranceComponent } from '../HD-Transfer/components/enroll-insurance/enroll-insurance.component';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { of } from 'rxjs/observable/of';

describe('UserService', () => {
  let hdEnrollGuard: HdEnrollGuard;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [HdEnrollGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        hdEnrollGuard = TestBed.get(HdEnrollGuard);
      });
  }));

  afterEach(() => {
    localStorage.removeItem('u_info');
    sessionStorage.removeItem('ck_srx_rem');
  });

  it('Check CheckoutGuard instance is available', () => {
    expect(hdEnrollGuard).toBeTruthy();
  });
  it('Should call - canActivate', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdEnrollGuard.canActivate(route, state);
    expect(hdEnrollGuard).toBeTruthy();
  });
  it('Should call - canDeactivate', () => {
    const component = EnrollInsuranceComponent;
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/myaccount ';
    const nextState = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/myaccount ';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdEnrollGuard.canDeactivate(null, route, state, nextState);
    expect(hdEnrollGuard).toBeTruthy();
  });
});
