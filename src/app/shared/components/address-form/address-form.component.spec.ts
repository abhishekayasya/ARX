import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { AddressFormComponent } from './address-form.component';
import { CheckoutService } from '@app/core/services/checkout.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../test/mocks/userService.mocks';
import { Observable } from 'rxjs/Observable';
import { FormGroup } from '@angular/forms';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let checkoutService;
  let userService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        userService = TestBed.get(UserService);
        userService.user = new ArxUser('11948190939');
        userService.user.profile = jsonUsr;
        fixture = TestBed.createComponent(AddressFormComponent);
        component = fixture.componentInstance;
        checkoutService = TestBed.get(CheckoutService);
        component.prefill = new Observable<any>();
        const prefill_data = {
          id: 1,
          firstName: 'test',
          lastName: 'test',
          street1: 'test',
          city: 'test',
          state: 'test',
          zipCode: 'test',
          zipCodeOptional: 'test',
          isPreferred: false
        };
        component.prefill = Observable.of(prefill_data);
      });
  }));

  it('should create ', () => {
    expect(component).toBeTruthy();
  });
  it('should call ngOnInit', () => {
    component.ngOnInit();
  });
  it('should call ngOnInit isCombo=HDR', () => {
    component.type = 'mailPlanRefillReminder';
    checkoutService.isCombo = true;
    component.ngOnInit();
  });
  it('should call ngOnInit HD', () => {
    component.type = 'HOMEDELIVERY';
    component.ngOnInit();
  });
  it('should call ngOnInit HDR', () => {
    component.type = 'mailPlanRefillReminder';
    component.ngOnInit();
  });
  it('should call ngOnInit isCombo=HD', () => {
    component.type = 'HOMEDELIVERY';
    checkoutService.isCombo = true;
    component.ngOnInit();
  });
  it('should call submitAddressRequest', () => {
    spyOn(component, 'addAddress').and.stub();
    component.submitAddressRequest();
  });
  xit(`should call addAddress`, () => {
    component._editAddressForm.setValue({
      street1: 'test',
      city: 'test',
      state: 'test',
      zipCode: 'test',
      zipCodeOptional: 'test',
      isPreferred: true
    });
    fixture.detectChanges();
    component.type = 'HOMEDELIVERY';
    component.addAddress();
  });
  xit(`should call ngAfterViewInit`, () => {
    const prefill_data = {
      id: 1,
      firstName: 'test',
      lastName: 'test',
      street1: 'test',
      city: 'test',
      state: 'test',
      zipCode: 'test',
      zipCodeOptional: 'test',
      isPreferred: false
    };
    component.prefill = Observable.of(prefill_data);
    component.ngAfterViewInit();
  });
  it(`should call gaEvent function`, () => {
    component.gaEvent();
    expect(component).toBeTruthy();
  });
  it(`should call gaHDEvent function`, () => {
    component.gaHDEvent();
    expect(component).toBeTruthy();
  });
});
