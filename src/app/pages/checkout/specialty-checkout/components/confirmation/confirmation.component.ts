import { Component } from '@angular/core';
import { SpecialityService } from '@app/pages/checkout/specialty-checkout/speciality.service';

@Component({
  selector: 'arxrf-speciality-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class SpecialityConfirmOrder {
  constructor(speciality: SpecialityService) {
    speciality.hideHead = true;
  }
}
