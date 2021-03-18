import { Component } from '@angular/core';
import { CHECKOUT } from 'app/config/checkout.constant';

@Component({
  selector: 'arxrf-homdelivery-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent {
  CHECKOUT = CHECKOUT;

  constructor() {}
}
