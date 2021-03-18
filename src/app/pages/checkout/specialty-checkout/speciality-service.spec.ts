import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { SpecialityService } from './speciality.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { CLEANSED_PRES } from '../../../../../test/mocks/prescriptions';

describe('specialityService', () => {
  let specialityService: SpecialityService;
  let _userService: UserService;
  let _common: CommonUtil;
  let _http: HttpClientService;
  let _message: MessageService;
  let gaService: GaService;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        specialityService = TestBed.get(SpecialityService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _http = TestBed.get(HttpClientService);
        _message = TestBed.get(MessageService);
        gaService = TestBed.get(GaService);
      });
  }));
  it('SpecialityService Instance is available', fakeAsync(() => {
    expect(specialityService).toBeTruthy();
  }));

  it('should call - savePatientContext', fakeAsync(() => {
    specialityService.patientsPayload = CLEANSED_PRES;
    spyOn(gaService, 'sendGoogleAnalytics').and.stub();
    specialityService.savePatientContext(0, { target: { checked: true } });
  }));
});
