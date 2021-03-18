import { Prescription } from '@app/models';

export interface Prescriptions {
  filter?: {};

  totalPrescriptionsInCart?: number;
  hasPreviousProvider?: boolean;
  isRiteAidUser?: boolean;
  totalPrescriptions?: number;
  hasHiddenRx?: string;
  isPrimeUser?: boolean;
  totalRefillDue?: number;
  overlayType?: string;
  totalRetailPrescriptionsInCart?: number;

  prescriptions?: Array<Prescription>;

  pageFilter?: {
    prescriber: Array<{
      count: number;
      name: string;
    }>[];

    rxType: Array<{
      count: number;
      name: string;
    }>[];
  };
}
