export interface Hdtransferrx {
    patient: {
        patientName: string,
        patientPhoneNumber: string,
        patientDOB: string,
        patientAddress: string,
        patientCity: string,
        patientState: string,
        patientZip: string
      };
      pharmacy: {
        pharmacyName: string,
        pharmacyPhoneNumber: string
      };
      prescriptions: [
        {
          prescriptionName: string,
          rxNumber: number
        }
      ];
      type: 'xrx';

}
