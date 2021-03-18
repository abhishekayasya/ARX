import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ROUTES } from "@app/config";
import { CommonUtil } from "@app/core/services/common-util.service";
import { HttpClientService } from "@app/core/services/http.service";
import { UserService } from "@app/core/services/user.service";
import { AppContext } from "@app/core/services/app-context.service";
import { BuyoutService } from "@app/core/services/buyout.service";
import { ARX_MESSAGES } from "@app/config/messages.constant";

import { GA } from "@app/config/ga-constants";
import { GAEvent } from "@app/models/ga/ga-event";
import { GaService } from "@app/core/services/ga-service";
import {RefillBaseService} from "@app/core/services/refill-base.service";
import { KEYS } from "@app/config/store.constants";

@Component({
  selector: "arxrf-account-refillinfo",
  templateUrl: "./refill-info.component.html",
  styleUrls: ["./refill-info.component.scss"]
})
export class RefillInfoComponent implements OnInit {
  loaderState = false;

  displayName = "anonymous";

  // prescriptionsDue: number = 0;
  activeMember: string;
  insuranceSuccessMessage = false;
  harmonyRedirectSuccessMessage;
  isMobile: string;
  @Output()
  memberSwitch = new EventEmitter<string>();
  @Output()
  insuranceStatusOnMemberSelect = new EventEmitter<string>();

  @Input()
  insuranceStatus: string;

  hideInsuranceMessage = false;
  hidelegacyMessage = true;

  ROUTES = ROUTES;

  showBuyoutBanner = false;

  constructor(
    private _common: CommonUtil,
    private _http: HttpClientService,
    public userService: UserService,
    public appContext: AppContext,
    private _router: Router,
    private _buyout: BuyoutService,
    private _gaService: GaService,
    public refillService: RefillBaseService,

  ) {
    //Mobile device detection to show banner msg
    this.isMobile = localStorage.getItem("isMobile");
    this.displayName = this.userService.user.profile.basicProfile.firstName;
    this.refillService.buyoutBannerStatus = false;
    this.refillService.showBuyoutBanner = false;

    if (sessionStorage.getItem(AppContext.CONST.memberActiveKey) == null) {
      this.activeMember = this.userService.user.id;
    } else {
      this.activeMember = JSON.parse(
        sessionStorage.getItem(AppContext.CONST.memberActiveKey)
      ).active;
    }
  }

  fireRefillPresAndCheckStatusGAEvent(url) {
    if (url === ROUTES.refill.absoluteRoute) {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.refill_prescriptions_btn)
      );
    } else {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.check_status_btn)
      );
    }
  }

  goto(url: string) {
    this.fireRefillPresAndCheckStatusGAEvent(url);
    this._common.navigate(url);
  }

  ngOnInit(): void {
    // this.getPrescriptionsInfo();
    this.checkoutBuyoutUser(this.userService.getActiveMemberId());
    // check if insurance success msg exists
    this.showInsuranceSuccessMessage();
    this.showHarmonyRedirectSuccessMessage();
  }

  showInsuranceSuccessMessage() {
    if (sessionStorage.getItem( KEYS.insurance_success_flag )) {
      this.insuranceSuccessMessage = true;
      sessionStorage.removeItem( KEYS.insurance_success_flag );
    }
  }

  showHarmonyRedirectSuccessMessage() {
    if (sessionStorage.getItem(KEYS.harmony_success_flag)) {
      this.harmonyRedirectSuccessMessage = true;
      sessionStorage.removeItem(KEYS.harmony_success_flag);
    }
  }

  // getPrescriptionsInfo() {
  //   this.loaderState = true;
  //   let url = `/svc/profiles/${this.activeMember}/prescriptions/search`;

  //   this._http.postData(
  //     url,
  //     {
  //       "hidden": false,
  //       "pageFilter": {
  //         "prescriber": [],
  //         "rxType": []
  //       }
  //     }
  //   ).subscribe(
  //     (response) => {
  //       this.loaderState = false;
  //       if ( response.messages == undefined ) {
  //         this.prescriptionsDue = response.totalRefillDue;
  //       }
  //     },
  //     (error) => {
  //       this.loaderState = false;
  //     }
  //   );
  // }

  updateMember(event) {
    this.fireChangeActiveMemberGAEvent(event);
    this.activeMember = event;
    // this.getPrescriptionsInfo();
    if (event !== "addMember") {
      // If event is addMember; we shouldn't make any backend call.
      if (this.activeMember === this.userService.user.id) {
        this.checkoutBuyoutUser(this.activeMember);
      } else {
        if (!this.appContext.arxBuyoutMessageForMember) {
          this.checkoutBuyoutUser(this.activeMember);
        }
      }
      this.memberSwitch.emit(event);
      // getInsuranceStatus
      this.insuranceStatusOnMemberSelect.emit();
    }
  }

  checkoutBuyoutUser(userid): void {
    if (userid) {
      this._buyout.available(userid).subscribe(
        response => {
          this.refillService.isBuyoutUnlock = response.isBuyoutUnlock;
          this.refillService.isBuyoutUser = response.isBuyoutUser || (response.arxMap && response.arxMap.isBUYOUTUser);
          this.refillService.showBuyoutBanner = this.refillService.isBuyoutUnlock || this.refillService.isBuyoutUser;
          if (this.refillService.showBuyoutBanner && !this.refillService.buyoutData) {
            this.refillService.getPreviousPrescriptions();
          }
          sessionStorage.setItem('isBuyoutUser', this.refillService.isBuyoutUser.toString());
          sessionStorage.setItem('isBuyoutUnlock', this.refillService.isBuyoutUnlock.toString());
        },

        error => {
          // doing nothing in case of error.
        }
      );
    }
  }

  /**
   * preparing to send user to insurance page under my account.
   */
  redirectForInsuranceUpdate(): void {
    sessionStorage.setItem("insurance_enroll_flow_account", "true");
    this._common.navigate(ROUTES.account_insurance.absoluteRoute);
  }

  closeInsuMsg() {
    this.insuranceSuccessMessage = false;
  }

  closeHrmyMsg() {
    this.harmonyRedirectSuccessMessage = false;
  }
  // this._gaService.sendEvent(this.gaEvent(GA.actions.my_account.check_

  fireChangeActiveMemberGAEvent(activeMember) {
    if (activeMember === "addMember") {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.add_active_family_member)
      );
    } else {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.my_account.change_active_family_member)
      );
    }
  }

  gaEvent(action, label = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.my_account;
    event.action = action;
    event.label = label;
    return event;
  }

  updateCookie(event) {
    if (event === "hidelegacyBanner") {
      this.userService.updateCookie(event);
    }
  }
}
