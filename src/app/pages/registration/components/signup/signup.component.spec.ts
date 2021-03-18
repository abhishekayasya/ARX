import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import 'rxjs/add/observable/of';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { securityQuestions } from '../../../../../../tests/twofaFlow';
import {
  signup,
  FormData,
  checkPassword,
  checkPassword_error,
  checkemail,
  checkemail1
} from '../../../../../../tests/signup';

// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { DateConfigModel } from '@app/models/date-config.model';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let userService: UserService;
  let _httpclientService: HttpClientService;
  let _commonUtil: CommonUtil;
  let _regservice: RegistrationService;
  let _http: HttpTestingController;
  let _router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        const dummyElement = document.createElement('div');
        document.getElementById = jasmine
          .createSpy('HTML Element')
          .and.returnValue(dummyElement);
        fixture = TestBed.createComponent(SignupComponent);
        userService = TestBed.get(UserService);
        _httpclientService = TestBed.get(HttpClientService);
        _commonUtil = TestBed.get(CommonUtil);
        _regservice = TestBed.get(RegistrationService);
        _http = TestBed.get(HttpTestingController);
        _router = TestBed.get(Router);
        component = fixture.debugElement.componentInstance;
        component.initialiseForm(new DateConfigModel());
        expect(component.signUpForm).toBeDefined();
        component.signUpForm.setValue(FormData);
        spyOn(component, 'initialiseForm').and.stub();
        // spyOn(component, 'getQuestions').and.stub();
        // spyOn(component, 'setLiteRegValues').and.stub();
        const dateConfig = new DateConfigModel();
        dateConfig.isDob = true;
        component.initialiseForm(dateConfig);
        _regservice.signupDataCache = component.signUpForm.value;
        fixture.detectChanges();
      });
  }));

  it('should create the app', async(() => {
    spyOn(component, 'getQuestions').and.stub();
    expect(component).toBeTruthy();
  }));

  it('should create the form', () => {
    component.initialiseForm(new DateConfigModel());
    expect(component.signUpForm).toBeDefined();
    fixture.detectChanges();
  });

  it('app should call getQuestions service with success respose', async(() => {
    spyOn(_httpclientService, 'doGet').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return securityQuestions;
        }
      })
    );
    component.getQuestions();
  }));

  it('should execute checkboxFlag else', () => {
    const event = { target: 'click' };
    fixture.detectChanges();
    spyOn(component, 'checkboxFlag').and.callThrough();
    component.checkboxFlag(event);
    expect(component.checkboxFlag).toHaveBeenCalled();
  });
  it('should execute checkboxFlag', () => {
    const event = { target: { checked: true } };
    fixture.detectChanges();
    spyOn(component, 'checkboxFlag').and.callThrough();
    component.checkboxFlag(event);
    expect(component.checkboxFlag).toHaveBeenCalled();
  });
  it('should able to call submitDetails details', async(() => {
    spyOn(_commonUtil, 'validateForm').and.callThrough();
    _commonUtil.validateForm(component.signUpForm);
    expect(_commonUtil.validateForm).toHaveBeenCalled();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({ res: Observable.of(signup) })
    );
    _regservice.signupDataCache = component.signUpForm.value;
    spyOn(component, 'submitDetails').and.callThrough();
    component.submitDetails(true);
    expect(component.submitDetails).toHaveBeenCalled();
  }));
  it('should able to call submitDetails2', async(() => {
    component.declarationStatus = true;
    spyOn(_commonUtil, 'validateForm').and.callThrough();
    _commonUtil.validateForm(component.signUpForm);
    expect(_commonUtil.validateForm).toHaveBeenCalled();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true, json: () => {
          return signup;
        }
      })
    );
    _regservice.signupDataCache = component.signUpForm.value;
    spyOn(component, 'submitDetails').and.callThrough();
    component.submitDetails(true);
    expect(component.submitDetails).toHaveBeenCalled();
  }));
  it('should able to call submitDetails3', async(() => {
    component.declarationStatus = true;
    component.signUpForm.setValue(FormData);
    fixture.detectChanges();
    spyOn(_commonUtil, 'validateForm').and.callThrough();
    _commonUtil.validateForm(component.signUpForm);
    expect(_commonUtil.validateForm).toHaveBeenCalled();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return signup;
        }
      })
    );
    _regservice.signupDataCache = component.signUpForm.value;
    spyOn(component, 'submitDetails').and.callThrough();
    component.submitDetails(true);
    expect(component.submitDetails).toHaveBeenCalled();
  }));
  it('should able to call checkPassword', async(() => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return checkPassword_error;
        }
      })
    );
    const event = { target: 'click' };
    fixture.detectChanges();
    component.checkPassword(event);
  }));
  it('should able to call checkPassword else', async(() => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return checkPassword;
        }
      })
    );
    const event = { target: 'click' };
    fixture.detectChanges();
    component.checkPassword(event);
  }));
  it('should able to call checkPassword error', async(() => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.reject({ status: 500 })
    );
    const event = { target: 'click' };
    fixture.detectChanges();
    component.checkPassword(event);
  }));
  it('should execute checkEmail', async(() => {
    const event = { target: 'click' };
    component.signUpForm.value.login = 'test@test.com';
    fixture.detectChanges();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({ ok: true, json: () => checkemail })
    );
    component.checkEmail(event);
    expect(component).toBeTruthy();
  }));
  it('should execute checkEmail else', async(() => {
    const event = { target: 'click' };
    component.signUpForm.value.login = 'test@test.com';
    fixture.detectChanges();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({ ok: true, json: () => checkemail1 })
    );
    component.checkEmail(event);
    expect(component).toBeTruthy();
  }));
  it('should execute checkEmail error', async(() => {
    const event = { target: 'click' };
    component.signUpForm.value.login = 'test@test.com';
    fixture.detectChanges();
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.reject({ status: 500 })
    );
    component.checkEmail(event);
    expect(component).toBeTruthy();
  }));
  it('should execute declarationReadAndAgreeToPolicy', async(() => {
    const event = { target: { checked: true } };
    component.declarationReadAndAgreeToPolicy(event);
  }));
  it('should execute declarationReadAndAgreeToPolicy else', async(() => {
    const event = { target: 'click' };
    component.declarationReadAndAgreeToPolicy(event);
    expect(component.showDeclarationError).toBeTruthy();
  }));

  it('should execute udpatePopupStyle', async(() => {
    component.udpatePopupStyle();
  }));

  it('should execute sendToLogin', () => {
    spyOn(_router, 'navigate').and.stub();
    spyOn(component, 'sendToLogin').and.callThrough();
    component.sendToLogin();
    expect(component.sendToLogin).toHaveBeenCalled();
  });

  it('should execute preparePhoneNumber', () => {
    component.preparePhoneNumber('9998789', '676');
  });
  it('should execute validateDOB', () => {
    spyOn(_commonUtil, 'validateDOB').and.callThrough();
    _commonUtil.validateDOB(component.signUpForm);
    expect(_commonUtil.validateDOB).toHaveBeenCalled();
    component.validateDOB({ key: 'test' });
  });
  it('should execute resetPreviousErrorMsg', () => {
    component.emailCheckMessage = '';
    component.resetPreviousErrorMsg();
  });
  it('should call gaEvent function', () => {
    spyOn(component, 'gaEvent').and.callThrough();
    component.gaEvent();
  });
});
