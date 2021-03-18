const params_data = [1, 2];

const fetch_data = {
  message: 'xxxx',
  healthInfo: {
    additionalMeds: '',
    healthConditions: '',
    drugAllergies: ''
  }
};
const fetch_data1 = {
  healthInfo: {
    additionalMeds: 'xxx',
    healthConditions: 'yyy',
    drugAllergies: 'zzz'
  }
};
const fetch_data2 = {
  message: undefined
};
const address_data = {
  messages: undefined,
  addresses: [
    {
      id: '50002640022',
      firstName: 'Lava',
      lastName: 'Chocho',
      street1: '7123 SOUTH ROAD',
      city: 'BUFFOLLO GROOVE',
      state: 'IL',
      zipCode: '60015',
      isPreferred: false,
      newlyAdded: false,
      msRequest: false
    },
    {
      id: '50002770000',
      firstName: 'Lava',
      lastName: 'Chocho',
      street1: '305 WILMOT ROAD, DEERFIELD, IL, USA',
      city: 'DEERFIELD',
      state: 'IL',
      zipCode: '60015',
      isPreferred: false,
      newlyAdded: false,
      msRequest: false
    }
  ]
};
const address_data1 = {
  messages: 'xxxxxx',
  addresses: [
    {
      id: '50002640022',
      firstName: 'Lava',
      lastName: 'Chocho',
      street1: '7123 SOUTH ROAD',
      city: 'BUFFOLLO GROOVE',
      state: 'IL',
      zipCode: '60015',
      isPreferred: false,
      newlyAdded: false,
      msRequest: false
    },
    {
      id: '50002770000',
      firstName: 'Lava',
      lastName: 'Chocho',
      street1: '305 WILMOT ROAD, DEERFIELD, IL, USA',
      city: 'DEERFIELD',
      state: 'IL',
      zipCode: '60015',
      isPreferred: false,
      newlyAdded: false,
      msRequest: false
    }
  ],
  homeAddress: {
    firstName: 'xxxx',
    lastName: 'xxxx',
    street1: 'THYAGA STREE',
    city: 'FRISCO',
    state: 'TX',
    zipCode: '75033',
    newlyAdded: false,
    msRequest: false
  }
};
const checkout_data = {
  checkoutDetails: [
    {
      prescriptionList: [
        {
          messages: [
            {
              code: 'WAG_RXHOMEDELIVERY_001'
            }
          ],
          isValidRx: false
        },
        {
          messages: [
            {
              code: 'xxxx'
            }
          ],
          isValidRx: true
        }
      ],
      boxDetails: {
        shippingInfo: {
          shippingOptions: [
            {
              selected: true,
              value: 1
            },
            {
              selected: false,
              value: 2
            }
          ]
        }
      }
    }
  ]
};
const checkout_data1 = {
  messages: 'xxxxxx',
  code: 'WAG_E_RR_001',
  checkoutDetails: [
    {
      prescriptionList: [
        {
          messages: [
            {
              code: 'WAG_RXHOMEDELIVERY_001'
            }
          ],
          isValidRx: false
        },
        {
          messages: [
            {
              code: 'xxxx'
            }
          ],
          isValidRx: true
        }
      ],
      boxDetails: {
        shippingInfo: {
          shippingOptions: [
            {
              selected: true,
              value: 1
            },
            {
              selected: false,
              value: 2
            }
          ]
        }
      }
    }
  ]
};
const checkout_data2 = {
  checkoutDetails: [
    {
      prescriptionList: [
        {
          messages: [
            {
              code: 'WAG_RXHOMEDELIVERY_001'
            }
          ],
          isValidRx: false
        },
        {
          messages: [
            {
              code: 'xxxx'
            }
          ],
          isValidRx: true
        }
      ]
    }
  ]
};
const checkout_data3 = {
  checkoutDetails: [
    {
      prescriptionList: []
    }
  ]
};
const refill_data = {
  code: 'xxxx',
  rxorders: [
    {
      patient: [
        {
          referrals: [
            {
              invalidPrescriptions: '1111'
            }
          ]
        }
      ]
    }
  ]
};
const message_data = [
  {
    messages: [
      {
        code: 'WAG_RXCHECKOUT_002'
      }
    ],
    isValidRx: 'false'
  },
  {
    messages: [
      {
        code: 'xxxx'
      }
    ],
    isValidRx: 'true'
  }
];
const message_data1 = {
  messages: [{ code: 'WAG_E_RR_001', message: 'success', type: 'INFO' }]
};
const message_data2 = {
  messages: [
    { code: 'WAG_RXCHECKOUT_WRONG_USER', message: 'success', type: 'INFO' }
  ]
};
const message_data3 = {
  messages: [{ code: 'WAG_RXCHECKOUT_002', message: 'success', type: 'INFO' }]
};
const mail_data = {
  checkoutDetails: [
    {
      boxDetails: {
        shippingInfo: {
          shippingOptions: [
            {
              selected: true,
              value: 1
            },
            {
              selected: false,
              value: 2
            }
          ],
          deliveryAddr: [
            {
              street1: '1234 WEST DRIVE',
              city: 'DEERFIELD',
              state: 'IL',
              zipCode: '60015'
            }
          ]
        }
      }
    }
  ]
};
const update_address = [
  {
    id: '50005990004',
    firstName: 'Digicatwsvn',
    lastName: 'Digicatwsvn',
    street1: '56565 PINE RD',
    city: 'SOUTH BEND',
    state: 'IN',
    zipCode: '46619',
    isPreferred: false,
    newlyAdded: false,
    msRequest: false
  },
  {
    id: '50006110003',
    firstName: 'Digicatwsvn',
    lastName: 'Digicatwsvn',
    street1: 'LOT 13',
    city: 'SPRINGFIELD',
    state: 'MO',
    zipCode: '65807',
    isPreferred: true,
    newlyAdded: false,
    msRequest: false
  }
];
export {
  params_data,
  fetch_data,
  fetch_data1,
  fetch_data2,
  address_data,
  address_data1,
  checkout_data,
  checkout_data1,
  checkout_data2,
  checkout_data3,
  refill_data,
  message_data,
  message_data1,
  message_data2,
  message_data3,
  mail_data,
  update_address
};
