const checkoutData = {
  checkoutDetails: [
    {
      header: 'UNSOLICITED',
      customerCareContact: '(888) 347-3416',
      type: 'SPECIALTY',
      subType: 'UNSOLICITED',
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      boxDetails: {
        shippingInfo: {
          localSpecialtyInd: false,
          availableDates: [
            '12/12/2019 Thursday',
            '12/13/2019 Friday',
            '12/16/2019 Monday',
            '12/17/2019 Tuesday',
            '12/18/2019 Wednesday',
            '12/19/2019 Thursday',
            '12/20/2019 Friday'
          ],
          srxDeliveryAddr: [
            {
              street1: 'THYAGA STREENULL',
              city: 'FRISCO',
              state: 'TX',
              zip: '75033',
              firstName: 'DIGICATWSVN',
              lastName: 'DIGICATWSVN',
              preferred: false,
              addressId: '6460352',
              type: 'CENT',
              addressAvailable: false,
              addedAddress: false,
              referralAddress: false,
              defaultAddress: false
            },
            {
              street1: 'THYAGA STREE',
              city: 'FRISCO',
              state: 'TX',
              zip: '75033',
              firstName: 'DIGICATWSVN',
              lastName: 'DIGICATWSVN',
              preferred: true,
              addressId: '6458867',
              type: 'HOME',
              addressAvailable: false,
              addedAddress: false,
              referralAddress: false,
              defaultAddress: true
            }
          ]
        }
      },
      prescriptionList: [
        {
          id: '196b3c82-8a4a-473e-8575-1b672ab371be',
          rxNumber: '162877081562',
          refrigerated: false,
          patientName: 'DIGICATWSVN DIGICATWSVN',
          drugImageURL: '/images/IN1827/default_image_small.jpg',
          type: 'SPECIALTYUNSOLICITED',
          rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
          insuranceAvailable: true,
          dueNow: 0,
          qty: '5',
          drugName: 'Complera Tab',
          isValidRx: 'true',
          fillNow: false,
          ninetyDayInd: false,
          autoRefillEnabled: false,
          autoRefillEligible: false,
          admin: true,
          meId: '11950421941',
          cashPrice: '0',
          ninetyDay: false
        }
      ],
      scriptMedId: '3660375',
      emailSent: 0,
      flow: 'ARX',
      autoRefillBanner: false,
      signatureRequired: false
    }
  ],
  healthInfo: {
    additionalMeds: 'xxx',
    healthConditions: 'yyy',
    drugAllergies: 'zzz'
  }
};
const checkoutData1 = {
  checkoutDetails: [
    {
      header: 'UNSOLICITED',
      customerCareContact: '(888) 347-3416',
      type: 'SPECIALTY',
      subType: 'CLEANSED',
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      boxDetails: {
        shippingInfo: {
          localSpecialtyInd: false,
          availableDates: [
            '12/12/2019 Thursday',
            '12/13/2019 Friday',
            '12/16/2019 Monday',
            '12/17/2019 Tuesday',
            '12/18/2019 Wednesday',
            '12/19/2019 Thursday',
            '12/20/2019 Friday'
          ],
          srxDeliveryAddr: [
            {
              street1: 'THYAGA STREENULL',
              city: 'FRISCO',
              state: 'TX',
              zip: '75033',
              firstName: 'DIGICATWSVN',
              lastName: 'DIGICATWSVN',
              preferred: false,
              addressId: '6460352',
              type: 'CENT',
              addressAvailable: false,
              addedAddress: false,
              referralAddress: false,
              defaultAddress: false
            },
            {
              street1: 'THYAGA STREE',
              city: 'FRISCO',
              state: 'TX',
              zip: '75033',
              firstName: 'DIGICATWSVN',
              lastName: 'DIGICATWSVN',
              preferred: true,
              addressId: '6458867',
              type: 'HOME',
              addressAvailable: false,
              addedAddress: false,
              referralAddress: false,
              defaultAddress: true
            }
          ]
        }
      },
      prescriptionList: [
        {
          id: '196b3c82-8a4a-473e-8575-1b672ab371be',
          rxNumber: '162877081562',
          refrigerated: false,
          patientName: 'DIGICATWSVN DIGICATWSVN',
          drugImageURL: '/images/IN1827/default_image_small.jpg',
          type: 'SPECIALTYUNSOLICITED',
          rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
          insuranceAvailable: true,
          dueNow: 0,
          qty: '5',
          drugName: 'Complera Tab',
          isValidRx: 'true',
          fillNow: false,
          ninetyDayInd: false,
          autoRefillEnabled: false,
          autoRefillEligible: false,
          admin: true,
          meId: '11950421941',
          cashPrice: '0',
          ninetyDay: false
        }
      ],
      scriptMedId: '3660375',
      emailSent: 0,
      flow: 'ARX',
      autoRefillBanner: false,
      signatureRequired: false
    }
  ],
  healthInfo: {
    additionalMeds: 'xxx',
    healthConditions: 'yyy',
    drugAllergies: 'zzz'
  }
};
const checkoutMessage = {
  messages: ['xxxx', 'yyyy']
};
const unsoliciteData = {
  boxDetails: {
    shippingInfo: {
      selectedAddress: 'xxx',
      addressForm: 'xxx',
      selectedDate: 'xxx',
      localSpecialtyInd: false,
      availableDates: [
        '12/12/2019 Thursday',
        '12/13/2019 Friday',
        '12/16/2019 Monday',
        '12/17/2019 Tuesday',
        '12/18/2019 Wednesday',
        '12/19/2019 Thursday',
        '12/20/2019 Friday'
      ]
    }
  },
  prescriptionList: [
    {
      id: '196b3c82-8a4a-473e-8575-1b672ab371be',
      rxNumber: '162877081562',
      refrigerated: false,
      patientName: 'DIGICATWSVN DIGICATWSVN',
      drugImageURL: '/images/IN1827/default_image_small.jpg',
      type: 'SPECIALTYUNSOLICITED',
      rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
      insuranceAvailable: true,
      dueNow: 0,
      qty: '5',
      drugName: 'Complera Tab',
      isValidRx: 'true',
      fillNow: false,
      ninetyDayInd: false,
      autoRefillEnabled: false,
      autoRefillEligible: false,
      admin: true,
      meId: '11950421941',
      cashPrice: '0',
      ninetyDay: false
    }
  ]
};
const unsoliciteData1 = {
  boxDetails: {
    shippingInfo: {
      selectedAddress: 'xxx',
      addressForm: 'xxx',
      selectedDate: 'xxx',
      localSpecialtyInd: false,
      availableDates: [
        '12/12/2019 Thursday',
        '12/13/2019 Friday',
        '12/16/2019 Monday',
        '12/17/2019 Tuesday',
        '12/18/2019 Wednesday',
        '12/19/2019 Thursday',
        '12/20/2019 Friday'
      ]
    }
  },
  prescriptionList: [
    {
      id: '196b3c82-8a4a-473e-8575-1b672ab371aa',
      rxNumber: '162877081562',
      refrigerated: false,
      patientName: 'DIGICATWSVN DIGICATWSVN',
      drugImageURL: '/images/IN1827/default_image_small.jpg',
      type: 'SPECIALTYUNSOLICITED',
      rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
      insuranceAvailable: true,
      dueNow: 0,
      qty: '5',
      drugName: 'Complera Tab',
      isValidRx: 'true',
      fillNow: false,
      ninetyDayInd: false,
      autoRefillEnabled: false,
      autoRefillEligible: false,
      admin: true,
      meId: '11950421941',
      cashPrice: '0',
      ninetyDay: false
    },
    {
      id: '196b3c82-8a4a-473e-8575-1b672ab371aa',
      rxNumber: '162877081562',
      refrigerated: false,
      patientName: 'DIGICATWSVN DIGICATWSVN',
      drugImageURL: '/images/IN1827/default_image_small.jpg',
      type: 'SPECIALTYUNSOLICITED',
      rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
      insuranceAvailable: true,
      dueNow: 0,
      qty: '5',
      drugName: 'Complera Tab',
      isValidRx: 'true',
      fillNow: false,
      ninetyDayInd: false,
      autoRefillEnabled: false,
      autoRefillEligible: false,
      admin: true,
      meId: '11950421941',
      cashPrice: '0',
      ninetyDay: false
    }
  ]
};
const unsoliciteData2 = {
  boxDetails: {
    shippingInfo: {
      selectedAddress: undefined,
      addressForm: undefined,
      selectedDate: undefined,
      localSpecialtyInd: false,
      availableDates: [
        '12/12/2019 Thursday',
        '12/13/2019 Friday',
        '12/16/2019 Monday',
        '12/17/2019 Tuesday',
        '12/18/2019 Wednesday',
        '12/19/2019 Thursday',
        '12/20/2019 Friday'
      ]
    }
  }
};
const cleancePatient = [
  {
    scriptMedId: 123,
    referrals: ['1', '2'],
    meId: '22',
    healthInfo: {
      additionalMeds: 'xxx',
      healthConditions: 'yyy',
      drugAllergies: 'zzz'
    }
  }
];
const tokenData = {
  tokenDetails: [
    {
      transactionId: '1111'
    }
  ]
};
const tokenData1 = {
  tokenDetails: [
    {
      xxx: '1111'
    }
  ]
};
const orderData = {
  checkoutDetails: [
    {
      header: 'UNSOLICITED',
      customerCareContact: '(888) 347-3416',
      type: 'HOMEDELIVERY',
      subType: 'UNSOLICITED',
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      scriptMedId: '3660375',
      emailSent: 0,
      flow: 'ARX',
      autoRefillBanner: false,
      signatureRequired: false,
      submittedToMsgQueue: 'xxx',
      customercare: 'xxx',
      prescriptionType: 'specialtyCleansed',
      patient: [
        {
          referrals: [
            {
              scriptMedId: '3660375',
              referralId: '3660375',
              boxDetails: {
                shippingInfo: {
                  creditCard: [
                    {
                      transactionId: '1111',
                      isSelected: true,
                      paymentMethodId: '1111',
                      dueNow: '1111'
                    }
                  ],
                  selectedAddress: 'xxx',
                  addressForm: 'xxx',
                  selectedDate: '12/12/2019 Thursday',
                  localSpecialtyInd: false,
                  availableDates: [
                    '12/12/2019 Thursday',
                    '12/13/2019 Friday',
                    '12/16/2019 Monday',
                    '12/17/2019 Tuesday',
                    '12/18/2019 Wednesday',
                    '12/19/2019 Thursday',
                    '12/20/2019 Friday'
                  ]
                }
              },
              callMeReasons: {
                prefDelDtNotAvailable: 11,
                sideEffects: 'true',
                pharmCounsilQtn: 'true',
                insuranceBillQtn: 'xxx',
                newInsurance: 'xxx',
                prescNotVisible: 'xxx',
                prscQty: 'xxx',
                prescChange: 'xxx',
                reqDiffPresc: 'xxx',
                notes: 'xxx',
                other: 'xxx'
              },
              clinical_review: {
                sideeffects: 'yes',
                pharmacistcontact: 'yes'
              },
              prescriptionList: [
                {
                  id: '196b3c82-8a4a-473e-8575-1b672ab371be',
                  rxNumber: '162877081562',
                  refrigerated: false,
                  patientName: 'DIGICATWSVN DIGICATWSVN',
                  drugImageURL: '/images/IN1827/default_image_small.jpg',
                  type: 'SPECIALTYUNSOLICITED',
                  rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
                  insuranceAvailable: true,
                  dueNow: 0,
                  qty: '5',
                  drugName: 'Complera Tab',
                  isValidRx: 'true',
                  fillNow: false,
                  ninetyDayInd: false,
                  autoRefillEnabled: false,
                  autoRefillEligible: false,
                  admin: true,
                  meId: '11950421941',
                  cashPrice: '0',
                  ninetyDay: false,
                  requestToRemove: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
const orderData1 = {
  checkoutDetails: [
    {
      header: 'UNSOLICITED',
      customerCareContact: '(888) 347-3416',
      type: 'HOMEDELIVERY',
      subType: 'UNSOLICITED',
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      scriptMedId: '3660375',
      emailSent: 0,
      flow: 'ARX',
      autoRefillBanner: false,
      signatureRequired: false,
      submittedToMsgQueue: 'xxx',
      customercare: 'xxx',
      boxDetails: {
        shippingInfo: {
          creditCard: {
            transactionId: '1111',
            saveAsExpressPay: 'xxx'
          },
          selectedAddress: 'undefined',
          addressForm: 'undefined',
          selectedDate: 'undefined',
          selectedShippingOption: 'false',
          availableDates: [
            '12/12/2019 Thursday',
            '12/13/2019 Friday',
            '12/16/2019 Monday',
            '12/17/2019 Tuesday',
            '12/18/2019 Wednesday',
            '12/19/2019 Thursday',
            '12/20/2019 Friday'
          ]
        }
      }
    }
  ]
};
const orderData2 = {
  checkoutDetails: [
    {
      header: 'UNSOLICITED',
      customerCareContact: '(888) 347-3416',
      type: 'HOMEDELIVERY',
      subType: 'CLEANSED',
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      scriptMedId: '3660375',
      emailSent: 0,
      flow: 'ARX',
      autoRefillBanner: false,
      signatureRequired: false,
      submittedToMsgQueue: 'xxx',
      customercare: 'xxx',
      prescriptionType: 'specialtyCleansed',
      referrals: [
        {
          scriptMedId: '3660375',
          referralId: '3660375',
          boxDetails: {
            shippingInfo: {
              creditCard: [
                {
                  transactionId: '1111',
                  isSelected: true,
                  paymentMethodId: '1111',
                  dueNow: '1111'
                }
              ],
              selectedAddress: 'xxx',
              addressForm: 'xxx',
              selectedDate: '12/12/2019 Thursday',
              localSpecialtyInd: false,
              availableDates: [
                '12/12/2019 Thursday',
                '12/13/2019 Friday',
                '12/16/2019 Monday',
                '12/17/2019 Tuesday',
                '12/18/2019 Wednesday',
                '12/19/2019 Thursday',
                '12/20/2019 Friday'
              ]
            }
          },
          callMeReasons: {
            prefDelDtNotAvailable: 11,
            sideEffects: 'true',
            pharmCounsilQtn: 'true',
            insuranceBillQtn: 'xxx',
            newInsurance: 'xxx',
            prescNotVisible: 'xxx',
            prscQty: 'xxx',
            prescChange: 'xxx',
            reqDiffPresc: 'xxx',
            notes: 'xxx',
            other: 'xxx'
          },
          clinical_review: {
            sideeffects: 'yes',
            pharmacistcontact: 'yes'
          },
          prescriptionList: [
            {
              id: '196b3c82-8a4a-473e-8575-1b672ab371be',
              rxNumber: '162877081562',
              refrigerated: false,
              patientName: 'DIGICATWSVN DIGICATWSVN',
              drugImageURL: '/images/IN1827/default_image_small.jpg',
              type: 'SPECIALTYUNSOLICITED',
              rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
              insuranceAvailable: true,
              dueNow: 0,
              qty: '5',
              drugName: 'Complera Tab',
              isValidRx: 'true',
              fillNow: false,
              ninetyDayInd: false,
              autoRefillEnabled: false,
              autoRefillEligible: false,
              admin: true,
              meId: '11950421941',
              cashPrice: '0',
              ninetyDay: false,
              requestToRemove: true
            }
          ]
        }
      ]
    }
  ]
};
const specialityData = [
  {
    healthInfoChecked: true,
    healthInfo: {
      additionalMeds: 'xxx',
      healthConditions: 'yyy',
      drugAllergies: 'yyy',
      nohealthConditions: 'zzz',
      nodrugAllergies: 'zzz',
      noadditionalMedication: 'zzz'
    },
    clinical_review: {
      sideeffects: 'yes',
      pharmacistcontact: 'yes',
      assistance: 'yes'
    },
    referrals: [
      {
        scriptMedId: '3660375',
        referralId: '3660375',
        boxDetails: {
          shippingInfo: {
            creditCard: [
              {
                transactionId: '1111',
                isSelected: true,
                paymentMethodId: '1111',
                dueNow: '1111'
              }
            ],
            selectedAddress: 'xxx',
            addressForm: 'xxx',
            selectedDate: '12/12/2019 Thursday',
            localSpecialtyInd: false,
            availableDates: [
              '12/12/2019 Thursday',
              '12/13/2019 Friday',
              '12/16/2019 Monday',
              '12/17/2019 Tuesday',
              '12/18/2019 Wednesday',
              '12/19/2019 Thursday',
              '12/20/2019 Friday'
            ]
          }
        },
        callMeReasons: {
          prefDelDtNotAvailable: 11,
          sideEffects: 'true',
          pharmCounsilQtn: 'true',
          insuranceBillQtn: 'xxx',
          newInsurance: 'xxx',
          prescNotVisible: 'xxx',
          prscQty: 'xxx',
          prescChange: 'xxx',
          reqDiffPresc: 'xxx',
          notes: 'xxx',
          other: 'xxx'
        },
        clinical_review: {
          sideeffects: 'yes',
          pharmacistcontact: 'yes'
        },
        prescriptionList: [
          {
            id: '196b3c82-8a4a-473e-8575-1b672ab371be',
            rxNumber: '162877081562',
            refrigerated: false,
            patientName: 'DIGICATWSVN DIGICATWSVN',
            drugImageURL: '/images/IN1827/default_image_small.jpg',
            type: 'SPECIALTYUNSOLICITED',
            rxViewId: 'HISTORY_MULTILINE_VIEW_21918045',
            insuranceAvailable: true,
            dueNow: 0,
            qty: '5',
            drugName: 'Complera Tab',
            isValidRx: 'true',
            fillNow: false,
            ninetyDayInd: false,
            autoRefillEnabled: false,
            autoRefillEligible: false,
            admin: true,
            meId: '11950421941',
            cashPrice: '0',
            ninetyDay: false,
            requestToRemove: true
          }
        ]
      }
    ]
    // 'referrals': [{
    //   'boxDetails': {
    //     'shippingInfo': {
    //       'creditCard': [{
    //         'transactionId': '1111',
    //         'saveAsExpressPay': 'xxx',
    //         'isSelected': true,
    //       }],
    //       'selectedAddress': 'undefined',
    //       'addressForm': 'undefined',
    //       'selectedDate': 'undefined',
    //       'selectedShippingOption': 'false',
    //       'srxDeliveryAddr': 'xxxx',
    //       'availableDates': [
    //         '12/12/2019 Thursday',
    //         '12/13/2019 Friday',
    //         '12/16/2019 Monday',
    //         '12/17/2019 Tuesday',
    //         '12/18/2019 Wednesday',
    //         '12/19/2019 Thursday',
    //         '12/20/2019 Friday'
    //       ]
    //     }
    //   }
    // }],
  }
];
const mockAddress = {
  street: 'south',
  zipCode: '20901',
  city: 'Silver Spring',
  state: 'MD'
};
export const TEST = {
  checkoutData,
  checkoutData1,
  checkoutMessage,
  unsoliciteData,
  unsoliciteData1,
  unsoliciteData2,
  cleancePatient,
  tokenData,
  tokenData1,
  mockAddress,
  orderData,
  orderData1,
  orderData2,
  specialityData
};
