import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ROUTES} from '@app/config';
import {CheckoutService} from '@app/core/services/checkout.service';

@Injectable()
export class HomePrescriptionGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _checkout: CheckoutService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if ( sessionStorage.getItem('Nrx') || sessionStorage.getItem('pcaInfo')) {
      return true;
    } else {
      this._router.navigate([ROUTES.hd_prescription.children.prescription.route]);
    }
    return false;
  }

}
