import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { HdPrescriptionGuard } from './hd-prescription.guard';

describe('UserService', () => {
  let hdPrescriptionguard: HdPrescriptionGuard;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [HdPrescriptionGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        hdPrescriptionguard = TestBed.get(HdPrescriptionGuard);
      });
  }));

  it('Check HomePrescriptionGuard instance is available', () => {
    expect(hdPrescriptionguard).toBeTruthy();
  });
  it('Should call - canActivate', () => {
    localStorage.setItem('insuranceOnData','No');
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdPrescriptionguard.canActivate(route,state);
    expect(hdPrescriptionguard).toBeTruthy();
  });

  it('Should call - canDeactivate', () => {
    //const componpent = EnrollInsuranceComponent;
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/myaccount ';
    const nextState = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    nextState.url = '/myaccount ';
    hdPrescriptionguard.canDeactivate(null, null, state, nextState);
    expect(hdPrescriptionguard).toBeTruthy();
  });
});
