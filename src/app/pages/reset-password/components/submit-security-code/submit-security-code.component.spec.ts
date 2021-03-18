import { Router } from '@angular/router';
import { ResetPasswordService } from './../../services/reset-password.service';
import { HttpClientService } from './../../../../core/services/http.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { SubmitSecurityCodeComponent } from './submit-security-code.component';

describe('SubmitSecurityCodeComponent', () => {
  let component: SubmitSecurityCodeComponent;
  let fixture: ComponentFixture<SubmitSecurityCodeComponent>;
  let httpservice;
  let passwordservice;
  let routerservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubmitSecurityCodeComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ResetPasswordService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SubmitSecurityCodeComponent);
        component = fixture.componentInstance;
        httpservice = TestBed.get(HttpClientService);
        passwordservice = TestBed.get(ResetPasswordService);
        routerservice = TestBed.get(Router);
      });
  }));
  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should create onchangeCode', () => {
    const event = { target: { value: [1, 2, 3, 4, 5, 6, 7] } };
    component.onchangeCode(event);
  });
  it('should create onchangeCode else', () => {
    const event = { target: { value: [1, 2, 3, 4, 5, 6] } };
    component.onchangeCode(event);
  });
  // it('should create onchangePhoneCode', () => {
  //   const event = { target: { value: [1, 2, 3, 4] } };
  //   component.onchangePhoneCode(event);
  //   expect(component.sendbuttonHighlights).toBe(false);
  // });
  // it('should create onchangePhoneCode else', () => {
  //   const event = { target: { value: [1, 2, 3] } };
  //   component.onchangePhoneCode(event);
  //   expect(component.sendbuttonHighlights).toBe(true);
  // });
  it('should create submitSecurtiyCode invalid form', () => {
    component.submitSecurtiyCode();
  });
  it('should create submitSecurtiyCode status=success', () => {
    component.submitSecurityCodeForm.setValue({ code: '123' });
    spyOn(routerservice, 'navigateByUrl').and.stub();
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            status: 'success'
          };
        }
      })
    );
    component.submitSecurtiyCode();
  });
  it('should create submitSecurtiyCode status else', () => {
    component.submitSecurityCodeForm.setValue({ code: '123' });
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            status: 'failure',
            messages: [
              { code: 'WAG_E_PROFILE_2020', message: 'test', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.submitSecurtiyCode();
  });
  it('should create submitSecurtiyCode else', () => {
    component.submitSecurityCodeForm.setValue({ code: '123' });
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            messages: [
              { code: 'WAG_E_PROFILE_2021', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.submitSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create submitSecurtiyCode', () => {
    component.submitSecurityCodeForm.setValue({ code: '123' });
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { messages: undefined };
        }
      })
    );
    component.submitSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create submitSecurtiyCode error', () => {
    component.submitSecurityCodeForm.setValue({ code: '123' });
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return { status: 500 };
        }
      })
    );
    component.submitSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create requestAnotherCode', () => {
    spyOn(routerservice, 'navigateByUrl').and.stub();
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            messages: [
              { code: 'WAG_I_PROFILE_2066', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.requestAnotherCode();
  });
  it('should create requestAnotherCode messagecode else', () => {
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            messages: [
              { code: 'WAG_I_PROFILE_2021', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.requestAnotherCode();
  });
  it('should create requestAnotherCode else', () => {
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { messages: undefined };
        }
      })
    );
    component.requestAnotherCode();
  });
  it('should create requestAnotherCode error', () => {
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return { status: 500 };
        }
      })
    );
    component.requestAnotherCode();
  });
  // it('should create getLastFourNumber', () => {
  //   component.getLastFourNumber(undefined);
  // });
  // it('should create getPhoneNumberByPriority', () => {
  //   passwordservice.phones = ['1', '2', '3'];
  //   component.getPhoneNumberByPriority('1');
  // });
  // it('should create getPhoneNumberByPriority else', () => {
  //   component.getPhoneNumberByPriority(undefined);
  // });
});
