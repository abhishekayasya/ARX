import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '@app/core/services/checkout.service';
import { ROUTES } from '@app/config';
import { async } from '@angular/core/testing';
import { EnrollInsuranceComponent } from './components/enroll-insurance/enroll-insurance.component';

@Injectable()
export class HdEnrollGuard implements CanActivate {
  ROUTES = ROUTES;

  constructor(private _router: Router, private _checkout: CheckoutService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('insuranceOnData') !== 'No') {
      this._router.navigateByUrl(
        this.ROUTES.hd_prescription.children.prescription.absoluteRoute
      );
      return false;
    } else {
      return true;
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
        this.ROUTES.hd_prescription.children.enroll_insurance.absoluteRoute
      );
      return false;
    }
    return true;
  }
}
