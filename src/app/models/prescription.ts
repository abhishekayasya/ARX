import { AutoRefill } from './auto-refill.model';
import { DrugInfoModel } from './drug-info.model';

export interface Prescription {
  prescriber?: string;
  prescriptionType?: string;
  rxNumber: number;
  doctorManaged: boolean;
  showStatusLink: boolean;
  prescriptionId: number;
  store: {
    isDivested: boolean;
    phoneNumber: number;
    storeId: number;
  };
  autoRefillInfo: {
    autoRefillEligible: boolean;
    autoRefillEnabled: boolean;
  };
  viewId: string;
  displayInfo: {
    expanded: boolean;
    hidden: boolean;
    allowHide: boolean;
    undoHide: boolean;
    selected: boolean;
    undoShow: boolean;
  };
  doctorAuthRequired: boolean;
  refillInfo: {
    expiryDate: string;
    lastFillDate: string;
    refillsLeft: string;
    refillDue: boolean;
    quantity: number;
    refillable: boolean;
    refillsMessage: string;
    nextFillDate: string;
    refillType: string;
  };
  drugInfo: {
    drugImageURL: string;
    drugName: string;
    drugId: number;
    compoundDrug: boolean;
  };

  additionalAutoRefillInfo?: AutoRefill;
  history: any;

  showAddressInfo?: boolean;
  showAddressInfoLoader?: boolean;

  folderMoved?: boolean;

  additionalDrugInfo?: DrugInfoModel;

  showAutoRefillError?: boolean;

  disabled?: boolean;
  instructions?: string;
  fillDetails?: Array<any>;
  statusPrice?: any;
  pharmacy?: string;
  isPrime?: boolean;
  userId?: string;
}
