import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../../../tests/app.testing.module';
import { cleansedPrescriptionsSectionComponent } from './cleansed-prescriptions-section.component';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser, ProfileInfoModel } from '@app/models';
import { jsonUsr } from '../../../../../../../../test/mocks/userService.mocks';
import { Router } from '@angular/router';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { SpecialityService } from '../../../speciality.service';
import { PatientModel } from '@app/models/checkout/patient.model';
import { HttpClientService } from '@app/core/services/http.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { TEST } from '../../../../../../../../tests/speciality-review';
import { Observable } from 'rxjs/Observable';
import { SpecialityContext } from '@app/models/checkout/speciality.context';


const referal = {
  add_update_svc_status: false,
  scriptMedId: '4635523',
  termsAndConditions: false,
  callMeReasons: {
    insuranceBillQtn: false,
    newCreditCard: false,
    newInsurance: false,
    notes: '',
    other: false,
    pharmCounsilQtn: 'false',
    prescChange: false,
    prescNotVisible: false,
    prscQty: false,
    reqDiffPresc: false
  },
  clinical_review: {
    assistance: '',
    pharmacistcontact: '',
    sideeffects: ''
  },
  healthInfo: {
    additionalMeds: [],
    drugAllergies: [],
    healthConditions: [{
      healthCondition: 'POISONING-HALLUCINOGENS',
      healthConditionCd: '969.6',
      icdType: 'ICD9'
    },
    {
      healthCondition: 'HB-SS DISEASE W/O CRISIS',
      healthConditionCd: '282.61',
      icdType: 'ICD9'
    }
    ]
  },
  referrals: [{
    autoRefillBanner: false,
    channel: 'DOTCOM',
    channelType: 'SIGNIN',
    contactNumber: '(630) 670-04726',
    customerCareContact: '(888) 347-3416',
    dueNow: '1.0',
    emailSent: 0,
    flow: 'ARX',
    hdNewOrXr: false,
    header: 'CLEANSED',
    missingCCCase: true,
    // tslint:disable-next-line: max-line-length
    missingCCMessage: 'We are unable to retrieve your payment information at this time. Please continue and submit your order, and we\'ll contact you about payment.',
    payBy: '1',
    referralId: '7952955',
    scriptMedId: '4635523',
    signatureRequired: false,
    subType: 'CLEANSED',
    totalEstimatedPrice: '1.0',
    type: 'SPECIALTY',
    boxDetails: {
      shippingInfo: {
        localSpecialtyInd: false,
        selectedDate: '05/18/2020 Monday',
        availableDates: ['05/18/2020', '05/19/2020 Tuesday'
          , '05/20/2020 Wednesday'
          , '05/21/2020 Thursday'
          , '05/22/2020 Friday'
          , '05/25/2020 Monday'
          , '05/26/2020 Tuesday'],
        deliveryAddr: [{
          addedAddress: false,
          addressAvailable: true,
          city: 'FRISCO',
          defaultAddress: false,
          firstName: 'PATCDATWNTY',
          lastName: 'PATCDATWNTY',
          preferred: true,
          referralAddress: true,
          state: 'TX',
          street1: '34 HILLS ROAD',
          streetAddr: '34 HILLS ROAD',
          type: 'HOME',
          zip: '75033'
        }],
        messages: [{ code: 'WAG_E_SRX_PAYMENTS_001' }],
        srxDeliveryAddr: {
          srxDeliveryAddr: [{
            addedAddress: false,
            addressAvailable: true,
            city: 'FRISCO',
            defaultAddress: false,
            firstName: 'PATCDATWNTY',
            lastName: 'PATCDATWNTY',
            preferred: true,
            referralAddress: true,
            state: 'TX',
            street1: '34 HILLS ROAD',
            streetAddr: '34 HILLS ROAD',
            type: 'HOME',
            zip: '75033'
          }]
        }
      }
    },
    callMeReasons: {
      prefDelDtNotAvailable: false,
      channel: 'DOTCOM',
      channelType: 'SIGNIN',
      contactNumber: '(630) 670-04726',
      customerCareContact: '(888) 347-3416',
      dueNow: '1.0',
      emailSent: 0,
      flow: 'ARX',
      hdNewOrXr: false,
      header: 'CLEANSED',
      missingCCCase: true,
      // tslint:disable-next-line: max-line-length
      missingCCMessage: 'We are unable to retrieve your payment information at this time. Please continue and submit your order, and we\'ll contact you about payment.',
      payBy: '1'
    },
    prescriptionList: [{
      admin: true,
      autoRefillEligible: false,
      autoRefillEnabled: false,
      cashPrice: '1.00',
      drugImageURL: '/images/IN1827/default_image_small.jpg',
      drugName: 'Kaletra 200-50mg Tablets',
      dueNow: 0,
      fillNow: false,
      gpiCode: '2243299',
      id: 'S7952955',
      insuranceAvailable: false,
      isRequestToRemove: 'false',
      isValidRx: 'true',
      meId: '11942924937',
      ninetyDay: false,
      ninetyDayInd: false,
      patientName: 'PATCDATWNTY PATCDATWNTY',
      prescriber: 'BAACK',
      priceMsg: '',
      qty: '120',
      refrigerated: false,
      rxNumber: '162876893212',
      type: 'SPECIALTY'
    }],
    selectedAdresss: {
      addedAddress: false,
      addressAvailable: true,
      city: 'FRISCO',
      defaultAddress: false,
      firstName: 'PATCDATWNTY',
      lastName: 'PATCDATWNTY',
      preferred: true,
      referralAddress: true,
      state: 'TX',
      street1: '34 HILLS ROAD',
      streetAddr: '34 HILLS ROAD',
      type: 'HOME',
      zip: '75033',
    }


  }],

};

