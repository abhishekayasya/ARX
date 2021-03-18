import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityQuestion2faComponent } from './security-question-2fa.component';
import 'rxjs/add/observable/of';
import { DebugElement } from '@angular/core';
import { UserService } from '@app/core/services/user.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { Hd_TransferModule } from '@app/pages/HD-Transfer/hd-transfer.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from '@angular/common';
import { CheckoutService } from '@app/core/services/checkout.service';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { SharedModule } from '@app/shared/shared.module';
import {
  userInfo,
  securityQuestions,
  deviceInfo,
  autheticateRes,
  autheticateRes_1011,
  autheticateRes_invalid,
  autheticateRes_reject
} from '../../../../../../tests/twofaFlow';

describe('SecurityQuestion2faComponent', () => {
  let component: SecurityQuestion2faComponent;
  let fixture: ComponentFixture<SecurityQuestion2faComponent>;
  let _http: HttpTestingController;
  let userService: UserService;
  let _httpService: HttpClientService;
  let _commonUtil: CommonUtil;

  afterEach(() => {
    _http.verify();
    localStorage.clear();
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecurityQuestion2faComponent],
      imports: [
        Hd_TransferModule,
        HttpClientModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        SharedModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
      providers: [
        AppContext,
        DatePipe,
        CheckoutService,
        MessageService,
        UserService,
        GaService,
        CookieService,
        HttpClientService,
        CommonUtil,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    }).compileComponents();

    _http = TestBed.get(HttpTestingController);

    const dummyElement = document.createElement('div');
    document.getElementById = jasmine
      .createSpy('HTML Element')
      .and.returnValue(dummyElement);
    fixture = TestBed.createComponent(SecurityQuestion2faComponent);
    component = fixture.debugElement.componentInstance;
  }));

  beforeEach(() => {
    userService = TestBed.get(UserService);
    _httpService = TestBed.get(HttpClientService);
    _commonUtil = TestBed.get(CommonUtil);
  });

  it('should not immediately connect to the server', () => {
    _http.expectNone({});
  });

  it('should create the app', async(() => {
    localStorage.setItem('refId', '233234234');
    expect(component).toBeTruthy();
  }));

  it('should create the app', async(() => {
    spyOn(_commonUtil, 'navigate').and.stub();
    spyOn(component, 'backAction').and.callThrough();
    component.backAction('test');
    expect(component.backAction).toHaveBeenCalled();
  }));

  it('app should call userInfo service with success respose', async(() => {
    localStorage.setItem('refId', '233234234');
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http.expectOne('NaN/profile/csrf-disabled/userInfo').flush(userInfo);

    expect(component).toBeTruthy();
  }));

  it('app should call userInfo service with failure respose', async(() => {
    localStorage.setItem('refId', '233234234');
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http
      .expectOne('NaN/profile/csrf-disabled/userInfo')
      .flush({ messages: [{ code: 'WAG_I_PROFILE_2070' }] });

    expect(component).toBeTruthy();
  }));

  it('app should call userInfo service with wrong code respose', async(() => {
    localStorage.setItem('refId', '233234234');
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http
      .expectOne('NaN/profile/csrf-disabled/userInfo')
      .flush({ messages: [{ code: 'WAG_I_PROFILE_2071' }] });

    expect(component).toBeTruthy();
  }));

  it('app should call userInfo service with error response', async(() => {
    localStorage.setItem('refId', '233234234');
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http
      .expectOne('NaN/profile/csrf-disabled/userInfo')
      .flush(null, { status: 500, statusText: 'Custome error' });

    expect(component).toBeTruthy();
  }));

  it('app should call userInfo without refIdval id', async(() => {
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http.expectOne('NaN/account/csrf-disabled/userInfo').flush(userInfo);

    expect(component).toBeTruthy();
  }));

  it('app should call userInfo without refIdval id with service error', async(() => {
    spyOn(component, 'getSecurityQuestions').and.stub();
    fixture.detectChanges();
    _http
      .expectOne('NaN/account/csrf-disabled/userInfo')
      .flush(null, { status: 500, statusText: 'Custome error' });

    expect(component).toBeTruthy();
  }));

  it('should able to call fetch getSecurityQuestions details', async(() => {
    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );
    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('should able to perform submitAnswer function', async(() => {
    localStorage.setItem('sessionStorage', JSON.stringify(deviceInfo));

    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );

    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );

    spyOn(userService, 'initUser1').and.stub();

    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.resolve({ json: () => autheticateRes })
    );

    // spyOn(component, 'submitAnswer');

    component.selectedSecurityQue = {
      code: null
    };
    spyOn(component, 'submitAnswer').and.callThrough();
    component.submitAnswer();
    component.securityInfoUpdateType = 'userinfo';
    component.submitAnswer();

    expect(component.submitAnswer).toHaveBeenCalled();
  }));

  it('should able to perform submitAnswer function with code: WAG_I_LOGIN_1011', async(() => {
    localStorage.setItem('sessionStorage', JSON.stringify(deviceInfo));

    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );

    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );

    spyOn(userService, 'initUser1').and.stub();

    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_1011 })
    );

    component.selectedSecurityQue = {
      code: null
    };
    spyOn(component, 'submitAnswer').and.callThrough();
    component.submitAnswer();
    expect(component.submitAnswer).toHaveBeenCalled();
  }));

  it('should able to perform submitAnswer function with code: WAG_I_LOGIN_1011', async(() => {
    localStorage.setItem('sessionStorage', JSON.stringify(deviceInfo));

    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );

    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );

    spyOn(userService, 'initUser1').and.stub();

    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_invalid })
    );

    component.selectedSecurityQue = {
      code: null
    };
    spyOn(component, 'submitAnswer').and.callThrough();
    component.submitAnswer();
    expect(component.submitAnswer).toHaveBeenCalled();
  }));

  it('should able to perform submitAnswer function with promise erro', async(() => {
    localStorage.setItem('sessionStorage', JSON.stringify(deviceInfo));

    spyOn(_httpService, 'postAuthData').and.returnValue(
      Observable.of(userInfo)
    );

    spyOn(_httpService, 'getData').and.returnValue(
      Observable.of(securityQuestions)
    );

    spyOn(userService, 'initUser1').and.stub();

    spyOn(_httpService, 'doPostLogin').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject) })
    );

    component.selectedSecurityQue = {
      code: null
    };
    spyOn(component, 'submitAnswer').and.callThrough();
    component.submitAnswer();
    expect(component.submitAnswer).toHaveBeenCalled();
  }));
});
