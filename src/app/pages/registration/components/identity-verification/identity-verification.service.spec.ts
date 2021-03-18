import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ArxUser } from '@app/models';
import { IdentityVerificationService } from './identity-verification.service';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';

describe('IdentityService', () => {
  let _identityService: IdentityVerificationService;
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
        _identityService = TestBed.get(IdentityVerificationService);
        _httpService = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('IdentityService Instance is available', () => {
    expect(_identityService).toBeTruthy();
  });

  it('should call - getQuestionsSet with errorMessageId', () => {
    spyOn(_httpService, 'getData').and.returnValue(Observable.of({errorMessageId : 1}));
    _identityService.getQuestionsSet();
  });
  it('should call - getQuestionsSet with messageId', () => {
    spyOn(_httpService, 'getData').and.returnValue(Observable.of({messageId : 1}));
    _identityService.getQuestionsSet();
  });
  it('should call - getQuestionsSet with quizChoiceValidationErrorMessage ', () => {
    spyOn(_httpService, 'getData').and.returnValue(Observable.of({quizChoiceValidationErrorMessage  : 1}));
    _identityService.getQuestionsSet();
  });
  it('should call - getQuestionsSet with else ', () => {
    spyOn(_httpService, 'getData').and.returnValue(Observable.of({transactionId  : 1, quizId: 1, questionsNOptions: [1, 2, 3]}));
    _identityService.getQuestionsSet();
  });
  it('should call - getQuestionsSet with error ', () => {
    spyOn(_httpService, 'getData').and.returnValue(Observable.throw({staus  : 500}));
    _identityService.getQuestionsSet();
  });
  it('should call - submitAnswersForOnlineAuth with quizChoiceValidationError', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({quizChoiceValidationError  : 1}));
    _identityService.submitAnswersForOnlineAuth();
  });
  it('should call - submitAnswersForOnlineAuth', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({errorMessageId   : 1, messageId: 1}));
    _identityService.submitAnswersForOnlineAuth();
  });
  it('should call - submitAnswersForOnlineAuth with messageId', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({messageId: 1}));
    _identityService.submitAnswersForOnlineAuth();
  });
    it('should call - submitAnswersForOnlineAuth with quizChoiceValidationErrorMessage', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({quizChoiceValidationErrorMessage : 'test'}));
    _identityService.submitAnswersForOnlineAuth();
  });
  xit('should call - submitAnswersForOnlineAuth with questionsNOptions', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.of({questionsNOptions   : [1, 2, 3], transactionId : 1}));
    _identityService.submitAnswersForOnlineAuth();
  });
  it('should call - submitAnswersForOnlineAuth else', () => {
    spyOn(_httpService, 'postData').and.returnValue(Observable.throw({status  : 500}));
    _identityService.submitAnswersForOnlineAuth();
  });
});
