import { HomeDeliveryService } from './../../../home_delivery/home-delivery.service';
import { Component } from '@angular/core';
import { ComboService } from '@app/pages/checkout/combined-checkout/combo.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { ActivatedRoute } from '@angular/router';
import { ROUTES } from '@app/config';
import { CHECKOUT } from '@app/config/checkout.constant';

@Component({
  selector: 'arxrf-combinedcheckout-base',
  templateUrl: './combo-base.component.html',
  styleUrls: ['./combo-base.component.scss']
})
export class ComboBaseComponent {
  
  hideMessage: boolean = false;
  
  constructor(
    public combo: ComboService,
    public checkout: CheckoutService,
    private _route: ActivatedRoute,
    private _homeDeliveryService: HomeDeliveryService
  ) {
     this._homeDeliveryService.globalBannerHideObs.subscribe((state) => {
      this.hideMessage = !state;
    });
    if (
      window.location.href.indexOf(
        ROUTES.checkout_combined.children.specialty.route
      ) !== -1
    ) {
      this.checkout.currentComboNavState = CHECKOUT.comboState.speciality;
    }
    combo.hideHead = true;
  }
}
