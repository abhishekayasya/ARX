import { TestBed, async } from '@angular/core/testing';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { HdTransferEnrollGuard } from './hd-transfer-enroll.guard';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  Router
} from '@angular/router';

describe('HdTransferEnrollGuard', () => {
  let _httpClient: HttpClientService;
  let _userService: UserService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let gaService: GaService;
  let hdTransferEnrollGuard: HdTransferEnrollGuard;
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
        hdTransferEnrollGuard = TestBed.get(HdTransferEnrollGuard);
        _router = TestBed.get(Router);
      });
  }));
  it('Check HdTransferEnrollGuard instance is available', () => {
    expect(hdTransferEnrollGuard).toBeTruthy();
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
    hdTransferEnrollGuard.canActivate(route, state);
    spyOn(_router, 'navigateByUrl').and.stub();
    expect(hdTransferEnrollGuard).toBeTruthy();
  });

  xit('Should call - canDeactivate', () => {
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/myaccount';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    hdTransferEnrollGuard.canDeactivate(null, route, state, state);
    spyOn(location, 'replace').and.stub();
    expect(hdTransferEnrollGuard).toBeTruthy();
  });
});
