import { Component, Output, EventEmitter, Input } from '@angular/core';
import { insuranceSuccess } from './insurance-success.constant';

@Component({
  selector: 'arxrf-insurance-success',
  templateUrl: './insurance-success.component.html',
  styleUrls: ['./insurance-success.component.scss']
})
export class InsuranceSuccessComponent {
  @Output() closeInsuranceBanner = new EventEmitter();
  @Input() display = false;

  get getIconCheck() {
    return '/modules/alliancerx-www-components/javascript/angular/refillHub/assets/images/icons/symbol-defs.svg#icon__check';
  }

  closeBanner() {
    this.closeInsuranceBanner.emit();
  }

  get successBannerMessage() {
    return insuranceSuccess;
  }
}
