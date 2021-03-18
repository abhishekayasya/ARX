import {Component} from '@angular/core';
import {SpecialityService} from '@app/pages/checkout/specialty-checkout/speciality.service';
import {CheckoutService} from '@app/core/services/checkout.service';

@Component({
  selector: 'arxrf-spcheckout-base',
  templateUrl: './sp-base.component.html',
  styleUrls: ['./sp-base.component.scss']
})
export class SpBaseComponent {

  constructor(
    public speciality: SpecialityService,
    public checkout: CheckoutService
  ) {}
}
