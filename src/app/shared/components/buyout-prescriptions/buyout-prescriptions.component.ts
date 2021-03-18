import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES } from '@app/config';
import { buyoutUser } from './buyout-prescriptions.constants';

@Component({
  selector: 'arxrf-buyout-prescription',
  templateUrl: './buyout-prescriptions.component.html',
  styleUrls: ['./buyout-prescriptions.component.scss']
})
export class BuyoutPrescriptionsComponent {
  @Output() closeBuyoutBanner = new EventEmitter();
  @Input() display = false;

  insuranceStatus: string;

  get getIconInfo() {
    return '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/icons/symbol-defs.svg#icon__info';
  }

  get getIconrightArrow() {
    return '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/icons/symbol-defs.svg#icon__arrow-right';
  }

  closeBanner() {
    this.closeBuyoutBanner.emit();
  }

  constructor(private _commonUtil: CommonUtil) {
    if (localStorage.getItem('insuranceOnData')) {
      this.insuranceStatus = localStorage.getItem('insuranceOnData');
    }
  }

  accessPrescription() {
    if (this.insuranceStatus === 'No') {
      this._commonUtil.navigate(ROUTES.buyout.route);
    } else  {
      sessionStorage.setItem("u_pp_flow", "true");
      this._commonUtil.navigate(ROUTES.refill.route);
    }
  }

  get buyoutBannerMessage() {
    return buyoutUser;
  }
}
