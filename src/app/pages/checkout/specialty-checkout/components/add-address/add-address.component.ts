import { Component } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';

@Component({
  selector: 'arxrf-speciality-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  CHECKOUT = CHECKOUT;

  constructor() {}
}
