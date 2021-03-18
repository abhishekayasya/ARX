/**
 * Object structure for user input data for speciality review page.
 *
 */
export interface SpecialityContext {
  unDeliveryDate: string;
  unDeliveryDateBak: string;
  unAddress: {
    street1: string;
    city: string;
    state: string;
    zipCode: string;
    zipCodeOptional: string;
    reasonForNewAddress: string;
  };

  patient: Array<{
    clDeliveryDate: string;
    payBy: string;
    dueNow: Array<any>;
    id: string;
  }>;

  healthInfo: Array<{
    id: string,
    healthInfo: {
      nodrugAllergies: boolean;
      nohealthConditions: boolean;
      noadditionalMedication: boolean;
    };
  }>;

  clinical_review: Array<{
    id: string,
    clinical_review: {
      sideeffects: '',
      pharmacistcontact: '',
      assistance: ''
    },
    callMeReasons: {}
  }>;
}
