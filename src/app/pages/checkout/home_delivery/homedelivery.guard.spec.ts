import {
  Router,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { async, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { HomeDeliveryConfirmationGuard } from './components/homedelivery.guard';

describe('HomeDeliveryConfirmationGuard', () => {
  let _checkout: CheckoutService;
  let homedelivery: HomeDeliveryConfirmationGuard;
  let _router: Router;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _checkout = TestBed.get(CheckoutService);
        homedelivery = TestBed.get(HomeDeliveryConfirmationGuard);
        _router = TestBed.get(Router);
      });
  }));

  it('Check homedelivery instance is available', () => {
    spyOn(_router, 'navigate').and.stub();
    expect(homedelivery).toBeTruthy();
  });

  it('Should call - canActivate', () => {
    spyOn(_router, 'navigate').and.stub();
    const state = jasmine.createSpyObj<RouterStateSnapshot>(
      'RouterStateSnapshot',
      ['toString']
    );
    state.url = '/home-delivery-checkout';
    const route = jasmine.createSpyObj<ActivatedRouteSnapshot>(
      'ActivatedRouteSnapshot',
      ['toString']
    );
    homedelivery.canActivate(route, state);
    expect(homedelivery).toBeTruthy();
  });
});
