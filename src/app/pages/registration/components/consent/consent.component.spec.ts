import {
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
  DebugElement
} from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { ConsentComponent } from './consent.component';
import { Router } from '@angular/router';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { RegistrationService } from '@app/core/services/registration.service';
import { JahiaContentService } from '@app/core/services/jahia-content.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import {
  autheticateRes_valid,
  autheticateRes_invalid2,
  autheticateRes_invalid3
} from '../../../../../../tests/consent';
import {
  autheticateRes_invalid,
  autheticateRes_reject
} from '../../../../../../tests/twofaFlow';
describe('ConsentComponent', () => {
  let component: ConsentComponent;
  let fixture: ComponentFixture<ConsentComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let _http: HttpClientService;
  let commonUtil: CommonUtil;
  let _gaService: GaService;
  let _userService: UserService;
  let messageService: MessageService;
  let _registrationService: RegistrationService;
  let _contentService: JahiaContentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ConsentComponent);
        component = fixture.componentInstance;
        _http = TestBed.get(HttpClientService);
        _gaService = TestBed.get(GaService);
        commonUtil = TestBed.get(CommonUtil);
        messageService = TestBed.get(MessageService);
        _registrationService = TestBed.get(RegistrationService);
        _contentService = TestBed.get(JahiaContentService);
        _userService = TestBed.get(UserService);
        router = TestBed.get(Router);
        debugElement = fixture.debugElement;
      });
  }));

  it('should create consent  component', () => {
    expect(component).toBeTruthy();
  });

  it('Should call ngOnInit', () => {
    spyOn(_http, 'doPostWFlow').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_valid })
    );
    spyOn(_userService, 'getProfileInd').and.callFake(() => {
      return Observable.of({
        status: '200 OK',
        auth_ind: 'Y',
        hipaa_ind: 'Y',
        rx_user: 'Y',
        qr_user: 'Y',
        pat_id: 'Y'
      });
    });
    _userService.user = new ArxUser('11948190939');
    component.ngOnInit();
    _userService.user.isRxAuthenticatedUser = true;
    expect(component).toBeTruthy();
  });

  it('Should set isRxAuthenticatedUser -> false', () => {
    spyOn(commonUtil, 'navigate').and.stub();
    spyOn(_userService, 'logoutSession').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_invalid })
    );
    spyOn(_http, 'doPostWFlow').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_invalid })
    );
    spyOn(_userService, 'getProfileInd').and.callFake(() => {
      return Observable.of({
        status: '200 OK',
        auth_ind: 'Y1',
        hipaa_ind: 'Y1',
        rx_user: 'Y1',
        qr_user: 'Y1'
      });
    });
    _userService.user = new ArxUser('11948190939');
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('Should handle promise error ', () => {
    spyOn(_userService, 'logoutSession').and.returnValue(
      Promise.reject(autheticateRes_reject)
    );
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
  it('Should call getContentFomJahia', () => {
    spyOn(_contentService, 'getContent').and.callFake(() => {
      return Observable.of({ status: '200 OK' });
    });
    component.getContentFomJahia();
    expect(component).toBeTruthy();
  });

  xit('Should call updateConsentForUser - invalid2', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(_gaService, 'sendEvent').and.callThrough();
    spyOn(_registrationService, 'endureState').and.callThrough();
    spyOn(_http, 'doPut').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_invalid2 })
    );
    component.updateConsentForUser('test');
    expect(component).toBeTruthy();
  });

  xit('Should call updateConsentForUser - invalid3', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(_gaService, 'sendEvent').and.callThrough();
    spyOn(_registrationService, 'endureState').and.callThrough();
    spyOn(_http, 'doPut').and.returnValue(
      Promise.resolve({ json: () => autheticateRes_invalid3 })
    );
    component.updateConsentForUser('test');
    expect(component).toBeTruthy();
  });

  xit('Should call updateConsentForUser error case', () => {
    spyOn(router, 'navigate').and.stub();
    spyOn(_gaService, 'sendEvent').and.callThrough();
    spyOn(_registrationService, 'endureState').and.callThrough();
    spyOn(_http, 'doPut').and.returnValue(
      Promise.reject({ _body: JSON.stringify(autheticateRes_reject) })
    );
    component.updateConsentForUser('test');
    expect(component).toBeTruthy();
  });
});
