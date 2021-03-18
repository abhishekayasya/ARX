import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { SecurityInfoService } from './securityinfo.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';

describe('AppContextService', () => {
  let securityInfoService: SecurityInfoService;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [SecurityInfoService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        securityInfoService = TestBed.get(SecurityInfoService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('SecurityInfoService Instance is available', fakeAsync(() => {
    expect(securityInfoService).toBeTruthy();
  }));
});
