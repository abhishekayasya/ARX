export interface PatientModel {
  profileId: string;
  editable: boolean;
  scriptMedId: string;
  termsAndConditions: boolean;
  referrals: Array<any>;
  add_update_svc_status: boolean;
  healthInfoChecked: boolean;
  healthInfo: {
    additionalMedication: Array<any>;
    drugAllergies: Array<any>;
    healthConditions: Array<any>;
  };
  clinical_review: any;
  callMeReasons: any;
  selectedAddress: any;
  noadditionalMedication: boolean;
  nodrugAllergies: boolean;
  nohealthConditions: boolean;
}
