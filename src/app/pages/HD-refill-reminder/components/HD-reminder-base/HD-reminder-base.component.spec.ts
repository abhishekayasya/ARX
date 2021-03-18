import { u_info } from './../../../../../../test/mocks/userService.mocks';
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';

import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { DebugElement } from '@angular/core';
import { HDPatientComponent } from '../HD-patient/HD-patient.component';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { BuyoutService } from '@app/core/services/buyout.service';
import { MembersService } from '@app/core/services/members.service';
import { GaService } from '@app/core/services/ga-service';
import { AddressBookService } from './../../../../core/services/address-book.service';
import { HD_ReminderService } from '@app/pages/HD-refill-reminder/HD_Reminder.service';
import { UserService } from '@app/core/services/user.service';
import { SharedModule } from '@app/shared/shared.module';
import { HD_ReminderBaseComponent } from './HD-reminder-base.component';
import {
  fetch_data,
  address_data,
  address_data1,
  checkout_data,
  checkout_data1,
  checkout_data2,
  message_data,
  message_data1,
  refill_data,
  fetch_data1,
  fetch_data2,
  params_data,
  message_data2,
  checkout_data3,
  mail_data,
  update_address,
  message_data3
} from '../../../../../../tests/reminder-base';
describe('HD_ReminderBaseComponent', () => {
  let component: HD_ReminderBaseComponent;
  let fixture: ComponentFixture<HD_ReminderBaseComponent>;
  let debugElement: DebugElement;
  let httpMock: HttpTestingController;
  let checkoutservice;
  let addressservice;
  let http;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HD_ReminderBaseComponent, HDPatientComponent],
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        AppContext,
        HttpClientService,
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: Observable.of({ params: [1, 2, 3, 4] })
          }
        },
        CommonUtil,
        CookieService,
        DatePipe,
        CheckoutService,
        UserService,
        HD_ReminderService,
        AddressBookService,
        RefillBaseService,
        BuyoutService,
        MembersService,
        GaService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HD_ReminderBaseComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    checkoutservice = TestBed.get(CheckoutService);
    addressservice = TestBed.get(AddressBookService);
    http = TestBed.get(HttpClientService);
    httpMock = TestBed.get(HttpTestingController);
    component.mailData = mail_data;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should excute prepareRefillInformation with param_reminderid', () => {
    component.CONST.param_reminderid = 'reminderid';
    component.prepareRefillInformation(params_data);
    fixture.detectChanges();
  });
  it('should excute fetchHealthHistory', () => {
    spyOn(http, 'postData').and.callFake(() => {
      return of(fetch_data);
    });
    component.fetchHealthHistory();
    component.loader = false;
  });
  it('should excute fetchHealthHistory with else part', () => {
    spyOn(http, 'postData').and.callFake(() => {
      return of(fetch_data1);
    });
    component.fetchHealthHistory();
    expect(component.loader).toEqual(false);
  });
  it('should excute fetchHealthHistory without healthInfo', () => {
    spyOn(http, 'postData').and.callFake(() => {
      return of(fetch_data2);
    });
    component.fetchHealthHistory();
    expect(component.loader).toEqual(false);
  });
  it('should excute fetchHealthHistory error', () => {
    spyOn(http, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    component.fetchHealthHistory();
    expect(component.loader).toEqual(false);
  });
  xit('should execute initiateSessionForReminder', function() {
    addressservice.homeAddress = {
      firstName: 'xxxx',
      lastName: 'xxxx',
      street1: 'THYAGA STREE',
      city: 'FRISCO',
      state: 'TX',
      zipCode: '75033',
      newlyAdded: false,
      msRequest: false
    };
    spyOn(checkoutservice, 'fetchAddressList').and.callFake(() => {
      return of(address_data);
    });
    component.initiateSessionForReminder();
    addressservice.addresses = address_data.addresses;
    expect(component.loader).toEqual(false);
  });
  it('should execute initiateSessionForReminder in else condition', function() {
    addressservice.homeAddress = {
      firstName: 'xxxx',
      lastName: 'xxxx',
      street1: 'THYAGA STREE',
      city: 'FRISCO',
      state: 'TX',
      zipCode: '75033',
      newlyAdded: false,
      msRequest: false
    };
    localStorage.setItem('u_info', JSON.stringify(u_info));
    spyOn(checkoutservice, 'fetchAddressList').and.callFake(() => {
      return of(address_data1);
    });
    component.initiateSessionForReminder();
  });
  it('should execute initiateSessionForReminder error', function() {
    spyOn(checkoutservice, 'fetchAddressList').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.initiateSessionForReminder();
  });
  it('should execute getHDRefillReminderData', function() {
    spyOn(http, 'postData').and.callFake(() => {
      return of(checkout_data);
    });
    component.getHDRefillReminderData();
    component.updateAddressSelected();
    expect(component.loader).toBeFalsy();
  });
  it('should execute getHDRefillReminderData response with message', function() {
    spyOn(http, 'postData').and.callFake(() => {
      return of(checkout_data1);
    });
    component.getHDRefillReminderData();
    component.handleRefillReminderErrors(checkout_data1);
    expect(component.loader).toEqual(false);
  });
  it('should execute getHDRefillReminderData without response', function() {
    spyOn(http, 'postData').and.callFake(() => {
      return of([]);
    });
    component.getHDRefillReminderData();
    expect(component.loader).toBeFalsy();
  });
  it('should execute getHDRefillReminderData error', function() {
    spyOn(http, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    component.getHDRefillReminderData();
    expect(component.loader).toBeFalsy();
  });
  it('should execute handleRefillReminderErrors with checkoutDetails', () => {
    component.handleRefillReminderErrors(checkout_data2);
    fixture.detectChanges();
  });
  it('should execute handleRefillReminderErrors  checkoutDetails else part', () => {
    component.handleRefillReminderErrors(checkout_data3);
    fixture.detectChanges();
  });
  it('should execute handleRefillReminderErrors  response with code', () => {
    component.handleRefillReminderErrors(refill_data);
    fixture.detectChanges();
  });
  it('should execute handleRefillReminderErrors  response with code WAG_E_RR_001', () => {
    component.handleRefillReminderErrors(checkout_data1);
    fixture.detectChanges();
  });
  it('should execute handleRefillReminderErrors  response with code WAG_E_RR_001', () => {
    component.handleRefillReminderErrors(checkout_data1);
    fixture.detectChanges();
  });
  it('should execute handleRefillReminderErrors code with WAG_E_RR_001', () => {
    component.handleRefillReminderErrors(message_data1);
  });
  it('should execute handleRefillReminderErrors code with WAG_RXCHECKOUT_WRONG_USER', () => {
    component.handleRefillReminderErrors(message_data2);
    fixture.detectChanges();
  });
  it('should execute isAllPrescriptionValid', () => {
    component.isAllPrescriptionValid(message_data);
  });
  it('should execute isInValidPrescriptions', function() {
    component.isInValidPrescriptions(message_data);
    expect(component.isInValidPrescriptions(null)).toEqual(false);
  });
  it('should execute getRefillReminderData', function() {
    component.reviewMailData = checkout_data;
    spyOn(http, 'postData').and.callFake(() => {
      return of(checkout_data2);
    });
    component.getRefillReminderData();
  });
  it('should execute getRefillReminderData with code WAG_RXCHECKOUT_002', function() {
    component.reviewMailData = checkout_data;
    spyOn(http, 'postData').and.callFake(() => {
      return of(message_data3);
    });
    component.getRefillReminderData();
  });
  it('should execute getRefillReminderData with else part', function() {
    component.reviewMailData = checkout_data;
    spyOn(http, 'postData').and.callFake(() => {
      return of(message_data1);
    });
    component.getRefillReminderData();
  });
  it('should execute getRefillReminderData error', function() {
    component.reviewMailData = checkout_data;
    spyOn(http, 'postData').and.returnValue(Observable.throw({ status: 500 }));
    component.getRefillReminderData();
  });
  it('should execute ngAfterViewInit', function() {
    component.ngAfterViewInit();
  });
  it('should execute logoutAction', function() {
    spyOn(component, 'logoutAction').and.stub();
  });
  it('should execute updateAddressSelected', function() {
    addressservice.addresses = update_address;
    component.updateAddressSelected();
  });
  it('should execute oninitiateSessionFormRemainderError', function() {
    component.oninitiateSessionFormRemainderError();
  });
});
