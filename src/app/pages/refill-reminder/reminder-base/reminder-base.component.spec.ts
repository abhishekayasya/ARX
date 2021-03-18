import { CheckoutService } from './../../../core/services/checkout.service';
import { Router } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, flush } from '@angular/core/testing';
import { ReminderBaseComponent } from './reminder-base.component';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { ArxUser } from '@app/models';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import {
  fetch_data,
  checkout_data,
  message_data,
  message_data1,
  message_data2,
  message_data3
} from '../../../../../tests/reminder-base';
import { TEST } from '../../../../../tests/speciality-review';
import { ReminderService } from '../reminder.service';

describe('ReminderBaseComponent', () => {
  let component: ReminderBaseComponent;
  let fixture: ComponentFixture<ReminderBaseComponent>;
  let _httpclientService: HttpClientService;
  let _refillService: RefillBaseService;
  let _userService;
  let _checkoutService;
  let _reminderservice;
  let _common;
  let _router;
  let spy;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReminderBaseComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {

        _httpclientService = TestBed.get(HttpClientService);
        _refillService = TestBed.get(RefillBaseService);
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser('11948190939');
        _common = TestBed.get(CommonUtil);
        _router = TestBed.get(Router);
        _checkoutService = TestBed.get(CheckoutService);
        _reminderservice = TestBed.get(ReminderService);
        fixture = TestBed.createComponent(ReminderBaseComponent);
        component = fixture.componentInstance;
      });
  }));

  it('should create  component', fakeAsync(() => {
    fixture.detectChanges();
    flush();
    expect(component).toBeTruthy();
  }));

  it('should execute sendParameterForReminder', fakeAsync(() => {
    spy = spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.of(fetch_data)
    );
    flush();
    component.sendParameterForReminder();
    expect(spy).toHaveBeenCalled();
  }));

  it('should execute sendParameterForReminder error', fakeAsync(() => {
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    flush();
    component.sendParameterForReminder();
  }));
  it('should execute sendParameterForReminder', fakeAsync(() => {
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.of(checkout_data)
    );
    flush();
    component.sendParameterForReminder();
  }));

  it('should execute handleRefillReminderErrors  code=WAG_E_RR_001', fakeAsync(() => {
    flush();
    component.handleRefillReminderErrors(message_data1);
  }));

  it('should execute handleRefillReminderErrors  code=WAG_RXCHECKOUT_WRONG_USER', fakeAsync(() => {
    flush();
    component.handleRefillReminderErrors(message_data2);
  }));

  it('should execute handleRefillReminderErrors  code=WAG_RXCHECKOUT_002', fakeAsync(() => {
    flush();
    component.handleRefillReminderErrors(message_data3);
  }));

  it('should execute handleRefillReminderErrors else', fakeAsync(() => {
    flush();
    component.handleRefillReminderErrors({
      messages: [{ code: 'test', message: 'success', type: 'INFO' }]
    });
  }));

  it('should execute submitSrxReminderOrder', fakeAsync(() => {
    component.refillResponse = checkout_data;
    _reminderservice.patientsPayload = TEST.specialityData;
    flush();
    component.submitSrxReminderOrder();
  }));

  it('should execute furtherSubmitProcess', fakeAsync(() => {
    _checkoutService.orderPayload = TEST.orderData;
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.of(checkout_data)
    );
    flush();
    component.furtherSubmitProcess();
  }));

  xit('should execute furtherSubmitProcess else', fakeAsync(() => {
    _checkoutService.orderPayload = TEST.orderData;
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.of('test')
    );
    flush();
    component.furtherSubmitProcess();
  }));

  it('should execute furtherSubmitProcess error', fakeAsync(() => {
    _checkoutService.orderPayload = TEST.orderData;
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    flush();
    component.furtherSubmitProcess();
  }));

  it('should execute initCleansedPayload', fakeAsync(() => {
    component.refillResponse = checkout_data;
    _reminderservice.patientsPayload = TEST.orderData.checkoutDetails;
    flush();
    component.initCleansedPayload();
  }));

  it('should execute logoutAction', fakeAsync(() => {
    flush();
    spyOn(_router, 'navigateByUrl').and.stub();
  }));
});
