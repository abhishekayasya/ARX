import { Component } from '@angular/core';
import { HomeDeliveryService } from '@app/pages/checkout/home_delivery/home-delivery.service';

@Component({
  selector: 'arxrf-homdelivery-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class HomeDeliveryConfirmationComponent {
  constructor(hdService: HomeDeliveryService) {
    hdService.hideHead = true;
  }
}
