import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync } from '@angular/core/testing';
import { AppTestingModule } from './../../../../tests/app.testing.module';
import { ClinicalAssessmentService } from './clinical-assessment.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';

describe('AppContextService', () => {
  let clinicalAssessmentService: ClinicalAssessmentService;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [ClinicalAssessmentService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        clinicalAssessmentService = TestBed.get(ClinicalAssessmentService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('ClinicalAssessmentService Instance is available', fakeAsync(() => {
    expect(clinicalAssessmentService).toBeTruthy();
  }));
  it('should execute setLocalState', fakeAsync(() => {
    clinicalAssessmentService.setLocalState('', '');
  }));
  it('should execute getLocalState', fakeAsync(() => {
    clinicalAssessmentService.getLocalState('');
  }));
  it('should execute generatePayload', fakeAsync(() => {
    clinicalAssessmentService.generatePayload('');
  }));
  it('should execute processReferralData', fakeAsync(() => {
    clinicalAssessmentService.processReferralData('');
  }));
  it('should execute getPatientInterventionCall', () => {
    clinicalAssessmentService.getPatientInterventionCall('');
  });
  it('should execute patientReferralCall', () => {
    clinicalAssessmentService.patientReferralCall('');
  });
  it('should execute processPatientIntervention', () => {
    clinicalAssessmentService.processPatientIntervention('', '');
  });
  it('should execute doAssessmentCall', () => {
    clinicalAssessmentService.doAssessmentCall();
  });
  xit('should execute doAssessmentCall with data', () => {
    clinicalAssessmentService.doAssessmentCall('');
  });
  xit('should execute updateAssessmentCall', () => {
    clinicalAssessmentService.updateAssessmentCall();
  });
});
