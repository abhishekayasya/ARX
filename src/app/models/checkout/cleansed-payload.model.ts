import {OrderPayloadInterface} from '@app/models/checkout/order-payload-interface';

export interface CleansedPayloadModel extends OrderPayloadInterface {

  localSpecialty: boolean;
  patient: Array<any>;
  submittedToMsgQueue: boolean;
  customercare: string;
  adminFirstName: string;

}
