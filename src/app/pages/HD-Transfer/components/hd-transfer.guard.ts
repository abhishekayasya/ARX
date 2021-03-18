import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {ROUTES} from '@app/config';
import {CheckoutService} from '@app/core/services/checkout.service';

@Injectable()
export class HDTransferGuard implements CanActivate {
  ROUTES = ROUTES;

  constructor(
    private _router: Router,
    private _checkout: CheckoutService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    /*this._checkout.getInsuranceStatus().subscribe(
      response => {
        if ( response.insuranceOnFile === 'No') {
          this._router.navigateByUrl(this.ROUTES.hd_prescription.children.enroll_insurance.absoluteRoute);
          return false;
        } else {
         // this._router.navigate([ROUTES.hd_transfer.route]);
        // this._router.navigate(ROUTES.hd_transfer.children.prescription.absoluteRoute);
         //this._router.navigateByUrl(this.ROUTES.hd_transfer.children.prescription.absoluteRoute);
         //this._router.navigate([ROUTES.hd_transfer.route]);
         //this._router.navigate([ROUTES.hd_transfer.children.prescription.route]);
         // this._router.navigateByUrl(this.ROUTES.hd_transfer.children.prescription.absoluteRoute);
          return  true;
         // this._router.navigate([ROUTES.hd_transfer.children.prescription.route]);
         //return true;
        }
      }
   );*/
   // this._router.navigate([ROUTES.hd_transfer.route]);
    return true;
  }

}
