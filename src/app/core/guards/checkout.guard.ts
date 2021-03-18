import { Injectable } from '@angular/core';
import { CheckoutService } from '@app/core/services/checkout.service';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Microservice } from '@app/config';
import { Observable } from 'rxjs/Observable';
import { CHECKOUT } from '@app/config/checkout.constant';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES, ARX_MESSAGES } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';
import { UserService } from '@app/core/services/user.service';
import { MembersService } from '@app/core/services/members.service';
import { AddressBookService } from '../services/address-book.service';
import { MessageService } from '../services/message.service';
import { Message } from '@app/models';
import { HttpClientService } from '../services/http.service';

@Injectable()
export class CheckoutGuard implements CanActivate {
  ShowLoader = false;

  constructor(
    private _checkout: CheckoutService,
    private _common: CommonUtil,
    private _router: Router,
    private _http: HttpClientService,
    private _membersService: MembersService,
    public userService: UserService,
    public addressesService: AddressBookService,
    private _message: MessageService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    let promise;

    const missexMemberId = this._membersService.canProceedToCheckout();
    if (missexMemberId !== '' && !sessionStorage.getItem('isInsuranceAdded')) { //if missexMemberId have some value
      this._common.navigate(
        ROUTES.missing_insurance.absoluteRoute + '?mid=' + missexMemberId
      );
      return false;
    } else {
      this._membersService.removeCartCacheIfExist();
      this._membersService.removeInsuranceCacheIfExist();
      if (sessionStorage.getItem('isInsuranceAdded')) {
        sessionStorage.removeItem('isInsuranceAdded');
      }
    }

    promise = new Promise(async resolve => {
      const validateRoute = () => {
        // Handling combo checkout.
        if (this._checkout.isCombo) {
          if (
            route.routeConfig.path.indexOf(ROUTES.checkout_combined.route) !==
            -1
          ) {
            resolve(true);
          } else {
            if (this.handleRoutesForCombo(state.url)) {
              // If url belongs to combo checkout, then allow to be redirected there.
              resolve(true);
            } else {
              // If url belongs to other checkout then redirect to combo checkout HD screen.
              this._common.navigate(
                ROUTES.checkout_combined.children.home_delivery.absoluteRoute
              );
              resolve(true);
              return;
            }
          }
        } else if (
          route.routeConfig.path.indexOf(ROUTES.checkout_hd.route) !== -1 &&
          this._checkout.exists.mail
        ) {
          resolve(true);
          return;
        } else if (
          (this._checkout.exists.cleansed ||
            this._checkout.exists.unsolicited) &&
          !this._checkout.exists.mail
        ) {
          if (route.routeConfig.path.indexOf(ROUTES.checkout_sp.route) !== -1) {
            resolve(true);
            return;
          } else {
            this._router.navigateByUrl(ROUTES.checkout_sp.absoluteRoute);
            resolve(true);
            return;
          }
        } else {
          sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
          this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
        }
      };

      if (
        sessionStorage.getItem(CHECKOUT.session.key_srx_reminder) !== null &&
        state.url === ROUTES.checkout_sp.children.confirmation.absoluteRoute
      ) {
        // handling refill reminder confirmation case.
        resolve(true);
      } else {
        if (this._checkout.data_deliveryOptions === undefined) {
          // let checkoutType = this._checkout.getCheckoutType();
          // if ( route.routeConfig.path.indexOf(ROUTES.checkout_hd.route) !=-1) {
          // if ( !(this._checkout.exists.cleansed || this._checkout.exists.unsolicited) && this._checkout.exists.mail) {
          // if(checkoutType == "checkout_hd") {

          if (
            state.url === ROUTES.checkout_hd.absoluteRoute ||
            state.url ===
              ROUTES.checkout_combined.children.home_delivery.absoluteRoute
          ) {
            const addressPromise = new Promise(resolv => {
              this._checkout.fetchAddressList().subscribe(
                res => {
                  if (res.messages === undefined) {
                    this.addressesService.saveAddressData(
                      res.addresses,
                      res.homeAddress
                    );
                  } else {
                    this.addressesService.saveAddressData([], res.homeAddress);
                  }
                  resolv();
                },
                () => {
                  // this.loader = false;
                  this._message.addMessage(
                    new Message(
                      ARX_MESSAGES.ERROR.service_failed,
                      ARX_MESSAGES.MESSAGE_TYPE.ERROR
                    )
                  );
                  resolv();
                }
              );
            });
            addressPromise
              .then(res => {
                this._checkout.deliveryOptions().subscribe(response => {
                  if (
                    !response ||
                    (response.messages &&
                      response.messages.length > 0 &&
                      response.messages[0].code === 'WAG_E_ALLIANCE_RX_001') ||
                    (response.checkoutDetails &&
                      response.checkoutDetails.length === 0)
                  ) {
                    if (state.url === ROUTES.checkout_default.absoluteRoute) {
                      sessionStorage.setItem(
                        AppContext.CONST.key_rx_count,
                        '0'
                      );
                      resolve(true);
                      return;
                    } else {
                      sessionStorage.setItem(
                        AppContext.CONST.key_rx_count,
                        '0'
                      );
                      this._common.navigate(
                        ROUTES.checkout_default.absoluteRoute
                      );
                      return false;
                    }
                  }
                  this._checkout.data_deliveryOptions = response;

                  if (response.checkoutDetails !== undefined) {
                    this.assignAddress(response.checkoutDetails);
                    response.checkoutDetails.forEach(() => {
                      this._checkout.isAllPrescriptionValid(
                        response.checkoutDetails[0].prescriptionList
                      );
                      if (!this._checkout.isAllPrescriptionInvalid) {
                        return true;
                      }
                    });
                  }
                  this._checkout.storeCheckoutStateInSession();
                  validateRoute();
                  this.userService.updateCartRxCount();
                });
              })
              .catch(error => {
                this._message.addMessage(
                  new Message(
                    ARX_MESSAGES.ERROR.service_failed,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              });
          } else if (state.url === ROUTES.checkout_sp.absoluteRoute) {
            // await this._checkout.fetchHealthHistoryInfo();
            this._checkout.deliveryOptions().subscribe(async response => {
              this.assignHealthCondition(response);
              if (
                !response ||
                (response.messages &&
                  response.messages.length > 0 &&
                  response.messages[0].code === 'WAG_E_ALLIANCE_RX_001') ||
                (response.checkoutDetails &&
                  response.checkoutDetails.length === 0)
              ) {
                if (state.url === ROUTES.checkout_default.absoluteRoute) {
                  sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
                  resolve(true);
                  return;
                } else {
                  sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
                  this._common.navigate(ROUTES.checkout_default.absoluteRoute);
                  return false;
                }
              }
              this._checkout.data_deliveryOptions = response;
              if (response.checkoutDetails) {
                this.assignAddress(response.checkoutDetails);
                response.checkoutDetails.forEach(() => {
                  this._checkout.isAllPrescriptionValid(
                    response.checkoutDetails[0].prescriptionList
                  );
                  if (!this._checkout.isAllPrescriptionInvalid) {
                    return true;
                  }
                });
              }
              this._checkout.data_deliveryOptions = response;
              this._checkout.storeCheckoutStateInSession();
              validateRoute();
              this.userService.updateCartRxCount();
            });
          } else {
            this._checkout.deliveryOptions().subscribe(response => {
              this.assignHealthCondition(response);

              if (
                !response ||
                (response.messages &&
                  response.messages.length > 0 &&
                  response.messages[0].code === 'WAG_E_ALLIANCE_RX_001') ||
                (response.checkoutDetails &&
                  response.checkoutDetails.length === 0)
              ) {
                if (state.url === ROUTES.checkout_default.absoluteRoute) {
                  sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
                  resolve(true);
                  return;
                } else {
                  sessionStorage.setItem(AppContext.CONST.key_rx_count, '0');
                  this._common.navigate(ROUTES.checkout_default.absoluteRoute);
                  return false;
                }
              }
              this._checkout.data_deliveryOptions = response;
              if (response.checkoutDetails !== undefined) {
                this.assignAddress(response.checkoutDetails);
                response.checkoutDetails.forEach(() => {
                  this._checkout.isAllPrescriptionValid(
                    response.checkoutDetails[0].prescriptionList
                  );
                  if (!this._checkout.isAllPrescriptionInvalid) {
                    return true;
                  }
                });
              }

              this._checkout.storeCheckoutStateInSession();
              validateRoute();
              this.userService.updateCartRxCount();
            });
          }
        } else {
          this._checkout.storeCheckoutStateInSession();
          validateRoute();
        }
      }
    });

    return promise;
  }

  /**
   * Checking if url belongs to other then combo checkout. Returning true if does not.
   *
   * @param url
   */
  handleRoutesForCombo(url: string): boolean {
    let state = false;
    if (
      url !== ROUTES.checkout_sp.absoluteRoute &&
      url !== ROUTES.checkout_sp.children.confirmation.absoluteRoute &&
      url !== ROUTES.checkout_hd.absoluteRoute &&
      url !== ROUTES.checkout_hd.children.confirmation.absoluteRoute &&
      url !== ROUTES.checkout_default.absoluteRoute
    ) {
      state = true;
    }
    return state;
  }

  // added to update address in HD checkout flow

  getSelectedAddress() {
    const getName = JSON.parse(localStorage.getItem('u_info')).basicProfile;
    this.addressesService.homeAddress['firstName'] = getName.firstName || '';
    this.addressesService.homeAddress['lastName'] = getName.lastName || '';

    const addresses = this.addressesService.addresses;
    if (addresses && addresses.length > 0) {
      for (const idx in addresses) {
        if (addresses[idx].preferred || addresses[idx].isPreferred) {
          return addresses[idx];
        }
      }
    }

    return this.addressesService.homeAddress;
  }

  assignAddress(checkoutDetails: any) {
    checkoutDetails.forEach((item, index) => {
      if (item.type === 'SPECIALTY') {
        if (checkoutDetails[index].boxDetails.shippingInfo.srxDeliveryAddr) {
          this._checkout.data_deliveryOptions.checkoutDetails[
            index
          ].boxDetails.shippingInfo.deliveryAddr =
            checkoutDetails[index].boxDetails.shippingInfo.srxDeliveryAddr;
        }
      } else if (item.type === 'HOMEDELIVERY') {
        const reviewAddress = checkoutDetails[index].boxDetails.shippingInfo.deliveryAddr;
        if (
          reviewAddress === undefined || this.emptyAddress(reviewAddress)
        ) {
          this._checkout.data_deliveryOptions.checkoutDetails[
            index
          ].boxDetails.shippingInfo.deliveryAddr = this.getSelectedAddress();
          this._checkout.updateAddressCall(this.getSelectedAddress());
        } else {
          this._checkout.updateAddressCallFromReview(checkoutDetails);
        }
      }
    });
  }

  emptyAddress(address) {
    const emptyAddress = address.streetAddr || address.city || address.state || address.zip;
    return emptyAddress === '';
  }
  assignHealthInfo(checkoutDetails: any, healthHistroy: any) {
    checkoutDetails.forEach((item, index) => {
      if (item.type === 'SPECIALTY') {
        if (
          checkoutDetails[index].healthInfo === undefined &&
          this._checkout.data_deliveryOptions.checkoutDetails[index]
            .healthInfo === undefined
        ) {
          checkoutDetails[index].healthInfo = healthHistroy.healthInfo;
          this._checkout.data_deliveryOptions.checkoutDetails[
            index
          ].healthInfo = checkoutDetails[index].healthInfo;
        }
      }
    });
  }

  assignHealthCondition(response) {
    response.checkoutDetails.forEach(item => {
      const data = {};
      data['flow'] = 'ARX';
      const prom = new Promise(resolv => {
        this._http
          .postData(Microservice.health_history_retrieve, data)
          .subscribe(
            res => {
              resolv(res);
            },
            () => {
              resolv();
            }
          );
      });

      prom.then(res => {
        if (res) {
          this._checkout.fetchHealthHistoryInfoArray(res, response);
        }
      });
    });
  }
}
