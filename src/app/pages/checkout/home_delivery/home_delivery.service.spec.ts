import { async, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { HomeDeliveryService } from './home-delivery.service';
describe('HomeDeliveryService', () => {
  let homedelivery: HomeDeliveryService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        homedelivery = TestBed.get(HomeDeliveryService);
      });
  }));
  it('should create', () => {
    expect(homedelivery).toBeTruthy();
  });
});
