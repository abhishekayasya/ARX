import { Component, Input, OnInit } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';

@Component({
  selector: 'arx-refill-reminder-HD-patient',
  templateUrl: './HD-patient.component.html'
})
export class HDPatientComponent implements OnInit {
  @Input() mailData;
  @Input() disableFormValiation;
  rxorders;
  deliveryMethod;
  customerCare;
  prescriptions;
  boxDetails;
  prescriptionType;

  ngOnInit() {
    this.rxorders = this.mailData.checkoutDetails[0];
    this.boxDetails = this.rxorders.boxDetails;
    this.prescriptionType = CHECKOUT.type.HD;
    if (
      this.boxDetails &&
      this.boxDetails.shippingInfo &&
      this.boxDetails.shippingInfo.shippingOptions.length > 0
    ) {
      this.boxDetails.shippingInfo.shippingOptions.forEach(shippingOption => {
        if (shippingOption.selected === true) {
          this.deliveryMethod = shippingOption.value;
        }
      });
    }
    this.customerCare = this.rxorders.customerCareContact;
    this.prescriptions = this.rxorders.prescriptionList;
  }
}
