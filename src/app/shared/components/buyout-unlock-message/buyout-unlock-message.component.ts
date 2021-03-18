import { Component, Input, OnInit } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';

/**
 * Component to show unlock message with dismiss message for buyout user.
 */

@Component({
  selector: 'arxrf-buyout-message',
  templateUrl: './buyout-unlock-message.component.html',
  styleUrls: ['./buyout-unlock-message.component.scss']
})
export class BuyoutUnlockMessageComponent implements OnInit {
  @Input()
  show: boolean;

  @Input()
  buyoutMessage = 'Ready to bring in your other prescriptions?';

  @Input()
  buyoutMobileMessage: string;

  @Input()
  buyoutDismissMessage: string;

  @Input()
  dismissible: boolean;

  @Input()
  timeout = 3000;

  @Input()
  insuranceStatus: string;

  @Input()
  showPreviousPharmacyButton: boolean = true;

  @Input()
  isBuyoutUser: boolean;

  @Input()
  isBuyoutUnlock: boolean;

  isDismissed: boolean;

  ROUTES = ROUTES;

  showDismissMessage: boolean;

  constructor(
    private _common: CommonUtil
  ) {
  }

  dismiss(): void {
    this.isDismissed = true;
    this.showDismissMessage = true;

    setTimeout(() => {
      this.showDismissMessage = false;
    }, this.timeout);
  }

  goToPreviousPharmacy() {
    const isMailRegistered = this.insuranceStatus === "Yes" || this.insuranceStatus === "Pending";
    if (this.isBuyoutUser) {
      if (isMailRegistered) {
        sessionStorage.setItem("u_pp_flow", "true");
        this._common.navigate(ROUTES.refill.absoluteRoute)
      } else {
        this._common.navigate(ROUTES.buyout.absoluteRoute)
      }
    } else {
      if (isMailRegistered) {
        this._common.navigate(ROUTES.buyout.children.ppp_auth.absoluteRoute);
      } else {
        this._common.navigate(ROUTES.buyout.absoluteRoute)
      }
    }
  }

  ngOnInit(): void {
    // istanbul ignore else
    if (!this.buyoutDismissMessage) {
      this.buyoutDismissMessage = `OK, when you’re ready, your previous pharmacy prescriptions will be waiting. `;
    }
    this.buyoutMobileMessage = this.buyoutMobileMessage ? this.buyoutMobileMessage : this.buyoutMessage;
  }
}
