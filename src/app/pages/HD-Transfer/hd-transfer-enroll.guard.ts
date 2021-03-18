import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '@app/core/services/checkout.service';
import { ROUTES, KEYS } from '@app/config';
import { async } from '@angular/core/testing';
import { EnrollInsuranceComponent } from './components/enroll-insurance/enroll-insurance.component';


@Injectable()
export class HdTransferEnrollGuard implements CanActivate {
  ROUTES = ROUTES;

  constructor(private _router: Router, private _checkout: CheckoutService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if ( localStorage.getItem( KEYS.insurance_key_available ) ) {
      if (localStorage.getItem(KEYS.insurance_key_available) !== 'No') {
        this._router.navigateByUrl(
          this.ROUTES.hd_transfer.children.prescription.absoluteRoute
        );
        return false;
      } else {
        return true;
      }
    } else {
      return new Promise((resolve) => {
        this._checkout.getInsuranceStatus()
            .subscribe(
              response => {
                localStorage.setItem(KEYS.insurance_key_available, response.insuranceOnFile);
                if ( response.insuranceOnFile !== 'No' ) {
                  this._router.navigateByUrl(
                    this.ROUTES.hd_transfer.children.prescription.absoluteRoute
                  );
                  resolve(false);
                } else {
                  resolve(true);
                }
              },
              () => {
                localStorage.setItem(KEYS.insurance_key_available, 'No');
                resolve(false);
              }
            );
        });
    }
  }

  canDeactivate(
    component: EnrollInsuranceComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const next1: string = nextState.url;
    if (next1 === '/myaccount') {
      location.replace(
        this.ROUTES.hd_transfer.children.enroll_insurance.absoluteRoute
      );
      return false;
    }
    return true;
  }
}
