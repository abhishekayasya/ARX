import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { ArxUser } from '@app/models';
import 'rxjs/add/operator/toPromise';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { RegistrationGuard } from './registration.guard';

describe('UserService', () => {
  let registrationGuard: RegistrationGuard;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [RegistrationGuard],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _appContext = TestBed.get(AppContext);
        userService.user = new ArxUser('11948190939');
        registrationGuard = TestBed.get(RegistrationGuard);
      });
  }));

  afterEach(() => {
    localStorage.removeItem('u_info');
    sessionStorage.removeItem('ck_srx_rem');
  });

  it('Check registrationGuard instance is available', () => {
    expect(registrationGuard).toBeTruthy();
  });
});
