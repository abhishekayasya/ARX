import { Router } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HippaComponent } from './hippa.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { HttpClientService } from '@app/core/services/http.service';
const message_data = {
  messages: [{ message: 'success', type: 'INFO' }]
};
describe('HippaComponent', () => {
  let component: HippaComponent;
  let fixture: ComponentFixture<HippaComponent>;
  let router;
  let commonservice;
  let httpService;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HippaComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HippaComponent);
        component = fixture.componentInstance;
        router = TestBed.get(Router);
        commonservice = TestBed.get(CommonUtil);
        httpService = TestBed.get(HttpClientService);
      });
  }));
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should execute continueAction', () => {
    spyOn(router, 'navigate').and.stub();
    component.continueAction(true);
  });
  it('should execute continueAction http', () => {
    spyOn(router, 'navigate').and.stub();
    component.declarationStatus = true;
    spy = spyOn(httpService, 'doPut').and.returnValue(
      Promise.resolve({ json: () => message_data })
    );
    component.continueAction(true);
    expect(spy).toHaveBeenCalled();
  });
  xit('should execute continueAction else', () => {
    component.declarationStatus = true;
    spy = spyOn(router, 'navigate').and.stub();
    spy = spyOn(httpService, 'doPut').and.returnValue(
      Promise.resolve({ json: () => 'test' })
    );
    component.continueAction(true);
    expect(spy).toHaveBeenCalled();
  });
  xit('should execute continueAction error', () => {
    spyOn(router, 'navigate').and.stub();
    component.declarationStatus = true;
    spy = spyOn(httpService, 'doPut').and.returnValue(
      Promise.reject({ _body: JSON.stringify({ status: 500 }) })
    );
    component.continueAction(true);
    expect(spy).toHaveBeenCalled();
  });
  it('should execute gaEvent', () => {
    component.gaEvent();
  });
  it('should execute declarationReadAndAgreeToPolicy', () => {
    const event = { target: { checked: true } };
    component.declarationStatus = true;
    component.declarationReadAndAgreeToPolicy(event);
  });
  it('should execute declarationReadAndAgreeToPolicy', () => {
    const event = { target: { checked: true } };
    component.declarationReadAndAgreeToPolicy(event);
  });
  it('should execute declarationReadAndAgreeToPolicy', () => {
    const event = { target: { checked: false } };
    component.declarationReadAndAgreeToPolicy(event);
  });
  it('should execute redirectToCallBackURlForRegistration', () => {
    spy = spyOn(commonservice, 'navigate').and.stub();
    component.redirectToCallBackURlForRegistration('test');
    expect(spy).toHaveBeenCalled();
  });
});
