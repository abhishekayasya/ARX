import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';

import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { ReminderService } from '../reminder.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { SpecialityService } from '@app/pages/checkout/specialty-checkout/speciality.service';
import { CHECKOUT } from '@app/config/checkout.constant';

const specialityData = [{
  prescriptions: [1, 2],
  referral: [{
    prescriptions: [{
      rxNumber: '1111'
    }],
  }],
  healthInfo: {
    additionalMeds: undefined,
    healthConditions: undefined,
    drugAllergies: undefined
  },
  referrals: [
    {
      payBy: '1',
      referralId: 1,
      prescriptions: [
        {
          rxNumber: '1111'
        }
      ],
      boxDetails: {
        shippingInfo: {
          creditCard: [
            {
              transactionId: '1111',
              isSelected: true,
              paymentMethodId: '1111',
              dueNow: '1'
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
        prefDelDtNotAvailable: true,
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
      }
    }
  ]
}
];
const specialityData1 = [
  {
    scriptMedId: "123"
  },
  {
    healthInfo: {
      additionalMeds: [
        {
          drugId: 1
        }
      ],
      healthConditions: [
        {
          drugId: 1,
          healthConditionCd: 'test'
        }
      ],
      drugAllergies: [
        {
          drugId: 1,
          allergyCode: 'test'
        }
      ],
      additionalMedication: [
        {
          drugId: 1
        }
      ]
    },
    referrals: [
      {
        payBy: '2',
        dueNow: '1',
        boxDetails: {
          shippingInfo: {
            creditCard: [
              {
                transactionId: '1111',
                isSelected: true,
                paymentMethodId: '1111',
                dueNow: '1'
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
          prefDelDtNotAvailable: true,
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
        }
      }
    ]
  },
  {
    scriptMedId: "123"
  }
];
const referralData = {
  rxorders: [
    {
      prescriptionType: 'specialtyCleansed',
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
const referralData1 = {
  rxorders: [
    {
      prescriptionType: 'test',
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
const patientData = [{
  referrals: [{
    payBy: '2',
    dueNow: '1',
    boxDetails: {
      shippingInfo: {
        creditCard: [{
          transactionId: '1111',
          isSelected: true,
          paymentMethodId: '1111',
          dueNow: '1'
        }],
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
      prefDelDtNotAvailable: true,
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
  }]
}];

const specialityDatas = {
  patientsPayload: [
    {
      healthInfo: {
        additionalMeds: [{ drugId: 1 }],
        healthConditions: [{ drugId: 1, healthConditionCd: 1 }],
        drugAllergies: [{ drugId: 1, allergyCode: "test" }]
      }
    },
    {
      scriptMedId: "123"
    },
    {
      meId: "123"
    }
  ]
};

const context = {
  patient: [{
    id: '4635523_7952955',
    dueNow: '1',
    clDeliveryDate: '01/01/1995',
    prefDelDtNotAvailable: '01/01/1995',
  }],
  healthInfo: [{
    id: '4635523',
    nodrugAllergies: [],
    nohealthConditions: [],
    noadditionalMedication: [],
  }],
  clinical_review: [{
    id: '4635523',
    assistance: '',
    pharmacistcontact: '',
    sideeffects: ''
  }],
};


describe('AppContextService', () => {
  let reminderService: ReminderService;
  let _userService: UserService;
  let _common: CommonUtil;
  let _http: HttpClientService;
  let _message: MessageService;
  let gaService: GaService;
  let spy: any;
  let specialityService;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        reminderService = TestBed.get(ReminderService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
        _http = TestBed.get(HttpClientService);
        _message = TestBed.get(MessageService);
        gaService = TestBed.get(GaService);
        specialityService = TestBed.get(SpecialityService);
      });
  }));
  it('ReminderService Instance is available', fakeAsync(() => {
    sessionStorage.setItem(CHECKOUT.session.key_sp_context,JSON.stringify(context));
    expect(reminderService).toBeTruthy();
  }));

  it('Should call - savePatientContext', fakeAsync(() => {
    reminderService.patientsPayload=specialityData1;
    spy = spyOn(reminderService, 'savePatientContext').and.callThrough();
    reminderService.savePatientContext(0);
    expect(spy).toHaveBeenCalled();
  }));

  it('Should call - savePatientContext', fakeAsync(() => {
    reminderService.patientsPayload=patientData;
    spy = spyOn(reminderService, 'savePatientContext').and.callThrough();
    reminderService.savePatientContext(0);
    expect(spy).toHaveBeenCalled();
  }));

  it('Should call - savePatientContext', fakeAsync(() => {
    reminderService.patientsPayload=patientData;
    specialityService.context = {
      patient: [{
        id: '4635523_7952955',
        dueNow: '1',
        clDeliveryDate: '01/01/1995',
        prefDelDtNotAvailable: '01/01/1995',
      }],
      healthInfo: [{
        id: '4635523',
        nodrugAllergies: [],
        nohealthConditions: [],
        noadditionalMedication: [],
      }],
      clinical_review: [{
        id: '4635523',
        assistance: '',
        pharmacistcontact: '',
        sideeffects: ''
      }],
    };
    sessionStorage.setItem(CHECKOUT.session.key_sp_context,JSON.stringify(context));
    spy = spyOn(reminderService, 'savePatientContext').and.callThrough();
    reminderService.savePatientContext(0);
    
    expect(spy).toHaveBeenCalled();
  }));


});