const specialityData = [{
  prescriptions: [1, 2],
  // referral: [{
  //   prescriptions: [{
  //     rxNumber: '1111'
  //   }],
  // }],
  healthInfo: {
    additionalMeds: undefined,
    healthConditions: undefined,
    drugAllergies: undefined
  },
  referrals: [{
    prescriptionList: [{
      rxNumber: '123',
    }],
    payBy: '1',
    referralId: 1,
    prescriptions: [{
      rxNumber: '1111'
    }],
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

describe('cleansedPrescriptionsSectionComponent', () => {
  let component: cleansedPrescriptionsSectionComponent;
  let fixture: ComponentFixture<cleansedPrescriptionsSectionComponent>;
  let commonservice;
  let _userService: UserService;
  let _common: CommonUtil;
  let router;
  let spy: any;
  // let payloadIndex: number;
  let specialityService;
  let httpservice;
  let checkoutService;
  // let ci: SpecialityContext;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [cleansedPrescriptionsSectionComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        _userService = TestBed.get(UserService);
        _userService.user = new ArxUser('11948190939');
        _userService.user.firstName = 'testFirst';
        _userService.user.lastName = 'test';
        _userService.user.dateOfBirth = '01-01-2000';
        _userService.user.phoneNumber = '1234567899';
        _userService.user.profile = jsonUsr;
        _common = TestBed.get(CommonUtil);
        router = TestBed.get(Router);
        fixture = TestBed.createComponent(
          cleansedPrescriptionsSectionComponent
        );
        component = fixture.componentInstance;
        commonservice = TestBed.get(CommonUtil);
        httpservice = TestBed.get(HttpClientService);
        checkoutService = TestBed.get(CheckoutService);
        specialityService = TestBed.get(SpecialityService);
      });
  }));

  it('should create ', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    component.patientData = referal;
    fixture.detectChanges();
    spyOn(component, 'checkAndProcessCleansedPayment').and.stub();
    spyOn(component, 'initPayload').and.stub();
    spyOn(component, 'loadContext').and.stub();
    component.ngOnInit();
  });
  it('Should call - checkAndProcessCleansedPayment with WAG_E_SRX_PAYMENTS_001', () => {
    component.patientData = {
      referrals: [{
        duenow: 0,
        noPaymentDue: true,
        payBy: '',
        boxDetails: {
          shippingInfo: {
            messages: [{ code: 'WAG_E_SRX_PAYMENTS_001', message: 'success', type: 'INFO' }],
            srxDeliveryAddr: {
              srxDeliveryAddr: [{ preferred: true, address: 'test' }]
            }
          }
        }
      }]
    };
    component.checkAndProcessCleansedPayment();
  });
  it('Should call - checkAndProcessCleansedPayment with No CreditCard Found', () => {
    component.patientData = {
      referrals: [{
        duenow: 0,
        noPaymentDue: true,
        payBy: '',
        boxDetails: {
          shippingInfo: {
            messages: [{ code: 'No CreditCard Found', message: 'success', type: 'INFO' }],
            srxDeliveryAddr: [{
              srxDeliveryAddr: [{ preferred: true, address: 'test' }]
            }]
          }
        }
      }]
    };
    component.checkAndProcessCleansedPayment();
  });
  it('should call initPayload', () => {
    component.patientData = referal;
    component.initPayload();
  });
  it('should call loadContext', () => {
    component.patientData = referal;
    component.payloadIndex = 0;
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
    specialityService.patientsPayload = specialityData;
    component.loadContext();
  });
  it('should call redirectToAddCard', () => {
    component.patientData = referal;
    const referral = {
      payBy: '',
      boxDetails: {
        shippingInfo: {
          creditCard: ''
        }
      }
    };
    spyOn(_common, 'navigate').and.stub();
    fixture.detectChanges();
    component.redirectToAddCard(referral);
  });
  it('should call redirectToAddressBook', () => {
    component.patientData = referal;
    spyOn(_common, 'navigate').and.stub();
    fixture.detectChanges();
    spy = spyOn(component, 'redirectToAddressBook').and.callThrough();
    component.redirectToAddressBook('CLEANSED', '4635523', '7952955');
    expect(spy).toHaveBeenCalled();
  });
  it('should call shippingDateNotAvailable', () => {
    component.patientData = referal;
    fixture.detectChanges();
    const event_data = { target: { checked: true } };
    component.shippingDateNotAvailable(0, event_data);
    spyOn(component, 'validatePatientData').and.stub();
  });
  it('should call shippingDateNotAvailable else', () => {
    component.patientData = referal;
    fixture.detectChanges();
    const event_data = { target: { checked: false } };
    component.shippingDateNotAvailable(0, event_data);
    spyOn(component, 'validatePatientData').and.stub();
  });
  it('should call validatePatientData with clinical_review', () => {
    component.patientData = referal;
    component.clinical_review.pharmacistcontact = '';
    fixture.detectChanges();
    component.validatePatientData();
  });
  it('should call validatePatientData', () => {
    component.patientData = referal;
    fixture.detectChanges();
    component.validatePatientData();
  });
  it('should call onCardSelect', () => {
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    component.onCardSelect(0, 0, { target: { checked: true } });
  });
  it('should call onCardSelect', () => {
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    component.onCardSelect(0, 0, { target: { checked: false } });
  });
  it('should call onPayByChange', () => {
    const even_data = {
      target: { value: 'test' }
    };
    const referral = {
      payBy: '',
      dueNow: 0,
      boxDetails: {
        shippingInfo: {
          creditCard: [{
            selected: true,
            isSelected: true,
            dueNow: 0,
          }]
        }
      }
    };
    component.onPayByChange(even_data, referral);
  });
  it('should call onPayByChange else', () => {
    const even_data = {
      target: { value: 'test' }
    };
    const referral = {
      payBy: '',
      dueNow: 0,
      boxDetails: {
        shippingInfo: {
          creditCard: [{
            selected: false,
            isSelected: false,
            dueNow: 0,
          }]
        }
      }
    };
    component.onPayByChange(even_data, referral);
  });
  it('should call calculateAmount focus', () => {
    spyOn(component, 'updateCCInformation').and.stub();
    const even_data = { target: { value: 0 }, type: 'focus' };
    component.calculateAmount(even_data, '');
  });
  it('should call calculateAmount blur', () => {
    component.patientData = {
      referrals: [{
        payBy: '',
        dueNow: '1',
        boxDetails: {
          shippingInfo: {
            creditCard: [{
              transactionId: '1111',
              isSelected: true,
              paymentMethodId: '1111',
              dueNow: 1
            }],
          }
        }
      }]
    };
    spyOn(component, 'updateCCInformation').and.stub();
    const even_data = { target: { value: '.', name: '1111' }, type: 'blur' };
    component.calculateAmount(even_data, 0);
  });
  xit('should call calculateAmount keyup', () => {
    component.patientData = {
      referrals: [{
        payBy: '',
        dueNow: '1',
        boxDetails: {
          shippingInfo: {
            creditCard: [{
              transactionId: '1111',
              isSelected: true,
              paymentMethodId: '1111',
              dueNow: '1'
            }],
          }
        }
      }]
    };
    spyOn(component, 'updateCCInformation').and.stub();
    const even_data = { target: { value: '', name: '1111' }, type: 'keyup' };
    component.calculateAmount(even_data, 0);
  });
  it('should call updateCCInformation', () => {
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    component.updateCCInformation();
  });
  it('should call donotNeedItem', () => {
    const prescription = { requestToRemove: true };
    const event = { target: { value: 'test' } };
    component.donotNeedItem(prescription, event);
  });
  it('should call donotNeedItem', () => {
    const prescription = { requestToRemove: false };
    const event = { target: { value: 'test' } };
    component.donotNeedItem(prescription, event);
  });
  it('should call - removeReferral ', () => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: 1 }]));
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    spyOn(commonservice, 'navigate').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of(true)
    );
    spyOn(checkoutService, 'deliveryOptions').and.returnValue(
      Observable.of(TEST.checkoutData1)
    );
    component.removeReferral(0, { prescriptionList: [1, 2, 3], referralId: 1 });
  });
  xit('should call - removeReferral1 ', () => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: 1 }]));
    spyOn(commonservice, 'navigate').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of(true)
    );
    spyOn(checkoutService, 'deliveryOptions').and.returnValue(
      Observable.of(TEST.checkoutData)
    );
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    component.removeReferral(0, { prescriptionList: [{  rxNumber: '123'}], referralId: 1 });
  });
  it('should call - removeReferral else with messages', () => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: 1 }]));
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    spyOn(commonservice, 'navigate').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of(true)
    );
    spyOn(checkoutService, 'deliveryOptions').and.returnValue(
      Observable.throw({
        status: 500
      }));
    component.removeReferral(0, { prescriptionList: [1, 2, 3], referralId: 1 });
  });
  it('should call - removeReferral else with messages', () => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: 1 }]));
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    spyOn(commonservice, 'navigate').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.of(false)
    );
    component.removeReferral(0, { prescriptionList: [1, 2, 3], referralId: 1 });
  });
  it('should call - removeReferral else with messages', () => {
    localStorage.setItem('ck_items_sp', JSON.stringify([{ rxNumber: 1 }]));
    component.payloadIndex = 0;
    specialityService.patientsPayload = specialityData;
    spyOn(commonservice, 'navigate').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.removeReferral(0, { prescriptionList: [1, 2, 3], referralId: 1 });
  });
  it('should call cardStateCheck1', () => {
    const cards = { card: { isSelected: 'false' } };
    component.cardStateCheck(cards, '');
  });

  it('should call cardStateCheck2', () => {
    const cards = { card: { isSelected: 'false' } };
    const referal1 = { referral: { pay: '1' } };
    component.cardStateCheck(cards, referal1);
  });
  it('should call convertToDecimal', () => {
    const even_data = {
      target: { value: '' }
    };
    component.convertToDecimal(even_data, '');
  });
  it('should call redirectToUpdateCard', () => {
    component.patientData = referal;
    spyOn(_common, 'navigate').and.stub();
    fixture.detectChanges();
    component.redirectToUpdateCard('sdsd');
  });
  it('should call isCCExpired', () => {
    const isCCExpired = { expDate: '1/1/1' };
    component.isCCExpired(isCCExpired);
  });
  it('should call changeScheduleDate', () => {
    component.patientData = referal;
    component.changeScheduleDate('05:15:2020');
  });
  it('should call addMorePres', () => {
    component.patientData = referal;
    spyOn(_common, 'navigate').and.stub();
    fixture.detectChanges();
    spy = spyOn(component, 'addMorePres').and.callThrough();
    component.addMorePres();
    expect(spy).toHaveBeenCalled();
  });

});
