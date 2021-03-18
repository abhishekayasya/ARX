import { CheckoutService } from './../../../core/services/checkout.service';
import { Router } from '@angular/router';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  flush
} from '@angular/core/testing';
import { UspsVerificationComponents } from './usps-verification.components';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { ArxUser } from '@app/models';
import { AppTestingModule } from '../../../../../tests/app.testing.module';

describe('UspsVerificationComponents', () => {
  let component: UspsVerificationComponents;
  let fixture: ComponentFixture<UspsVerificationComponents>;
  let _httpclientService: HttpClientService;
  let _userService;
  let _checkoutService;
  let _common;
  let _router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _httpclientService = TestBed.get(HttpClientService);
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser('11948190939');
        _common = TestBed.get(CommonUtil);
        _router = TestBed.get(Router);
        _checkoutService = TestBed.get(CheckoutService);
        sessionStorage.setItem(
          'ad_confirm',
          JSON.stringify({ type: 'test', editAddressId: 1 })
        );
        fixture = TestBed.createComponent(UspsVerificationComponents);
        component = fixture.componentInstance;
      });
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should call - ngOnInit with suggestedAddr', () => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            suggestedAddr: [
              { code: 'WAG_W_LOGIN_1024', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.ngOnInit();
  });
  it('should call - ngOnInit with messages', () => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              { code: 'WAG_W_LOGIN_1024', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.ngOnInit();
  });
  it('should call - ngOnInit else', () => {
    spyOn(_httpclientService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            message: [
              { code: 'WAG_W_LOGIN_1024', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.ngOnInit();
  });
  it('should call - saveAddressChanges', () => {
    component.addressToAdd = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpclientService, 'doPut').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              { code: 'WAG_I_AB_1001', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.saveAddressChanges(true);
  });
  it('should call - saveAddressChanges else', () => {
    component.addressToAdd = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpclientService, 'doPut').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              { code: 'WAG_I_AB_1111', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.saveAddressChanges(true);
  });
  it('should call - saveAddressChanges else', () => {
    component.addressToAdd = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    component.type = 'mailPlanRefillReminder';
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpclientService, 'doPut').and.returnValue(
      Promise.resolve({
        json: () => {
          return {
            messages: [
              { code: 'WAG_I_AB_1111', message: 'success', type: 'INFO' }
            ]
          };
        }
      })
    );
    component.saveAddressChanges(true);
  });
  it('should call - saveAddressChanges error', () => {
    component.addressToAdd = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    component.type = 'mailPlanRefillReminder';
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpclientService, 'doPut').and.returnValue(
      Promise.reject({
        json: () => {
          return {
            status: 500
          };
        }
      })
    );
    component.saveAddressChanges(true);
  });
  it('should call - submitHomeDeliveryAddress', () => {
    const address = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_httpclientService, 'putData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_I_AB_1000', message: 'success', type: 'INFO' }]
      })
    );
    component.submitHomeDeliveryAddress(address);
  });
  it('should call - submitHomeDeliveryAddress with postData', () => {
    const address = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_httpclientService, 'putData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_I_AB_1000', message: 'success', type: 'INFO' }]
      })
    );
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_I_AB_100', message: 'success', type: 'INFO' }]
      })
    );
    component.submitHomeDeliveryAddress(address);
  });
  it('should call - submitHomeDeliveryAddress with postData error', () => {
    const address = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_httpclientService, 'putData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_I_AB_1000', message: 'success', type: 'INFO' }]
      })
    );
    spyOn(_httpclientService, 'postData').and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.submitHomeDeliveryAddress(address);
  });
  it('should call - submitHomeDeliveryAddress else', () => {
    const address = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_httpclientService, 'putData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_I_AB_1001', message: 'success', type: 'INFO' }]
      })
    );
    component.submitHomeDeliveryAddress(address);
  });
  it('should call - submitHomeDeliveryAddress erro', () => {
    const address = {
      street1: 'test',
      type: 'test',
      subType: 'test',
      channel: 'test',
      channelType: 'test',
      source: 'test',
      zip: 'test'
    };
    spyOn(_httpclientService, 'putData').and.returnValue(
      Observable.throw({
        status: 500
      })
    );
    component.submitHomeDeliveryAddress(address);
  });
  it('should call - prepareSuggestedAddressData', () => {
    component.suggestedAddress = [1, 2];
    component.prepareSuggestedAddressData();
  });
  it('should call - suggestedAddressToSelect', () => {
    component.suggestedAddressToSelect(0);
  });
  it('should call - suggestedAddressToSelect', () => {
    component.suggestedAddressToSelect(1);
  });
  it('should call - preparingAddressBookPath', () => {
    component.type = 'HOMEDELIVERY';
    component.preparingAddressBookPath();
  });
  it('should call - preparingAddressBookPath', () => {
    component.type = 'mailPlanRefillReminder';
    component.preparingAddressBookPath();
  });
  it('should call - preparePrescReviewPath', () => {
    _checkoutService.isCombo = true;
    component.type = 'HOMEDELIVERY';
    component.preparePrescReviewPath();
  });
  it('should call - preparePrescReviewPath', () => {
    _checkoutService.isCombo = true;
    component.type = 'mailPlanRefillReminder';
    component.preparePrescReviewPath();
  });
  it('should call - preparePrescReviewPath', () => {
    component.type = 'HOMEDELIVERY';
    component.preparePrescReviewPath();
  });
  it('should call - preparePrescReviewPath', () => {
    component.type = 'mailPlanRefillReminder';
    component.preparePrescReviewPath();
  });
  it('should call - preparePrescReviewPath', () => {
    component.type = 'test';
    component.preparePrescReviewPath();
  });
});
