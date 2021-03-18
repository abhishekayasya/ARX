import {OrderPayloadInterface} from '@app/models/checkout/order-payload-interface';

export interface CheckoutOrderModel {

  submitted: true;
  allianceOrder: true;
  checkoutDetails: Array <any>;
  rxorders: {
    orderdetails: Array <OrderPayloadInterface>;
  };
}
