import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdatePaymentComponent } from './update-payment.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../../tests/app.testing.module';
import { PaymentService } from './../../payment.service';
import { CommonUtil } from '@app/core/services/common-util.service';

const cardData = {
  creditCard: [
    {
      deliveryInfo: {
        street2: 'street'
      }
    }
  ]
};
const submitData = {
  creditCard: {
    firstName: 'test',
    middleName: '',
    lastName: 'test',
    cardNumber: '111',
    lastFourDigit: '9876',
    ccExpiryYear: '2020',
    ccExpiryMonth: '08',
    creditCardType: 'xyz',
    default: 'true',
    active: true,
    paymentMethodId: '123',
    creditCardNumber: '11111111111111111',
    deliveryInfo: {
      zip: '600060',
      city: 'chennai',
      street1: 'street',
      street2: 'street',
      state: 'tamil'
    },
    selected: 'true'
  },
  billingInfo: {
    zip: '600060',
    city: 'chennai',
    street1: 'street',
    state: 'tamil'
  }
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
describe('UpdatePaymentComponent', () => {
  let component: UpdatePaymentComponent;
  let fixture: ComponentFixture<UpdatePaymentComponent>;
  let payment;
  let utill;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpdatePaymentComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(UpdatePaymentComponent);
        component = fixture.componentInstance;
        payment = TestBed.get(PaymentService);
        utill = TestBed.get(CommonUtil);
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
  it('should execute setBillingAddress', () => {
    const even_data = {
      target: { checked: true }
    };
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
  it('should execute prepareSubmitPayload', () => {
    component.creditCard = submitData.creditCard;
    component.prepareSubmitPayload();
  });
  it('should execute transformCreditCardNumber', () => {
    component.transformCreditCardNumber('1111', '3');
  });
  it('should execute cardSelected', () => {
    component.creditCard = submitData.creditCard;
    expect(component.cardSelected).toBe(false);
  });
  it('should execute after view init', () => {
    component.newCardForm.setValue({
      sameAsShipping: [false],
      expDate: '10',
      street1: 'test',
      street2: 'test',
      city: 'test',
      state: 'test',
      zip: '600060',
      saveAsPrefered: [false]
    });
    component.creditCard = submitData.creditCard;
    component.ngAfterViewInit();
  });
  it('should execute selectCard', () => {
    payment.cardData = submitData;
    component.selectCard();
  });
  it('should execute populateFields', () => {
    component.creditCard = submitData;
    payment.cardData = DeliveryAddr;
    component.populateFields();
  });
});
