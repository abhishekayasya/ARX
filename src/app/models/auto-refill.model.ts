import { BillingInfo } from './billing-info.model';
// import {ShippingAddress} from "./shipping-address.model";

export interface AutoRefill {
  // ================================
  // editPrivilege: boolean;
  // prescriptionType: string;

  // autoRefillInfo:{
  //   autoRefillEnabled: boolean;
  //   autoRefillDate: string;
  // };

  // viewId: string,
  // lastFilledLocation: boolean,
  // shippingInfo: ShippingAddress;

  // refillInfo:{
  //   refillsLeft: number;
  // };

  // drugInfo: {
  //   drugName: string;
  //   compoundDrug: boolean;
  // };
  // ================================
  billingInfo: BillingInfo;
  autoRefills: AutofillsModel;
  deliverySettings: AutoRefillDeliveryModel;
  filter: AutoRefillFilterModel;
  userCCEditPrivilege: string;
}

export interface AutofillsModel {
  count: number;
  prescriptions: Array<any>;
  prescriptionType: string;
}

export interface AutoRefillDeliveryModel {
  isAddressChanged: boolean;
  isStoreChanged: boolean;
  selectedLocation: string;
  shippingInfo: ShippingInfoModel;
}

export interface AutoRefillFilterModel {
  order: string;
  sort: string;
}

export interface ShippingInfoModel {
  address: ShippingAddress;
  creditCardNumber: string;
  expDate: string;
  zip: string;
}

export interface ShippingAddress {
  city: string;
  state: string;
  zip: string;
  street1: string;
}

export interface PrecriptionInnerInfo {
  autoRefillInfo: AutoRefillInfoModel;
  drugInfo: DrugInfoModel;
  prescriber: string;
  qty: string;
  refillInfo: RefillInfoModel;
  rxNumber: string;
}

export interface AutoRefillInfoModel {
  autoRefillEligible: string;
  autoRefillEnabled: string;
}

export interface DrugInfoModel {
  compoundDrug: boolean;
  drugClass: string;
  drugId: string;
  drugImageURL: string;
  drugName: string;
  immunization: boolean;
}

export interface RefillInfoModel {
  lastFillDate: string;
  refillsLeft: string;
}
