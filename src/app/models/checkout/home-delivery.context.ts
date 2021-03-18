/**
 * context for home delivery object to store in session storage, to persist
 * checkout home delivery related user selections
 */
export interface HomeDeliveryContext {
  selectedShipping: string;
  ccInfo: {
    ccNumber: string;
    expDate: string;
    zipCode: string;
    saveAsExpress: string;
  };
  isCardUpdated: boolean;
  cardType: string;
}
