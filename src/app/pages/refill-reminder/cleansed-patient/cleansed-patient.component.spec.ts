import {
  async,
  TestBed,
  ComponentFixture,
  fakeAsync,
  flush,
  tick
} from '@angular/core/testing';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CleansedPatientComponent } from './cleansed-patient.component';
import { ReminderService } from '../reminder.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { CommonUtil } from '@app/core/services/common-util.service';
import { PatientModel } from '@app/models/checkout/patient.model';

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
const patientData = {
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
};
describe('CleansedPatientComponent- Refill', () => {
  let component: CleansedPatientComponent;
  let fixture: ComponentFixture<CleansedPatientComponent>;
  let _reminderservice;
  let _httpservice;
  let _commonservice;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CleansedPatientComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _reminderservice = TestBed.get(ReminderService);
        _httpservice = TestBed.get(HttpClientService);
        _commonservice = TestBed.get(CommonUtil);
        fixture = TestBed.createComponent(CleansedPatientComponent);
        component = fixture.componentInstance;
      });
  }));

  it('CleansedPatientComponent instance should be available', fakeAsync(() => {
    flush();
    expect(component).toBeTruthy();
  }));

  it('Should call - resetHealthInfoServiceErr', fakeAsync(() => {
    component.resetHealthInfoServiceErr();
  }));

  it('Should call - showHealthInfoErrMsg - Medications', fakeAsync(() => {
    spyOn(component, 'resetHealthInfoServiceErr').and.stub();
    component.showHealthInfoErrMsg('Medications');
    flush();
    expect(component.healthInfoServiceErr.addMedication).toBeTruthy();
  }));

  it('Should call - showHealthInfoErrMsg - Drug Allergies', fakeAsync(() => {
    spyOn(component, 'resetHealthInfoServiceErr').and.stub();
    component.showHealthInfoErrMsg('Drug Allergies');
    flush();
    expect(component.healthInfoServiceErr.drugAllergies).toBeTruthy();
  }));

  it('Should call - showHealthInfoErrMsg', fakeAsync(() => {
    spyOn(component, 'resetHealthInfoServiceErr').and.stub();
    component.showHealthInfoErrMsg('');
    flush();
    expect(component.healthInfoServiceErr.healthConditions).toBeTruthy();
  }));

  it('Should call - checkAndProcessCleansedPayment', fakeAsync(() => {
    component.patientData = {
      duenow: 0,
      noPaymentDue: true,
      payBy: '',
      boxDetails: {
        shippingInfo: {
          messages: [{ code: 'WAG_E_SRX_PAYMENTS_001' }],
          srxDeliveryAddr: [{ preferred: true }]
        }
      }
    };
    flush();
    component.checkAndProcessCleansedPayment();
    //expect(component).toBeTruthy();
  }));

  it('Should call - checkAndProcessCleansedPayment', fakeAsync(() => {
    component.patientData = {
      duenow: 0,
      noPaymentDue: true,
      payBy: '',
      boxDetails: {
        shippingInfo: {
          messages: [{ code: 'No CreditCard Found' }],
          srxDeliveryAddr: [{ preferred: true, address: 'test' }]
        }
      }
    };
    flush();
    component.checkAndProcessCleansedPayment();
    //expect(component).toBeTruthy();
  }));
  it('should call - ngOnInit ', fakeAsync(() => {
    flush();
    component.patientData = {
      duenow: 0,
      noPaymentDue: true,
      payBy: '',
      boxDetails: {
        shippingInfo: {
          messages: [{ code: 'WAG_E_SRX_PAYMENTS_001' }],
          srxDeliveryAddr: {
            srxDeliveryAddr: [{ preferred: true }]
          },
          availableDates: [1, 2, 3]
        }
      }
    };
    component.ngOnInit();
  }));
  it('Should call - onCardSelect payBy=2', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.onCardSelect(0, 0, { target: { checked: false } });
  }));
  it('Should call - onCardSelect else payBy=1', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    component.onCardSelect(0, 0, { target: { checked: true } });
  }));
  it('Should call - onCardSelect else payBy=2', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.onCardSelect(0, 0, { target: { checked: true } });
  }));
  it('should call - countSelected - creditCard is undefined', fakeAsync(() => {
    const referral = {
      boxDetails: { shippingInfo: { creditCard: undefined } }
    };
    flush();
    component.countSelected(referral);
  }));
  it('should call - countSelected', fakeAsync(() => {
    const referral = {
      boxDetails: { shippingInfo: { creditCard: [123, 345, 56] } }
    };
    flush();
    component.countSelected(referral);
  }));
  it('should call - cardStateCheck', fakeAsync(() => {
    const referral = {
      payBy: '1',
      boxDetails: {
        shippingInfo: {
          creditCard: [{ selected: true, isSelected: true, dueNow: 56 }]
        },
      }
    };
    const card = { isSelected: false };
    flush();
    component.cardStateCheck(card, referral);
  }));
  it('should call - cardStateCheck else case', fakeAsync(() => {
    const referral = {
      payBy: '2',
      boxDetails: {
        shippingInfo: {
          creditCard: [{ selected: true, isSelected: true, dueNow: 56 }, { selected: true, isSelected: true, dueNow: 56 }],
        },
      }
    };
    const card = { isSelected: true };
    flush();
    component.cardStateCheck(card, referral);
  }));
  it('should call isCCExpired', fakeAsync(() => {
    const isCCExpired = {
      expDate: '1/1/1'
    };
    flush();
    component.isCCExpired(isCCExpired);
  }));
  it('should call updateAllergies', fakeAsync(() => {
    const event = {
      target: { checked: true }
    };
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.updateAllergies(event);
  }));
  it('should call - onPayByChange', fakeAsync(() => {
    spyOn(_reminderservice, 'savePatientContext').and.stub();
    const referral = {
      boxDetails: {
        shippingInfo: {
          creditCard: [{ selected: true, isSelected: true, dueNow: 56 }]
        }
      }
    };
    const event = {
      target: { value: true }
    };
    flush();
    component.onPayByChange(event, referral);
  }));
  it('should call - onPayByChange else case', fakeAsync(() => {
    spyOn(_reminderservice, 'savePatientContext').and.stub();
    const referral = {
      boxDetails: {
        shippingInfo: {
          creditCard: [{ selected: false, isSelected: false, dueNow: 56 }]
        }
      }
    };
    const event = {
      target: { value: true }
    };
    flush();
    component.onPayByChange(event, referral);
  }));
  it('should call - convertToDecimal', fakeAsync(() => {
    const event = {
      target: { value: true }
    };
    flush();
    component.convertToDecimal(event, 1);
  }));
  it('should call - closeMedications', fakeAsync(() => {
    const event = {
      target: { value: true }
    };
    flush();
    component.closeMedications(event);
  }));
  it('should call - closeAllergies', fakeAsync(() => {
    const event = {
      target: { value: true }
    };
    flush();
    component.closeAllergies(event);
  }));
  it('should call calculateAmount focus', fakeAsync(() => {
    const even_data = {
      target: { value: 0 },
      type: 'focus'
    };
    flush();
    component.calculateAmount(even_data, '');
  }));
  it('should call calculateAmount blur', fakeAsync(() => {
    const even_data = {
      target: { value: '', name: '1111' },
      type: 'blur'
    };
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.patientData = patientData;
    component.calculateAmount(even_data, 0);
  }));
  xit('should call calculateAmount keyup', fakeAsync(() => {
    const even_data = {
      target: { value: '', name: '1111' },
      type: 'keyup'
    };
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.patientData = patientData;
    component.calculateAmount(even_data, 0);
  }));
  it('should call - closeConditions', fakeAsync(() => {
    const event = {
      target: { value: true }
    };
    flush();
    component.closeConditions(event);
  }));
  it('should call - updateValuesLocally Medications', fakeAsync(() => {
    const list = [
      {
        drugId: 1
      }
    ];
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.updateValuesLocally('Medications', list);
  }));
  it('should call - updateValuesLocally Health Conditions', fakeAsync(() => {
    const list = [
      {
        drugId: 1
      }
    ];
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.updateValuesLocally('Health Conditions', list);
  }));
  it('should call - updateValuesLocally Drug Allergies', fakeAsync(() => {
    const list = [
      {
        drugId: 1
      }
    ];
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.updateValuesLocally('Drug Allergies', list);
  }));
  it('should call - showDonotWantOption', fakeAsync(() => {
    component.patientData = {
      prescriptionList: [{
        isRequestToRemove: true
      }, {
        isRequestToRemove: true
      }, {
        isRequestToRemove: true
      }]
    };
    component.showDonotWantOption();
  }));
  it('should call - donotNeedItem', fakeAsync(() => {
    spyOn(window, 'setTimeout').and.stub();
    const event = { target: { checked: true } };
    component.donotNeedItem({}, event);
  }));
  it('should call - donotNeedItem', fakeAsync(() => {
    const event = { target: { checked: false } };
    component.donotNeedItem({}, event);
  }));
  it('should call - submitHealthData ', fakeAsync(() => {
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of({
        message: {
          code: 'WAG_I_HEALTH_HISTORY_SUBMIT_010',
          message: 'success',
          type: 'INFO'
        }
      })
    );
    const list = [
      {
        drugId: 1
      }
    ];
    component.submitHealthData('xyz', list);
  }));
  it('should call - submitHealthData else', fakeAsync(() => {
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of({
        message: { code: 'WAG_I_HEALTH_HISTORY_SUBMIT_011', message: 'success', type: 'INFO' }
      }));
    const list = [{
      drugId: 1
    }];
    component.submitHealthData('xyz', list);
  }));
  xit('should call - submitHealthData error', fakeAsync(() => {
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.throw({
        message: { code: 'WAG_I_HEALTH_HISTORY_SUBMIT_011', message: 'success', type: 'INFO' }
      }));
    const list = [{
      drugId: 1
    }];
    component.submitHealthData('xyz', list);
  }));
  it('should call - removeReferral', fakeAsync(() => {
    // flush();
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: '1111' }]));
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_commonservice, 'navigate').and.stub();
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of(referralData1)
    );
    component.removeReferral(0, 2);
  }));
  it('should call - removeReferral else', fakeAsync(() => {
    // flush();
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: '1111' }]));
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_commonservice, 'navigate').and.stub();
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of(referralData)
    );
    component.removeReferral(0, 2);
  }));
  it('should call - removeReferral else with messages', fakeAsync(() => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: '1111' }]));
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_commonservice, 'navigate').and.stub();
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of({
        messages: [{ code: 'WAG_E_RR_001', message: 'success', type: 'INFO' }]
      })
    );
    component.removeReferral(0, 2);
  }));
  it('should call - removeReferral else undefined', fakeAsync(() => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: '1111' }]));
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_commonservice, 'navigate').and.stub();
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of({ rxorders: undefined })
    );
    component.removeReferral(0, 2);
  }));
  it('should call - removeReferral else error', fakeAsync(() => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: '1111' }]));
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_commonservice, 'navigate').and.stub();
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.removeReferral(0, 2);
  }));
  it('should call - updateMedications', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    component.updateMedications([1, 2, 3]);
  }));
  it('should call - updateConditions', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    component.updateConditions([1, 2, 3]);
  }));
  it('should call - deleteHealthItem', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData;
    spyOn(_httpservice, 'postData').and.returnValue(
      Observable.of({ message: { code: 'WAG_I_HEALTH_HISTORY_DELETE_006', message: 'success', type: 'INFO' } })
    );
    component.deleteHealthItem('test', 'test', 1);
  }));
  it('should call - removeHealthItemFromList', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.removeHealthItemFromList('test', 'Health Conditions');
  }));
  it('should call - removeHealthItemFromList', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.removeHealthItemFromList('test', 'Drug Allergies');
  }));
  it('should call - removeHealthItemFromList', fakeAsync(() => {
    component.payloadIndex = 0;
    _reminderservice.patientsPayload = specialityData1;
    component.removeHealthItemFromList('test', 'Medications');
  }));
  xit('should call - shippingDateNotAvailable', fakeAsync(() => {
    const event_data = { target: { checked: true } };
    component.shippingDateNotAvailable(0, event_data);
  }));
});
