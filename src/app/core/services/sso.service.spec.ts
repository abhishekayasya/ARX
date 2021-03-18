import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AppContext } from './app-context.service';
import { CommonUtil } from './common-util.service';
import { HttpClientService } from './http.service';
import { SsoService } from './sso.service';
import { UserService } from './user.service';

describe('SsoService', () => {
  let ssoService: SsoService;
  let _httpService: HttpClientService;
  let _appContext: AppContext;
  let _common: CommonUtil;
  let _userService: UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        ssoService = TestBed.get(SsoService);
        _httpService = TestBed.get(HttpClientService);
        _common = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _appContext = TestBed.get(AppContext);
      });
  }));

  it('Check SSO Service instance is available', () => {
    expect(ssoService).toBeTruthy();
  });

  it('Should call - initSSOLogin - WAG_I_PRIME_SAML_1015', () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              {
                code: 'WAG_I_PRIME_SAML_1015'
              }
            ]
          };
        }
      })
    );
    ssoService.initSSOLogin('');
  });

  it('Should call - initSSOLogin - WAG_I_PRIME_SAML_1009', () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              {
                code: 'WAG_I_PRIME_SAML_1009'
              }
            ]
          };
        }
      })
    );
    ssoService.initSSOLogin('');
  });

  it('Should call - initSSOLogin - WAG_I_PRIME_SAML_1012', () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              {
                code: 'WAG_I_PRIME_SAML_1012'
              }
            ]
          };
        }
      })
    );
    ssoService.initSSOLogin('');
  });

  it('Should call - initSSOLogin', () => {
    spyOn(_userService, 'initUser1').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {};
        }
      })
    );
    ssoService.initSSOLogin('');
  });

  it('Should call - initSSOLogin - error', () => {
    spyOn(_httpService, 'doPost').and.returnValue(Promise.reject({}));
    ssoService.initSSOLogin('');
  });

  it('Should call - processSsoResponse', () => {
    spyOn(_userService, 'setSSOSession').and.stub();
    ssoService.processSsoResponse();
  });
});
