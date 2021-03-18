import {ShippingAddress} from './shipping-address.model';

export interface EditShippingRequest {
  fId: string;
  prescriptionType: string;
  sort: string;
  deliverySettings: {
    isAddressChanged: boolean;
    selectedLocation: string;

    shippingInfo: {
      zip: string;
      address: ShippingAddress;
      creditCardNumber: string;
      expDate: string
    };
  };

  order: string;

}
