import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { SsoService } from '@app/core/services/sso.service';
import { AuthService } from '@app/core/guards/auth.service';
import { AppContext } from '@app/core/services/app-context.service';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { GaService } from '../services/ga-service';
import { state } from '@angular/core/src/animation/dsl';
import { CheckoutService } from '@app/core/services/checkout.service';

@Injectable()
export class SecuredRouteService implements CanActivate {
  // Add routes that ar not dependent on user login.
  publicRotes = [
    ROUTES.registration.route,
    ROUTES.sso.route
    //ROUTES.securityIformation.route
  ];
  //

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _ssoService: SsoService,
    private _common: CommonUtil,
    private _userService: UserService,
    private _appContext: AppContext,
    private _gaService: GaService,
    private route: ActivatedRoute,
    private _checkoutService: CheckoutService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    // tslint:disable-next-line: no-shadowed-variable
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (
      state.url === '/new-home-delivery-prescription/prescription-pca' ||
      state.url === '/transfer-home-delivery-prescription/prescription-pca' ||
      state.url === '/new-home-delivery-prescription/review?pca=new' ||
      state.url ===
        '/transfer-home-delivery-prescription/review?pca=transfer' ||
      state.url === '/new-home-delivery-prescription/confirmation-pca' ||
      state.url === '/transfer-home-delivery-prescription/confirmation-pca' ||
      state.url.includes(ROUTES.family_management.children.invite.absoluteRoute)
    ) {
      return true;
    }
    // handling sso case
    if (
      localStorage.getItem(AppContext.CONST.ssoStorageKey) != null &&
      ROUTES.registration.route === route.routeConfig.path
    ) {
      if (
        JSON.parse(localStorage.getItem(AppContext.CONST.ssoStorageKey))
          .isRegistering
      ) {
        this._appContext.setRegistrationState(ROUTES.address.route);
        return true;
      }
    }

    // rerouting harmony entry
    if (route.routeConfig.path.indexOf(ROUTES.harmony_entry.route) > -1 && route.queryParams['authToken']) {
      return true;
    }

    if (
      this.isPublic(route.routeConfig.path) &&
      localStorage.getItem(AppContext.CONST.uidStorageKey) == null
    ) {
      return true;
    }

    if (
      route.routeConfig.path === ROUTES.securityIformation.route &&
      localStorage.getItem(AppContext.CONST.uidStorageKey) == null &&
      localStorage.getItem('refId') != null
    ) {
      return true;
    }

    if (localStorage.getItem(AppContext.CONST.uidStorageKey) != null) {
      // capture post registration redirection url
      if (
        route.routeConfig.path.indexOf(
          ROUTES.home_delivery_refill_reminder.route
        ) > -1 ||
        route.routeConfig.path.indexOf(ROUTES.hd_prescription.route) > -1 ||
        route.routeConfig.path.indexOf(ROUTES.hd_transfer.route) > -1
      ) {
        this._common.storeRegistrationPostUrl(state.url);
      }

      // capture post login redirection url
      this._common.storeLoginPostUrl(state.url);

      if (
        this._userService.user === undefined
      ) {
        return this._userService.initUser1(
          localStorage.getItem(AppContext.CONST.uidStorageKey),
          false,
          state.url,
          false
        );
      } else {
        //localStorage.removeItem('lite_user');
        return true;
      }
    } else {
      // capture post registration redirection url
      if (
        route.routeConfig.path.indexOf(
          ROUTES.home_delivery_refill_reminder.route
        ) > -1 ||
        route.routeConfig.path.indexOf(
          ROUTES.speciality_refill_reminder.route
        ) > -1 ||
        route.routeConfig.path.indexOf(ROUTES.hd_prescription.route) > -1 ||
        route.routeConfig.path.indexOf(ROUTES.hd_transfer.route) > -1
      ) {
        this._common.storeRegistrationPostUrl(state.url);
      }

      if (state.url.indexOf('quick-reg=true') > -1) {
        this._common.navigate(ROUTES.registration.absoluteRoute);
        return false;
      }

      this._common.storeLoginPostUrl(state.url);
      this._common.navigate(ROUTES.login.route);
      return false;
    }
  }

  isPublic(route: string) {
    return this.publicRotes.indexOf(route) > -1;
  }

  fireSignedoutHdNewRxGAEvent() {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.categories.hd_new_prescription_signed_out_state,
        GA.actions.new_home_delivery_prescription.new_hd_rx_signed_out_state,
        GA.label.new_hd_rx.hd_new_rx_signed_out_state,
        GA.data.new_home_delivery_prescription.hd_new_rx_signed_out_state
      )
    );
  }

  fireSignedoutHdTransferRxGAEvent() {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.categories.hd_transfer_prescription_signed_out_state,
        GA.actions.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_out_state,
        GA.label.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_out_state,
        GA.data.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_out_state
      )
    );
  }

  fireSignedInHdNewRxGAEvent() {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.categories.hd_new_prescription_signed_in_state,
        GA.actions.new_home_delivery_prescription.new_hd_rx_signed_in_state,
        GA.label.new_hd_rx.hd_new_rx_signed_in_state,
        GA.data.new_home_delivery_prescription.hd_new_rx_signed_in_state
      )
    );
  }

  fireSignedInHdTransferRxGAEvent() {
    this._gaService.sendEvent(
      this.gaEventWithData(
        GA.categories.hd_transfer_prescription_signed_in_state,
        GA.actions.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_in_state,
        GA.label.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_in_state,
        GA.data.transfer_home_delivery_prescription
          .hd_transfer_rx_signed_in_state
      )
    );
  }

  gaEvent(category, action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    event.label = label;
    return event;
  }

  gaEventWithData(category, action, label = '', data): GAEvent {
    const event = <GAEvent>{};
    event.category = category;
    event.action = action;
    event.label = label;
    event.data = data;
    return event;
  }
}
