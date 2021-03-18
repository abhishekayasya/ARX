import { CheckoutService } from './../../../../../core/services/checkout.service';
import { PaymentService } from './../../payment.service';
import 'rxjs/add/observable/of';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddPaymentComponent } from './add-payment.component';
import { CommonUtil } from '@app/core/services/common-util.service';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';

const cardData = {
  creditCard: [
    {
      firstName: 'test',
      middleName: '',
      lastName: 'test',
      ccTokenNumber: 'test',
      subfid9B: 'test',
      expiryMonth: '05',
      expiryYear: '2020',
      creditCardType: 'xyz',
      default: 'true',
      active: true,
      rxType: 'SPECIALTY',
      paymentMethodId: '',
      deliveryInfo: {
        zip: '600060',
        city: 'chennai',
        street1: 'street',
        street2: 'street',
        state: 'tamil'
      }
    }
  ]
};
const DeliveryAddr = {
  srxDeliveryAddr: [
    {
      addedAddress: false,
      addressAvailable: false,
      addressId: '6460352',
      city: 'FRISCO',
      defaultAddress: false,
      firstName: 'DIGICATWSVN',
      lastName: 'DIGICATWSVN',
      preferred: false,
      referralAddress: false,
      state: 'TX',
      street1: 'THYAGA STREENULL',
      type: 'CENT',
      zip: '75033'
    },
    {
      addedAddress: false,
      addressAvailable: false,
      addressId: '6458867',
      city: 'FRISCO',
      defaultAddress: true,
      firstName: 'DIGICATWSVN',
      lastName: 'DIGICATWSVN',
      preferred: true,
      referralAddress: false,
      state: 'TX',
      street1: 'THYAGA STREE',
      type: 'HOME',
      zip: '75033'
    }
  ]
};

describe('AddPaymentComponent', () => {
  let component: AddPaymentComponent;
  let fixture: ComponentFixture<AddPaymentComponent>;
  let payment;
  let utill;
  let checkout;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddPaymentComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(AddPaymentComponent);
        component = fixture.componentInstance;
        payment = TestBed.get(PaymentService);
        utill = TestBed.get(CommonUtil);
        checkout = TestBed.get(CheckoutService);
        checkout.isCombo = true;
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    spyOn(payment, 'fetchCardData').and.callThrough();
    component.ngOnInit();
  });
  it('should execute prefillAddressComponents', () => {
    const data = {
      city: 'xxx',
      state: 'yyy',
      zip: 'zzzz'
    };
    component.prefillAddressComponents(data);
  });
  it('should execute prepareSubmitPayload', () => {
    spyOn(utill, 'encryptCCNumber').and.callFake(function() {
      return {
        subfid9B: 'none',
        number: '1233'
      };
    });
    component.prepareSubmitPayload();
  });
  it('should execute setBillingAddress', () => {
    const even_data = {
      target: { checked: true }
    };
    payment.cardData = DeliveryAddr;
    component.setBillingAddress(even_data);
  });
  it('should execute setBillingAddress for else', () => {
    const even_data = {
      target: {}
    };
    component.setBillingAddress(even_data);
  });
  it('should execute updateSubmitPayload', () => {
    component.ccPayload = cardData;
    component.updateSubmitPayload();
  });
  it('should execute saveCardInfo', () => {
    component.newCardForm.setValue({
      firstName: 'xxxx',
      lastName: 'test',
      cardNumber: 12345,
      expDate: '10',
      sameAsShipping: [false],
      street1: 'test',
      street2: 'test',
      city: 'test',
      state: 'test',
      zip: '600060',
      saveAsPrefered: [false]
    });
    component.saveCardInfo();
  });
  it('should execute updateCCType', () => {
    const even_data = {
      type: 'test'
    };
    component.updateCCType(even_data);
  });
});
