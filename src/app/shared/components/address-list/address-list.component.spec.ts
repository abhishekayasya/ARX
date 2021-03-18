import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  flush
} from '@angular/core/testing';
import { AddressListComponent } from './address-list.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { AddressBookService } from './../../../core/services/address-book.service';
import { update_address, address_data } from './../../../../../tests/reminder-base';
import { HttpClientService } from '@app/core/services/http.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models/user.model';
import { CommonUtil } from '@app/core/services/common-util.service';
const addressdata = [
  {
    id: '50002640022',
    firstName: 'Lava',
    lastName: 'Chocho',
    street1: '7123 SOUTH ROAD',
    city: 'BUFFOLLO GROOVE',
    state: 'IL',
    zipCode: '60015',
    isPreferred: true,
    newlyAdded: false,
    msRequest: false
  },
  {
    id: '50002770000',
    firstName: 'Lava',
    lastName: 'Chocho',
    street1: '305 WILMOT ROAD, DEERFIELD, IL, USA',
    city: 'DEERFIELD',
    state: 'IL',
    zipCode: '60015',
    isPreferred: false,
    newlyAdded: false,
    msRequest: false
  }
];
describe('AddressListComponent', () => {
  let component: AddressListComponent;
  let fixture: ComponentFixture<AddressListComponent>;
  let addressservice;
  let common;
  let _http: HttpClientService;
  let checkoutService: CheckoutService;
  let userService: UserService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        userService.user = new ArxUser('11948190939');
        fixture = TestBed.createComponent(AddressListComponent);
        addressservice = TestBed.get(AddressBookService);
        component = fixture.componentInstance;
        _http = TestBed.get(HttpClientService);
        checkoutService = TestBed.get(CheckoutService);
        common = TestBed.get(CommonUtil);
      });
  }));
  it('should create ', fakeAsync(() => {
    expect(component).toBeTruthy();
  }));
  it('should call ngAfterViewInit HD', fakeAsync(() => {
    component.type = 'HOMEDELIVERY';
    localStorage.setItem('isSpecialityRefillRemainder', JSON.stringify('true'));
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should call ngAfterViewInit HDR', fakeAsync(() => {
    component.type = 'mailPlanRefillReminder';
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should call ngAfterViewInit NEWRX', fakeAsync(() => {
    component.type = 'New Rx';
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should call ngAfterViewInit else', fakeAsync(() => {
    component.type = 'test';
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should call ngAfterViewInit CLEANSED', fakeAsync(() => {
    component.type = 'CLEANSED';
    checkoutService.isCombo = true;
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should call ngAfterViewInit UNSOLICITED', fakeAsync(() => {
    component.type = 'UNSOLICITED';
    checkoutService.isCombo = true;
    spyOn(component, 'fetchAddressList').and.stub();
    component.ngAfterViewInit();
  }));
  it('should execute updateAddressSelected', fakeAsync(() => {
    addressservice.addresses = update_address;
    component.updateAddressSelected();
  }));
  it('should call prepareHDaddress', fakeAsync(() => {
    component.prepareHDaddress('');
  }));
  it('should call - fetchAddressList HD', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    component.type = 'HOMEDELIVERY';
    component.fetchAddressList();
  }));
  it('should call - fetchAddressList HDR', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    component.type = 'mailPlanRefillReminder';
    component.fetchAddressList();
  }));
  it('should call - fetchAddressList SC', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    component.type = 'CLEANSED';
    component.fetchAddressList();
  }));
  it('should call - fetchAddressList else', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Promise.resolve({
        json: () => {
          return { addresses: undefined };
        }
      })
    );
    spyOn(common, 'replaceUrl').and.stub();
    component.type = 'CLEANSED';
    component.fetchAddressList();
  }));
  it('should call - fetchAddressList error', fakeAsync(() => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.type = 'CLEANSED';
    component.fetchAddressList();
  }));
  it('should execute deleteAddress WAG_I_AB_1002', () => {
    const request_body = [{ profileId: '1' }, { source: '' }];
    spyOn(_http, 'deleteData').and.returnValue(
      Observable.of({ messages: [{ code: 'WAG_I_AB_1002', message: 'success', type: 'INFO' }] })
    );
    component.deleteAddress('1');
  });
  it('should execute deleteAddress else', () => {
    spyOn(_http, 'deleteData').and.returnValue(
      Observable.of({ messages: [{ code: 'WAG_I_AB_1001', message: 'success', type: 'INFO' }] })
    );
    component.deleteAddress('1');
  });
  it('should execute deleteAddress error', () => {
    spyOn(_http, 'deleteData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.deleteAddress('1');
  });
  it('should execute selectAddressForCheckout isSpeciality', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    spyOn(common, 'navigate').and.stub();
    component.isSpeciality = true;
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
  it('should execute selectAddressForCheckout isSpeciality && isCleansed', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    spyOn(common, 'navigate').and.stub();
    component.isSpeciality = true;
    component.isCleansed = true;
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
  it('should execute selectAddressForCheckout', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ addresses: 'test', homeAddress: '' })
    );
    spyOn(common, 'navigate').and.stub();
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
  it('should execute selectAddressForCheckout else if', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ messageList: [{ code: 'WAG_I_AB_1001', message: 'success', type: 'INFO' }] })
    );
    spyOn(common, 'navigate').and.stub();
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
  it('should execute selectAddressForCheckout else', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ messageList: [{ code: 'ERROR', message: 'success', type: 'ERROR' }] })
    );
    spyOn(common, 'navigate').and.stub();
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
  it('should execute selectAddressForCheckout error', () => {
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    spyOn(common, 'navigate').and.stub();
    addressservice.addresses = addressdata;
    component.selectAddressForCheckout();
  });
});
