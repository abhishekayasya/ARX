import { ResetPasswordService } from './../../services/reset-password.service';
import { HttpClientService } from './../../../../core/services/http.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { SendSecurityCodeComponent } from './send-security-code.component';

describe('SendSecurityCodeComponent', () => {
  let component: SendSecurityCodeComponent;
  let fixture: ComponentFixture<SendSecurityCodeComponent>;
  let httpservice;
  let passwordservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendSecurityCodeComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [ResetPasswordService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SendSecurityCodeComponent);
        component = fixture.componentInstance;
        httpservice = TestBed.get(HttpClientService);
        passwordservice = TestBed.get(ResetPasswordService);
      });
  }));
  it('should create component', () => {
    expect(component).toBeTruthy();
  });
  it('should create updateVOption', () => {
    const event = { target: { id: 'txtMsg' } };
    component.updateVOption(event);
    expect(component.showTextSelection).toBe(true);
    expect(component.sendbuttonHighlights).toBe(true);
  });
  it('should create updateVOption else', () => {
    const event = { target: { id: 'email' } };
    component.updateVOption(event);
    expect(component.sendbuttonHighlights).toBe(false);
  });
  it('should create onchangePhoneCode', () => {
    const event = { target: { value: [1, 2, 3, 4] } };
    component.onchangePhoneCode(event);
    expect(component.sendbuttonHighlights).toBe(false);
  });
  it('should create onchangePhoneCode else', () => {
    const event = { target: { value: [1, 2, 3] } };
    component.onchangePhoneCode(event);
    expect(component.sendbuttonHighlights).toBe(true);
  });
  it('should create sendSecurtiyCode', () => {
    component.authOptionClicked = 'email';
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
    component.sendSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create sendSecurtiyCode else', () => {
    component.authOptionClicked = 'email';
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return {
            refId: 12,
            messages: [
              { code: 'WAG_I_PROFILE_2004', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.sendSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create sendSecurtiyCode', () => {
    component.authOptionClicked = 'email';
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.resolve({
        ok: true,
        json: () => {
          return { messages: undefined };
        }
      })
    );
    component.sendSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create sendSecurtiyCode', () => {
    component.authOptionClicked = 'email';
    spyOn(httpservice, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return { status: 500 };
        }
      })
    );
    component.sendSecurtiyCode();
    expect(component.showLoader).toBe(true);
  });
  it('should create getLastFourNumber', () => {
    component.getLastFourNumber(undefined);
  });
  it('should create getPhoneNumberByPriority', () => {
    passwordservice.phones = ['1', '2', '3'];
    component.getPhoneNumberByPriority('1');
  });
  it('should create getPhoneNumberByPriority else', () => {
    component.getPhoneNumberByPriority(undefined);
  });
});
