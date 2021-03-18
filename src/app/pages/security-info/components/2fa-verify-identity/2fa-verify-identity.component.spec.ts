import { AppTestingModule } from './../../../../../../tests/app.testing.module';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { TwoFaVerifyIdentityComponent } from './2fa-verify-identity.component';
import { CommonUtil } from '@app/core/services/common-util.service';
import { MessageService } from '@app/core/services/message.service';
import { NgxPopperModule } from 'ngx-popper';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { By } from '@angular/platform-browser';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpTestingController } from '@angular/common/http/testing';
import {
  userInfo,
  securityQuestions,
  autheticateRes,
  autheticateRes_reject,
  autheticateRes_reject_2039
} from '../../../../../../tests/twofaFlow';
import { Router } from '@angular/router';

describe('TwoFaVerifyIdentityComponent', () => {
  let component: TwoFaVerifyIdentityComponent;
  let fixture: ComponentFixture<TwoFaVerifyIdentityComponent>;
  let debugEle: DebugElement;
  let _common: CommonUtil;
  let _httpService: HttpClientService;
  let _messageService: MessageService;
  let _http: HttpTestingController;
  let _userservice: UserService;
  let _router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TwoFaVerifyIdentityComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TwoFaVerifyIdentityComponent);
        component = fixture.componentInstance;
        debugEle = fixture.debugElement.query(By.css('form'));
        _common = TestBed.get(CommonUtil);
        _httpService = TestBed.get(HttpClientService);
        _messageService = TestBed.get(MessageService);
        _http = TestBed.get(HttpTestingController);
        _userservice = TestBed.get(UserService);
        _router = TestBed.get(Router);
      });
  }));

  afterEach(() => {
    _http.verify();
    localStorage.clear();
  });

  it('should create', () => {
    spyOn(component, 'getSecurityQuestions').and.stub();
    spyOn(_common, 'addNaturalBGColor').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be initialized', () => {
    spyOn(_common, 'addNaturalBGColor').and.stub();
    spyOn(component, 'getSecurityQuestions').and.stub();
    component.ngOnInit();
  });

  it('should excute - updateVOption', () => {
    component.updateVOption(event);
    component.disableSubmitbtn = false;
  });

  it('should excute - sendCode', () => {
    component.selectedContact = 'test';
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => autheticateRes })
    );
    component.sendCode(true);
    expect(component).toBeTruthy();
  });

  it('should excute - sendCode error statement', () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject) })
    );
    component.sendCode(true);
    expect(component).toBeTruthy();
  });

  it('should excute - showsendcodeBlock', () => {
    component.showsendcodeBlock();
    component.selectVOption = false;
    component.displaySendCode = true;
  });

  it('should execute -  showRetryCount', () => {
    component.selectedContact = 'email';
    component.showRetryCount();
  });

  it('should execute -  showRetryCount null statement', () => {
    spyOn(_common, 'navigate').and.stub();
    component.selectedContact = null;
    component.showRetryCount();
  });

  it('should execute -  showRetryCount else statement', () => {
    component.selectedContact = 'test';
    spyOn(_common, 'addNaturalBGColor').and.stub();
    spyOn(component, 'getSecurityQuestions').and.stub();
    component.userPhone = {
      test: { number: '454564' }
    };
    component.emailResponseMessage = 'test';
    component.emailResponseMessage= 'test1234';
    component.showRetryCount();
    expect(component).toBeTruthy();
  });

  it('should execute - getLastFourNumber', () => {
    component.getLastFourNumber('1234567889');
    expect(component).toBeTruthy();
  });

  it('should execute - getLastFourNumber else statement', () => {
    component.getLastFourNumber(undefined);
    expect(component).toBeTruthy();
  });

  it('should execute - htmlToPlaintext', () => {
    component.htmlToPlaintext('fsdfsdaf');
    expect(component).toBeTruthy();
  });

  it('should execute - getSecurityQuestions without refid', () => {
    spyOn(component, 'getSecurityQuestionCode').and.stub();
    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );
    component.getSecurityQuestions();
    expect(component).toBeTruthy();
  });

  it('should execute - getSecurityQuestions without refid error statement', () => {
    spyOn(component, 'getSecurityQuestionCode').and.stub();
    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getSecurityQuestions();
    expect(component).toBeTruthy();
  });

  it('should execute - getSecurityQuestions else statement', () => {
    localStorage.setItem('refId', '31232');
    spyOn(_httpService, 'postData').and.returnValue(Observable.of(userInfo));
    component.getSecurityQuestions();
    expect(component).toBeTruthy();

  });

  it('should execute - getSecurityQuestions error statement', () => {
    localStorage.setItem('refId', '31232');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getSecurityQuestions();
  });

  it('should excute - getSecurityQuestionCode', () => {
    _userservice.selectedSecurityQuestion = 'Who was your childhood hero?';
    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );
    component.getSecurityQuestionCode();
    expect(component).toBeTruthy();
  });

  it('should execute - submitCode', () => {
    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.resolve({ json: () => autheticateRes })
    );
    component.submitCode();
  });

  it('should execute - submitCode error statement', () => {
    component.selectedContact = 'email';
    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject) })
    );
    component.submitCode();
    expect(component).toBeTruthy();
  });

  it('should execute - submitCode error statement', () => {
    component.selectedContact = 'email';
    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject_2039) })
    );
    component.submitCode();
    expect(component).toBeTruthy();
  });

  it('should execute -  backAction', () => {
    component.displaySendCode = true;
    component.backAction();
    spyOn(_messageService, 'removeMessage').and.stub();
    component.selectVOption = true;
  });

  it('should execute - omit_special_char', () => {
    component.omit_special_char('test');
  });

  it('should execute - submitVoption', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'getSecurityQuestions').and.stub();
    spyOn(_common, 'addNaturalBGColor').and.stub();
    spyOn(component, 'submitVoption').and.callThrough();
    component.selectedContact = 'Security';
    fixture.detectChanges();
    component.submitVoption();
    expect(component.submitVoption).toHaveBeenCalled();
    component.loginpage();
  });

  it('should execute - submitVoption else statement', () => {
    component.selectedContact = 'email';
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'submitVoption').and.callThrough();
    component.submitVoption();
    expect(component.submitVoption).toHaveBeenCalled();
  });

  it('should execute - submitGAtagging', () => {
    component.errorStateGAtagging = true;
    component.submitGAtagging();
    component.errorStateGAtagging = false;
    component.submitGAtagging();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.submitGAtagging();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.submitGAtagging();
    expect(component).toBeTruthy();
  });

  it('should execute - RequestNewCodeGA', () => {
    component.errorStateGAtagging = true;
    component.RequestNewCodeGA();
    component.errorStateGAtagging = false;
    component.RequestNewCodeGA();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.RequestNewCodeGA();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.RequestNewCodeGA();
    expect(component).toBeTruthy();
  });

  it('should execute - updateVOption', () => {
    let type = 'email';
    component.updateVOption(type);
    type = 'cell';
    component.updateVOption(type);
    type = 'home';
    component.updateVOption(type);
    type = 'work';
    component.updateVOption(type);
    type = 'Security';
    component.updateVOption(type);
    type = '';
    component.updateVOption(type);
    expect(component).toBeTruthy();
  });

  it('should execute - ongetSecurityQuestionsError', () => {
    component.ongetSecurityQuestionsError();
    expect(component).toBeTruthy();
  });

  it('should execute - TollFreeClick', fakeAsync(() => {
    _router.navigate(['/test/code_sent']);
    tick();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.TollFreeClick();
    component.selectedContact = '';
    component.TollFreeClick();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.TollFreeClick();
    component.selectedContact = '';
    component.TollFreeClick();
    expect(component).toBeTruthy();
  }));

  it('should execute - TollFreeClick else statement', fakeAsync(() => {
    _router.navigate(['test']);
    tick();
    component.TollFreeClick();
    expect(component).toBeTruthy();
  }));

  it('should execute - backAction', fakeAsync(() => {
    spyOn(component, 'loginpage').and.stub();
    _router.navigate(['/test/code_sent']);
    tick();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.backAction();
    component.errorStateGAtagging = true;
    component.selectedContact = '';
    component.backAction();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.backAction();
    component.selectedContact = '';
    component.backAction();
    component.displaySendCode = true;
    component.backAction();
    expect(component).toBeTruthy();
  }));

  it('should execute - backAction else statement', fakeAsync(() => {
    spyOn(component, 'loginpage').and.stub();
    _router.navigate(['test']);
    tick();
    component.backAction();
    expect(component).toBeTruthy();
  }));


  it('should execute -  backAction2', () => {
    component.displaySendCode = true;
    component.backAction();
    spyOn(_messageService, 'removeMessage').and.stub();
    component.selectVOption = true;
  });

  it('should execute - omit_special_char2', () => {
    component.omit_special_char('test');
  });

  it('should execute - submitVoption23', () => {
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'getSecurityQuestions').and.stub();
    spyOn(_common, 'addNaturalBGColor').and.stub();
    spyOn(component, 'submitVoption').and.callThrough();
    component.selectedContact = 'Security';
    fixture.detectChanges();
    component.submitVoption();
    expect(component.submitVoption).toHaveBeenCalled();
    component.loginpage();
  });

  it('should execute - submitVoption else statement12', () => {
    component.selectedContact = 'email';
    spyOn(_common, 'navigate').and.stub();
    spyOn(component, 'submitVoption').and.callThrough();
    component.submitVoption();
    expect(component.submitVoption).toHaveBeenCalled();
  });

  it('should execute - submitGAtagging34', () => {
    component.errorStateGAtagging = true;
    component.submitGAtagging();
    component.errorStateGAtagging = false;
    component.submitGAtagging();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.submitGAtagging();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.submitGAtagging();
    expect(component).toBeTruthy();
  });

  it('should execute - RequestNewCodeGA12', () => {
    component.errorStateGAtagging = true;
    component.RequestNewCodeGA();
    component.errorStateGAtagging = false;
    component.RequestNewCodeGA();
    component.errorStateGAtagging = true;
    component.selectedContact = 'email';
    component.RequestNewCodeGA();
    component.errorStateGAtagging = false;
    component.selectedContact = 'email';
    component.RequestNewCodeGA();
    expect(component).toBeTruthy();
  });



});
