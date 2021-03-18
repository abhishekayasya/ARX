import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { HDPrescriptionService } from './hd-prescription.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';

describe('AppContextService', () => {
  let hdPrescriptionService: HDPrescriptionService;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [HDPrescriptionService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        hdPrescriptionService = TestBed.get(HDPrescriptionService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('hdPrescriptionService Instance is available', () => {
    expect(hdPrescriptionService).toBeTruthy();
  });
});
