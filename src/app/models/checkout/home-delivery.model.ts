import {OrderPayloadInterface} from '@app/models/checkout/order-payload-interface';
import {CHECKOUT} from '@app/config/checkout.constant';

export class HomeDeliveryModel implements OrderPayloadInterface {

  customercare: string;
  deliveryMethod: any;
  prescriptions: Array<any>;
  prescriptionType: string = CHECKOUT.type.HD;

  checkoutDetails: any;
  prescriptionList: Array<any>;
  boxDetails: any;

}
