import { SPRefillReminderStateModel } from './../../models/sp-refillreminder.model';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { KEYS, ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';

/**
 * Guard to handle refill reminder urls.
 */
@Injectable()
export class RefillReminderGuard implements CanActivate {

  private isSpecialtyRefillReminder: boolean;
  private isHomeDeliveryRefillReminder: boolean;

  // utm parameters for Home delivery refill reminder
  private UTM_PARAMS = {
    utm_source: 'HD',
    utm_medium: 'email',
    utm_campaign: 'refillreminder'
  }

  // default sp refill reminder state
  private spState: SPRefillReminderStateModel = {
    params: {},
    dcaState: false
  };

  constructor(
    private _common: CommonUtil
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.init(route);

    if ( this.isSpecialtyRefillReminder ) {
      // For SP refill reminder if DCA flag is found false then redirecting
      // user to clinical assessment page.
      if ( !this.spState.dcaState ) {
        this.spState.params = route.queryParams;
        localStorage.setItem(
          KEYS.sp_rr_state_flag,
          JSON.stringify(this.spState)
        );
        this._common.navigate(ROUTES.clinical_assessment.route);
        return false;
      }
    } else if ( this.isHomeDeliveryRefillReminder && !route.queryParams['utm_source']) {
      // for home delivery refill reminder, preparing list of parameters with
      // utm parameters (if not found).
      // And redirecting user to same page with updated parameters list.
      let queryParams = {};
      queryParams = Object.assign(
        this.UTM_PARAMS,
        route.queryParams
      );
      this._common.navigate(
        ROUTES.home_delivery_refill_reminder.route,
        queryParams
      );
      return false;
    }
    return true;
  }

  /**
   * Intitialising
   *
   * @param route ActivatedRouteSnapshot
   */
  private init(route: ActivatedRouteSnapshot): void {
    this.isSpecialtyRefillReminder =
            (route.routeConfig.path.indexOf(ROUTES.speciality_refill_reminder.route) > -1);
    this.isHomeDeliveryRefillReminder =
            (route.routeConfig.path.indexOf(ROUTES.home_delivery_refill_reminder.route) > -1);

    // Initialising default specialty refill reminder state
    if (localStorage.getItem( KEYS.sp_rr_state_flag )) {
      this.spState = JSON.parse( localStorage.getItem( KEYS.sp_rr_state_flag ) );
    }
  }
}
