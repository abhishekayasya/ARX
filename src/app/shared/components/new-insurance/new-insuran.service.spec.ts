import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { NewInsuranceService } from './new-insurance.service';
import { FormGroup } from '@angular/forms';

describe('NewInsuranceService', () => {
  let _newInsuranceService: NewInsuranceService;
  let _userService: UserService;
  let _httpService: HttpClientService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _newInsuranceService = TestBed.get(NewInsuranceService);
        _httpService = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('NewInsuranceService Instance is available', () => {
    expect(_newInsuranceService).toBeTruthy();
  });
  it('should call - cacheInsuranceInformation', () => {
    _newInsuranceService.cacheInsuranceInformation(new FormGroup({}));
  });
  it('should call - prepareCHDOB', () => {
    _newInsuranceService.prepareCHDOB('1/1/2020');
  });
});
