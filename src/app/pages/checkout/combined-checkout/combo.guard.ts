import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ComboService} from '@app/pages/checkout/combined-checkout/combo.service';
import {CHECKOUT} from '@app/config/checkout.constant';
import {ROUTES} from '@app/config';

@Injectable()
export class ComboGuard implements CanActivateChild {

  constructor(
    private _combo: ComboService,
    private _router: Router
  ) {}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if ( sessionStorage.getItem(CHECKOUT.session.key_hd_data) == null ) {
      // handling case for speciality.
      if ( childRoute.routeConfig.path.indexOf(ROUTES.checkout_combined.children.specialty.route) !== -1 ||
            childRoute.routeConfig.path.indexOf(ROUTES.checkout_combined.children.confirmation.route) !== -1) {
        this._router.navigateByUrl( ROUTES.checkout_combined.children.home_delivery.absoluteRoute );
      }
    }
    return true;
  }

}
