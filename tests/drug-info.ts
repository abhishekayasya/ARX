import { Prescriptions } from '@app/models';
const data = {
  prescriptionId: '689321916287',
  viewId: 'HISTORY_MULTILINE_VIEW_98757276',
  rxNumber: '162876893219',
  doctorAuthRequired: false,
  prescriptionType: 'specialty',
  displayInfo: {
    expanded: false,
    hidden: false,
    undoHide: false,
    undoShow: false,
    allowHide: true,
    selected: false
  },
  drugInfo: {
    drugId: '2265399',
    drugName: 'Baclofen 10mg Tablets',
    drugImageURL: '/images/IN1827/default_image_small.jpg',
    compoundDrug: false,
    drugNDCProd: '4096',
    drugNDCMfg: '00172',
    immunization: false
  },
  refillInfo: {
    expiryDate: '07/16/2020',
    lastFillDate: '08/23/2019',
    nextFillDate: '08/24/2019',
    quantity: '10',
    refillDue: true,
    refillType: 'REF',
    refillable: true,
    refillsLeft: '4',
    refillsMessage: '&lt;b&gt;4&lt;/b&gt; until \n07/16/2020'
  },
  autoRefillInfo: { autoRefillEligible: false, autoRefillEnabled: false },
  store: { isDivested: 'false', storeId: '16287' },
  statusPrice: {
    status: 'Refill due',
    price: '50.00',
    priceLabel: 'Estimated Price:',
    priceType: 'estimatedprice'
  },
  doctorManaged: false,
  showStatusLink: false,
  historyMoreRefills: false
};
const masterData: Prescriptions = {
  totalPrescriptionsInCart: 10,
  hasPreviousProvider: false,
  isRiteAidUser: false,
  totalPrescriptions: 20,
  hasHiddenRx: 'test',
  isPrimeUser: false,
  totalRefillDue: 2,
  overlayType: 'string',
  totalRetailPrescriptionsInCart: 90,
  prescriptions: [
    {
      prescriptionId: 689321716287,
      viewId: 'HISTORY_MULTILINE_VIEW_65938107',
      rxNumber: 162876893217,
      doctorAuthRequired: false,
      prescriptionType: 'specialty',
      displayInfo: {
        expanded: false,
        hidden: false,
        undoHide: false,
        undoShow: false,
        allowHide: true,
        selected: false
      },
      drugInfo: {
        drugId: 2243299,
        drugName: 'Kaletra 200-50mg Tablets',
        drugImageURL: '/images/IN1827/default_image_small.jpg',
        compoundDrug: false
        //immunization: false
      },
      additionalAutoRefillInfo: {
        billingInfo: {
          expiryDate: 'test',
          zipCode: 'test',
          creditCardNumber: 'test'
        },
        autoRefills: {
          count: 1,
          prescriptions: [1, 2, 3],
          prescriptionType: 'test'
        },
        deliverySettings: {
          isAddressChanged: true,
          isStoreChanged: true,
          selectedLocation: 'test',
          shippingInfo: {
            address: {
              city: 'test',
              state: 'test',
              zip: 'test',
              street1: 'test'
            },
            creditCardNumber: 'test',
            expDate: 'test',
            zip: 'test'
          }
        },
        filter: {
          order: 'test',
          sort: 'test'
        },
        userCCEditPrivilege: 'test'
      },
      refillInfo: {
        expiryDate: '07/16/2020',
        lastFillDate: '08/23/2019',
        nextFillDate: '08/24/2019',
        quantity: 10,
        refillDue: true,
        refillType: 'REF',
        refillable: true,
        refillsLeft: '4',
        refillsMessage: '&lt;b&gt;4&lt;/b&gt; until \n07/16/2020'
      },
      autoRefillInfo: { autoRefillEligible: false, autoRefillEnabled: false },
      store: { isDivested: false, storeId: 16287, phoneNumber: 9347549357 },
      statusPrice: {
        status: 'Refill due',
        price: '50.00',
        priceLabel: 'Estimated Price:',
        priceType: 'estimatedprice'
      },
      doctorManaged: false,
      showStatusLink: false,
      history: [
        {
          fillDate: '08/23/2019',
          statusPrice: { status: 'RefillDue', quantity: '10', insurance: 'N/A' }
        },
        { fillDate: '07/16/2019', statusPrice: { quantity: '10' } },
        { fillDate: '08/23/2019', statusPrice: { quantity: '10' } }
      ]
    }
  ]
};
export { masterData, data };
