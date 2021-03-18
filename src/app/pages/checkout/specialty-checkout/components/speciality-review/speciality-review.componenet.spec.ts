import { SpecialityService } from './../../speciality.service';
import { UserService } from '@app/core/services/user.service';
import { Router } from '@angular/router';

import { HttpClientService } from './../../../../../core/services/http.service';
import { CheckoutService } from './../../../../../core/services/checkout.service';
import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SpecialityReviewComponent } from './speciality-review.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';
import { TEST } from '../../../../../../../tests/speciality-review';
import { of } from 'rxjs/observable/of';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { CommonUtil } from '@app/core/services/common-util.service';

describe('SpecialityReviewComponent', () => {
  let component: SpecialityReviewComponent;
  let fixture: ComponentFixture<SpecialityReviewComponent>;
  let userservice;
  let checkoutservice;
  let httpservice;
  let routerservice;
  let specialityservice;
  let commonservice;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialityReviewComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(SpecialityReviewComponent);
        component = fixture.componentInstance;
        userservice = TestBed.get(UserService);
        checkoutservice = TestBed.get(CheckoutService);
        httpservice = TestBed.get(HttpClientService);
        routerservice = TestBed.get(Router);
        specialityservice = TestBed.get(SpecialityService);
        commonservice = TestBed.get(CommonUtil);
        // fixture.detectChanges();
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngAfterViewInit', () => {
    component.unsolicited = TEST.unsoliciteData;
    component.ngOnInit();
  });
  it('should execute removePrescription', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of(TEST.checkoutData);
    });
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription when info=undefined', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of(TEST.checkoutData1);
    });
    checkoutservice.iscombo = true;
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription when unsolicited.prescriptionList = info.prescriptionList', () => {
    component.unsolicited = TEST.unsoliciteData1;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of(TEST.checkoutData);
    });
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription else checkoutservice with message', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of(TEST.checkoutMessage);
    });
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription else checkoutservice without message', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of({});
    });
    spyOn(routerservice, 'navigate').and.stub();
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription for else', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(false);
    });
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription postData error', () => {
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.removePrescription(1, 1, 1);
  });
  it('should execute removePrescription checkoutservice error', () => {
    component.unsolicited = TEST.unsoliciteData;
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(true);
    });
    spyOn(checkoutservice, 'deliveryOptions').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.removePrescription(1, 1, 1);
  });
  it('should execute initPayloads for unsolicited', () => {
    component.initPayloads();
    checkoutservice.data_deliveryOptions = TEST.checkoutData;
    // component.cleansed.patient = TEST.cleancePatient;
    fixture.detectChanges();
  });

  it('should execute initPayloads for cleansed', () => {
    component.initPayloads();
    checkoutservice.data_deliveryOptions = TEST.checkoutData1;
    // component.cleansed.patient = TEST.cleancePatient;
    fixture.detectChanges();
  });
  it('should execute initPayloads for undefined', () => {
    spyOn(checkoutservice, 'deliveryOptions').and.callFake(function() {
      return of(TEST.checkoutData1);
    });
    component.initPayloads();
    checkoutservice.data_deliveryOptions.checkoutDetails = undefined;
  });
  it('should execute initPayloads for undefined error', () => {
    spyOn(checkoutservice, 'deliveryOptions').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.initPayloads();
  });
  it('should execute submitSpecialityOrder for unsolicited', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    component.unsolicited = TEST.unsoliciteData;
    component.submitSpecialityOrder();
  });
  it('should execute submitSpecialityOrder for cleansed', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    component.cleansed = TEST.unsoliciteData1;
    checkoutservice.data_deliveryOptions = TEST.orderData2;
    specialityservice.cleansedTermsAndConditions = 'xxxx';
    specialityservice.patientsPayload = TEST.specialityData;
    component.submitSpecialityOrder();
  });
  it('should execute validateUnsolicitedData', () => {
    component.unsolicited = TEST.unsoliciteData;
    component.validateUnsolicitedData();
  });
  it('should execute furtherSubmitProcess', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    checkoutservice.iscombo = true;
    checkoutservice.needHDCreditCard = true;
    spyOn(userservice, 'getCCToken').and.callFake(function() {
      return of(TEST.tokenData);
    });
    component.furtherSubmitProcess();
  });
  it('should execute furtherSubmitProcess for cleansed', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    component.cleansed = TEST.unsoliciteData;
    checkoutservice.iscombo = true;
    checkoutservice.needHDCreditCard = true;
    spyOn(userservice, 'getCCToken').and.callFake(function() {
      return of(TEST.tokenData);
    });
    component.furtherSubmitProcess();
  });
  it('should execute furtherSubmitProcess else', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    checkoutservice.iscombo = true;
    checkoutservice.needHDCreditCard = true;
    spyOn(userservice, 'getCCToken').and.callFake(function() {
      return of(TEST.tokenData1);
    });
    component.furtherSubmitProcess();
  });
  it('should execute furtherSubmitProcess error', () => {
    spyOn(component,'initCleansedPayload').and.stub();
    checkoutservice.iscombo = true;
    checkoutservice.needHDCreditCard = true;
    spyOn(userservice, 'getCCToken').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.furtherSubmitProcess();
  });
  it('should execute proceedToFinalSubmission', () => {
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of(TEST.orderData);
    });
    checkoutservice.iscombo = true;
    spyOn(routerservice, 'navigateByUrl').and.stub();
    component.proceedToFinalSubmission(TEST.orderData);
  });
  it('should execute proceedToFinalSubmission else', () => {
    spyOn(httpservice, 'postData').and.callFake(function() {
      return of({});
    });
    component.proceedToFinalSubmission(TEST.orderData);
  });
  it('should execute proceedToFinalSubmission error', () => {
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.proceedToFinalSubmission(TEST.orderData);
  });
  it('should execute prepareOrderPayloadRequest', () => {
    component.prepareOrderPayloadRequest(TEST.orderData.checkoutDetails);
  });
  it('should execute prepareOrderPayloadRequest with SPECIALITY && UNSOLICITED', () => {
    component.unsolicited = TEST.unsoliciteData;
    component.prepareOrderPayloadRequest(TEST.checkoutData.checkoutDetails);
  });
  it('should execute prepareOrderPayloadRequest with HOMEDELIVERY', () => {
    checkoutservice.needHDCreditCard = true;
    component.prepareOrderPayloadRequest(TEST.orderData1.checkoutDetails);
  });
  xit('should execute redirectToAddressBook', () => {
    component.redirectToAddressBook('test', 1);
    spyOn(commonservice, 'navigate').and.stub();
  });
  xit('should execute prefillAddressComponents', () => {
    component.prefillAddressComponents(TEST.mockAddress);
    fixture.detectChanges();
    const form = component.unsolicitedAddressForm;
    form.patchValue({
      zipCode: TEST.mockAddress.zipCode,
      city: TEST.mockAddress.city,
      state: TEST.mockAddress.state
    });
  });
});
