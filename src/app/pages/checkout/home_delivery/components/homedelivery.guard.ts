import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {CommonUtil} from '@app/core/services/common-util.service';
import {ROUTES} from '@app/config';
import {CheckoutService} from '@app/core/services/checkout.service';

@Injectable()
export class HomeDeliveryConfirmationGuard implements CanActivate {

  constructor(
    private _common: CommonUtil,
    private _router: Router,
    private _checkout: CheckoutService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if ( this._checkout.valid.mail ) {
      return true;
    } else {
      this._router.navigate([ROUTES.checkout_hd.route]);
    }
    return false;
  }

}
