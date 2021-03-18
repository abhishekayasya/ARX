import { Component, OnInit } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { CheckoutService } from '@app/core/services/checkout.service';

@Component({
  selector: 'arxrf-checkout-default',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  ROUTES = ROUTES;

  emptyCart: boolean;

  constructor(public appContext: AppContext, public checkout: CheckoutService) {
    if (
      sessionStorage.getItem(AppContext.CONST.key_rx_count) == null ||
      sessionStorage.getItem(AppContext.CONST.key_rx_count) === '0'
    ) {
      this.emptyCart = true;
    }
  }

  ngOnInit(): void {}
}
