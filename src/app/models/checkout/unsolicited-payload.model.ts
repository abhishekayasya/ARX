import {OrderPayloadInterface} from '@app/models/checkout/order-payload-interface';

/**
 * Object model for unsolicited checkout payload.
 */
export interface UnsolicitedPayloadModel extends OrderPayloadInterface {

  localSpecialty: boolean;
  needDate: string;
  prescriptions: Array<any>;
  faxDetails: any;
  customercare: '(888) 347-3416';
  shippingInfo: any;
  submittedToMsgQueue: boolean;

}
