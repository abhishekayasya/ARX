import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { HttpClientService } from "@app/core/services/http.service";
import { AppContext } from "@app/core/services/app-context.service";
import { MessageService } from "@app/core/services/message.service";
import { ARX_MESSAGES, Microservice } from "@app/config";
import { Message } from "@app/models";
import { CheckoutService } from "@app/core/services/checkout.service";
import { CHECKOUT } from "@app/config/checkout.constant";
import { GaService } from "@app/core/services/ga-service";
import { GAEvent } from "@app/models/ga/ga-event";
import { GA } from "@app/config/ga-constants";
import { ROUTES } from "@app/config";
import { UserService } from "@app/core/services/user.service";
import { HomeDeliveryService } from "@app/pages/checkout/home_delivery/home-delivery.service";

@Component({
  selector: "arxrf-order-success",
  templateUrl: "./order-success.component.html",
  styleUrls: ["./order-success.component.scss"]
})
export class OrderSuccessComponent implements OnInit, OnDestroy {
  reviewData;
  shippingMethod;
  submitOrderResponse;
  checkoutDetails: Array<any>;

  noorder: boolean;

  loaderState = true;
  constructor(
    private _http: HttpClientService,
    private _messageService: MessageService,
    public _checkoutService: CheckoutService,
    private _gaService: GaService,
    private _router: Router,
    public userService: UserService,
    public appContext: AppContext,
    public homeDeliveryService: HomeDeliveryService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(false);
      window['ARX_Util'].enableLeanSignout();
    }
    if (sessionStorage.getItem(AppContext.CONST.checkoutComboKey) != null) {
      sessionStorage.removeItem(AppContext.CONST.checkoutComboKey);
    }

    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // redirect to manage prescriptions when back button is clicked
        if (
          ROUTES.checkout_hd.absoluteRoute === event.url ||
          ROUTES.checkout_sp.absoluteRoute === event.url ||
          ROUTES.checkout_combined.absoluteRoute === event.url ||
          ROUTES.home_delivery_refill_reminder.absoluteRoute === event.url ||
          ROUTES.speciality_refill_reminder.absoluteRoute === event.url
        ) {
          this._router.navigateByUrl(ROUTES.refill.absoluteRoute);
        }
      }
    });
  }

  ngOnInit() {
    this.fetchOrderDetails();
    // reseting foresee flags on next page load.
    localStorage.removeItem( 'fs_reset_flag' );
  }

  fetchOrderDetails() {
    this.loaderState = true;
    if (sessionStorage.getItem(AppContext.CONST.hd_rr_orderinfo) !== null) {
      this.handleOrderData(
        JSON.parse(sessionStorage.getItem(AppContext.CONST.hd_rr_orderinfo))
      );
      this.loaderState = false;
    } else {
      this._http
        .postData(Microservice.checkout_confirm, { flowType: "DOTCOM" })
        .subscribe(
          res => {
            this._checkoutService.storeReviewRefresh("false");
            if (!res || !res.adjudicationResponse) {
              this.userService.updateCartRxCount();
              res = this._checkoutService.submitOrderPayload;
              if (res.checkoutDetails) {
                this.handleOrderData(res);
                this.sendGaEvent();
                // tslint:disable-next-line: max-line-length
                if (
                  res.messages && res.messages[0] &&
                  res.messages[0].code === 'WAG_RXCHECKOUT_002' &&
                  res.messages[0].type.toLowerCase() === 'warning'
                ) {
                  this.homeDeliveryService.showbanner = false;
                  this.homeDeliveryService.globalBannerHide.next(true);
                  this._messageService.addMessage(
                    new Message(
                      res.messages[0].message,
                      ARX_MESSAGES.MESSAGE_TYPE.WARN,
                      false,
                      false,
                      true
                    )
                  );
                }
              } else if (res.messages) {
                this.homeDeliveryService.showbanner = true;
                this.homeDeliveryService.globalBannerHide.next(false);
                this._messageService.addMessage(
                  new Message(
                    res.messages[0].message,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              } else {
                this.noorder = true;
              }
            }
            this.loaderState = false;
          },
          () => {
            this.homeDeliveryService.showbanner = true;
            this.homeDeliveryService.globalBannerHide.next(false);
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
            this.loaderState = false;
          }
        );
    }
  }

  handleOrderData(res) {
    this.checkoutDetails = res.checkoutDetails;
    this.calculateShippingDetails();

    if (this._checkoutService.isCombo) {
      this._checkoutService.comboState = CHECKOUT.comboState.confirmation;
    }
    this._checkoutService.resetCheckoutStatus();
    sessionStorage.removeItem(AppContext.CONST.registration_callback_urlkey);
  }

  calculateShippingDetails() {
    const orders = this.checkoutDetails.filter(
      item => item.type === "HOMEDELIVERY"
    );

    if (orders.length > 0) {
      const daysFinal = orders[0].boxDetails.shippingInfo.shippingOptions.filter(
        method =>
          method.value ===
          orders[0].boxDetails.shippingInfo.shippingOptions[0].value
      );

      if (daysFinal.length > 0) {
        this.shippingMethod = daysFinal[0];
      }
    }
  }

  processCreditCardInformation() {
    this.reviewData.deliveryMethod.shippingInfo.creditCardNumber = this.reviewData.deliveryMethod.shippingInfo.creditCardNumber.substring(
      this.reviewData.deliveryMethod.shippingInfo.creditCardNumber.length - 5,
      this.reviewData.deliveryMethod.shippingInfo.creditCardNumber.length
    );
  }

  sendGaEvent() {
    const hdOrder = this.checkoutDetails.find(item => {
      return item.type === CHECKOUT.type.HD;
    });
    const scOrder = this.checkoutDetails.find(item => {
      return item.type === CHECKOUT.type.SC;
    });
    const suOrder = this.checkoutDetails.find(item => {
      return item.type === CHECKOUT.type.SU;
    });

    if (hdOrder && scOrder === undefined && suOrder === undefined) {
      this.sendHDEvent(hdOrder, false);
    } else if (scOrder || (suOrder && hdOrder === undefined)) {
      this.sendSpecialityEvent(scOrder, suOrder, false);
    } else if (hdOrder && (scOrder || suOrder)) {
      this.sendHDEvent(hdOrder, true);
      this.sendSpecialityEvent(scOrder, suOrder, true);
    }
  }

  sendHDEvent(hdOrder, isCombo) {
    try {
      const event = <GAEvent>{};
      event.category = isCombo
        ? GA.categories.checkout_combo
        : GA.categories.checkout_mail;
      event.action = isCombo
        ? GA.actions.checkout_combo.submission_HD
        : GA.actions.checkout_mail.submission;

      const dimensions = {};
      dimensions[GA.dimension.prescription_count] = this.countHDPrescriptions();
      dimensions[GA.dimension.price] = 0.0;

      dimensions[GA.dimension.mail_state] =
        hdOrder.boxDetails.shippingInfo.deliveryAddr.state;

      event.data = dimensions;
      this._gaService.sendEvent(event);
    } catch (e) {
      console.error(e);
    }
  }

  sendSpecialityEvent(scOrder, suOrder, isCombo) {
    try {
      if (scOrder) {
        const event = <GAEvent>{};
        event.category = isCombo
          ? GA.categories.checkout_combo
          : GA.categories.checkout_speciality;
        event.action = isCombo
          ? GA.actions.checkout_combo.submission_cleansed_speciality
          : GA.actions.checkout_speciality.submission_cleansed;

        const dimensions = {};
        dimensions[
          GA.dimension.prescription_count
        ] = this.countCleansedPrescriptions();
        dimensions[GA.dimension.price] = this.checkoutDetails["totalPrice"]
          ? this.checkoutDetails["totalPrice"]
          : 0.0;
        dimensions[GA.dimension.speciality_cleansed_state] =
          scOrder.patient[0].referrals[0].shippingInfo.address.state;
        event.data = dimensions;
        this._gaService.sendEvent(event);
      }

      if (suOrder) {
        const event = <GAEvent>{};
        event.category = isCombo
          ? GA.categories.checkout_combo
          : GA.categories.checkout_speciality;
        event.action = isCombo
          ? GA.actions.checkout_combo.submission_unsolicited_speciality
          : GA.actions.checkout_speciality.submission_unsolicited;

        const dimensions = {};
        dimensions[
          GA.dimension.prescription_count
        ] = this.countUnsolicitedPrescriptions();
        dimensions[GA.dimension.price] = 0.0;
        dimensions[GA.dimension.speciality_unsolicited_state] =
          suOrder.shippingInfo.address.state;

        event.data = dimensions;
        this._gaService.sendEvent(event);
      }
    } catch (e) {
      console.error(e);
    }
  }

  getPrescriptionsCount() {
    let count = 0;
    this.checkoutDetails.forEach(item => {
      if (item["prescriptionType"] === CHECKOUT.type.HD) {
        count = count + item["prescriptions"].length;
      } else if (item["prescriptionType"] === CHECKOUT.type.SU) {
        count = count + item["prescriptions"].length;
      } else if (item["prescriptionType"] === CHECKOUT.type.SC) {
        for (const patient in item["patient"]) {
          if (patient["referrals"]) {
            count = count + patient["referrals"].prescriptions.length;
          }
        }
      }
    });
    return count;
  }

  countCleansedPrescriptions() {
    let count = 0;
    this.checkoutDetails.forEach(item => {
      if (item["prescriptionType"] === CHECKOUT.type.SC) {
        for (const patient in item["patient"]) {
          if (patient["referrals"]) {
            count = count + patient["referrals"].prescriptions.length;
          }
        }
      }
    });
    return count;
  }

  countUnsolicitedPrescriptions() {
    let count = 0;
    this.checkoutDetails.forEach(item => {
      if (item["prescriptionType"] === CHECKOUT.type.SU) {
        count = count + item["prescriptions"].length;
      }
    });
    return count;
  }

  countHDPrescriptions() {
    let count = 0;
    this.checkoutDetails.forEach(item => {
      if (item["prescriptionType"] === CHECKOUT.type.HD) {
        count = count + item["prescriptions"].length;
      }
    });
    return count;
  }

  print() {
    window.print();
  }

  checkwarning(pres) {
    let isWarning = false;
    if (pres && pres.messages) {
      pres.messages.map(item => {
        if (item.message && item.type.toLowerCase() === "warning") {
          isWarning = true;
        }
      });
    }
    return isWarning;
  }

  ngOnDestroy() {
    this.homeDeliveryService.showbanner = true;
    this.homeDeliveryService.globalBannerHide.next(false);
  }
}
