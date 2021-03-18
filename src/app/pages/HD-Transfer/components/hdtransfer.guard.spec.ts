import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { HdtransferGuard } from '../hdtransfer.guard';
import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('HdtransferGuard', () => {
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let gaService: GaService;
  let hdtransferGuard: HdtransferGuard;
  let _router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _httpClient = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
        gaService = TestBed.get(GaService);
        hdtransferGuard = TestBed.get(HdtransferGuard);
        _router = TestBed.get(Router);
      });
  }));

  afterEach(() => {
    localStorage.removeItem('insuranceOnData');
  });
  it('Check HdtransferGuard instance is available', () => {
    expect(hdtransferGuard).toBeTruthy();
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
    hdtransferGuard.canActivate(route, state);
    spyOn(_router, 'navigateByUrl').and.stub();
    expect(hdtransferGuard).toBeTruthy();
  });
  it('Should call - canActivate', () => {
    localStorage.setItem('insuranceOnData', 'No');
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdtransferGuard.canActivate(route, state);
    spyOn(_router, 'navigateByUrl').and.stub();
    expect(hdtransferGuard).toBeTruthy();
  });
  it('Should call - canDeactivate', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = 'myaccount';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdtransferGuard.canDeactivate(null, route, state, state);
    expect(hdtransferGuard).toBeTruthy();
  });
});
