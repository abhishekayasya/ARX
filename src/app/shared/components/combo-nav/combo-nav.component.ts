import {Component, EventEmitter} from '@angular/core';
import {CheckoutService} from '@app/core/services/checkout.service';
import {CHECKOUT} from '@app/config/checkout.constant';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {ROUTES} from '@app/config';

@Component({
  selector: 'arxrf-checkout-combonav',
  templateUrl: './combo-nav.component.html',
  styleUrls: ['./combo-nav.component.scss']
})
export class ComboNavComponent {

  CHECKOUT = CHECKOUT;

  routes = ROUTES;

  constructor(
    public checkoutService: CheckoutService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    if ( this.checkoutService.comboState !== CHECKOUT.comboState.confirmation ) {
      if ( sessionStorage.getItem( CHECKOUT.session.key_hd_data ) == null ) {
        checkoutService.comboState = this.CHECKOUT.comboState.mail;
      }

      if ( sessionStorage.getItem( CHECKOUT.session.key_hd_data ) != null ) {
        checkoutService.comboState = this.CHECKOUT.comboState.speciality;
      }

      if ( sessionStorage.getItem( CHECKOUT.session.key_sp_data ) != null ) {
        checkoutService.comboState = this.CHECKOUT.comboState.confirmation;
      }
    }

  }


  navigateToStepMail() {
    if ( localStorage.getItem(this.CHECKOUT.session.key_items_hd) != null ) {
      this.checkoutService.currentComboNavState = this.CHECKOUT.comboState.mail;
      this._router.navigate([this.routes.checkout_combined.children.home_delivery.absoluteRoute]);
    }
  }

}
