export const STATUS_MAP = {
  Mail: {
    UPV: {
      generic: 'We\'re processing this prescription request.',
      Order_Received: {
        single: 'We\'re processing the request for this prescription.',
        multiple: 'We\'re processing the request for these prescriptions. '
      },
      In_Progress: {
        single:
          'Order received. We\'re processing your order and will email you when it has shipped. ',
        multiple:
          'Order received. We\'re processing your order and will email you when it has shipped. '
      }
    },
    RFF: {
      generic: 'We\'ll email you when this order has shipped.',
      Filling_Prescription: {
        single: 'We\'ll email you when this order has shipped.',
        multiple: 'We\'ll email you when this order has shipped.'
      },
      In_Progress: {
        single:
          'Fulfilling Rx Order. We\'ll email you when this order has shipped.',
        multiple:
          'Fulfilling Rx Order. We\'ll email you when this order has shipped.'
      }
    },
    STP: {
      generic:
        'We\'ll email you when this order has a tracking number and has shipped. ',
      Preparing_to_Ship: {
        single:
          'We\'ll email you when this order has a tracking number and has shipped. ',
        multiple:
          'We\'ll email you when this order has a tracking number and has shipped. '
      },
      In_Progress: {
        single:
          'Preparing for shipment. We\'ll email you when this order has shipped.',
        multiple:
          'Preparing for shipment. We\'ll email you when this order has shipped.'
      }
    },
    CBH: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Outstanding Balance Due  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Outstanding Balance Due  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    CCE: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Credit Card Expired  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Credit Card Expired  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    SCL: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Outstanding Balance Due  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Outstanding Balance Due  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    CTT: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Credit Card Information Needed  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Credit Card Information Needed  Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    HCC: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Payment Approval Needed Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Payment Approval Needed Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    EN_TPR1: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Insurance Expired Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Insurance Expired Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    EN_TPR5: {
      Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'Insurance Information Needed Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. ',
        multiple:
          // tslint:disable-next-line: max-line-length
          'Insurance Information Needed Please call (866) 525-1590 to make a payment. Your order will be cancelled if you don\'t contact us within 72 hours. '
      }
    },
    DCE: {
      Delayed___No_Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.',
        multiple:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.'
      }
    },
    NRR: {
      Delayed___No_Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.',
        multiple:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.'
      }
    },
    XRD: {
      Delayed___No_Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.',
        multiple:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.'
      }
    },
    RNR: {
      Delayed___No_Action_Needed: {
        single:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.',
        multiple:
          // tslint:disable-next-line: max-line-length
          'We\'re contacting your doctor for refill approval because you don\'t have any refills left. We don\'t require any action from you at this time.'
      }
    }
  },

  specialty: {
    Initiated: {
      generic: 'We\'ve started processing this prescription request. ',
      In_Progress: {
        single: 'We\'ve started processing the request for this prescription.',
        multiple:
          'We\'ve started processing the request for these prescriptions. '
      }
    },
    Verified_Not_PSSO_Eligible: {
      generic: 'We\'ll email you when this order has shipped.',
      Filling_Prescription: {
        single: 'We\'ll email you when this order has shipped.',
        multiple: 'We\'ll email you when this order has shipped.'
      }
    },
    // Closed_By_Patient: {
    //   In_Progress: {
    //     single: 'Processing order. We\'ll notify you when this order has shipped.',
    //     multiple: 'Processing order. We\'ll notify you when this order has shipped.'
    //   }
    // },
    Verified: {
      Refill_Due__Order_Now: {
        single: 'Schedule Delivery  It\'s time to refill this prescription. ',
        multiple: 'Schedule Delivery  It\'s time to refill these prescriptions. '
      },
      Order_Received: {
        single:
          'We\'re working on your order. We\'ll email you when it\'s shipped or further attention is required. ',
        multiple:
          'We\'re working on your order. We\'ll email you when it\'s shipped or further attention is required. '
      },
      In_Progress: {
        single:
          'Processing order. We\'ll notify you when this order has shipped.',
        multiple:
          'Processing order. We\'ll notify you when this order has shipped.'
      }
    },
    RefillDue: {
      generic: 'Schedule Delivery  It\'s time to refill your prescription(s). ',
      Refill_Due__Order_Now: {
        single: 'Schedule Delivery  It\'s time to refill this prescription. ',
        multiple: 'Schedule Delivery  It\'s time to refill these prescriptions. '
      },
      Attention_Needed: {
        single: 'It\'s time to review your order and schedule for delivery. ',
        multiple: 'It\'s time to review your order and schedule for delivery. '
      }
    },
    Closed_by_Patient: {
      generic:
        'Processing order. We\'ll notify you when this order has shipped.',
      Order_Received: {
        single:
          'Processing order. We\'ll notify you when this order has shipped.',
        multiple:
          'Processing order. We\'ll notify you when this order has shipped.'
      },
      In_Progress: {
        single:
          'Processing order. We\'ll notify you when this order has shipped.',
        multiple:
          'Processing order. We\'ll notify you when this order has shipped.'
      }
    },
    Scheduled: {
      generic: 'We\'ll email you when this order has shipped.',
      Filling_Prescription: {
        single: 'We\'ll email you when this order has shipped.',
        multiple: 'We\'ll email you when this order has shipped.'
      },
      In_Progress: {
        single:
          'Order Scheduled. We\'ll notify you when this order has shipped.',
        multiple:
          'Order Scheduled. We\'ll notify you when this order has shipped.'
      }
    }
  }
};
