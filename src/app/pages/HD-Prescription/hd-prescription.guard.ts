import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from '@app/core/services/checkout.service';
import { UserService } from '@app/core/services/user.service';
import { ROUTES } from '@app/config';
import { HttpClientService } from '@app/core/services/http.service';
import { Microservice } from '@app/config';
import { NewPrescriptionComponent } from './components/new-prescription/new-prescription.component';

@Injectable()
export class HdPrescriptionGuard implements CanActivate {
  ROUTES = ROUTES;

  constructor(
    private _router: Router,
    private _checkout: CheckoutService,
    private _userService: UserService,
    private _httpService: HttpClientService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (localStorage.getItem('insuranceOnData') === 'No') {
      this._router.navigateByUrl(
        this.ROUTES.hd_prescription.children.enroll_insurance.absoluteRoute
      );
      return false;
    } else {
      // this._checkout.fetchInsuranceStatusData();
    }

    return true;
  }

  canDeactivate(
    component: NewPrescriptionComponent,
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const next1: string = nextState.url;

    if (next1 === '/myaccount') {
      if (confirm('Changes you made may not be saved.')) {
        location.replace('/myaccount');
        return false;
      } else {
        return false;
      }
    }
    return true;
  }
}
