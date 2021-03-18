import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewInsuranceComponent } from './new-insurance.component';
import {
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  DebugElement
} from '@angular/core';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../test/mocks/userService.mocks';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Router } from '@angular/router';
import { NewInsuranceService } from './new-insurance.service';
import { Observable } from 'rxjs/Observable';

const event = {
  target: {
    checked: true
  }
};

const msInsureForm = {
  msEnrollInsuranceBeanForm: {
    msInsProvider: 'xzczx',
    msInsStatusCd: 1,
    msInsChId: 'zxc',
    msInsGroupNbr: 'xzvczx',
    msInsCardholderName: 'Juvenille Account',
    msInsCardholderBirthDay: '01',
    msInsCardholderBirthMonth: '01',
    msInsCardholderBirthYear: 1991
  },
  allergysList: ['Penicillin'],
  healthConditionList: ['Heart Disease'],
  flow: 'ARX'
};

const retriveInsurValue = {
  allergysMap: {
    '0': 'None',
    '32': 'Codeine',
    '70': 'Penicillin',
    '87': 'Sulfa',
    '93': 'Tetracycline',
    OtherAllergies: 'Other (we\'ll call you to gather more information)'
  },
  healthConditionsMap: {
    '100000': 'Heart Disease',
    '120000': 'Hypertension',
    '184000': 'Stomach Disorders',
    '280000': 'Arthritis',
    '301000': 'Glaucoma',
    '000000': 'None',
    '050000': 'Diabetes',
    '060000': 'Thyroid Disease',
    OtherHealthConditions: 'Other (we\'ll call you to gather more information)'
  },
  insuranceOnFile: 'No',
  msEnrollInsuranceBeanForm: {
    msInsStatusCd: 4,
    msAllergiesMap: {
      '0': 'true'
    },
    msHealthConditionsMap: {
      '000000': 'true'
    }
  }
};

const formData = {
  planName: '',
  memberNumber: '',
  groupNumber: '',
  cardholderName: '',
  cardholderDOB: ''
};

const validformData = {
  planName: 'dasdsad',
  memberNumber: '3232',
  groupNumber: '4343',
  cardholderName: 'fssdfsdf',
  cardholderDOB: '08/07/1989'
};

const status = {
  insuranceOnFile: 'No'
};

const data = {
  basicProfile: {
    login: 'juvenille.account@testebiz.com',
    email: 'juvenille.account@testebiz.com',
    firstName: 'Juvenille',
    lastName: 'Account',
    dateOfBirth: '01/01/1991',
    homeAddress: {
      street1: '5678 SOUTHERN HILL ROAD,',
      city: 'DEERFIELD',
      state: 'IL',
      zipCode: '60015'
    },
    phone: [
      {
        number: '8473470901',
        phoneId: '2384720058',
        priority: 'P',
        type: 'home'
      }
    ],
    gender: 'Male',
    memberSince: '2019-07-17 13:27:57:0',
    userType: 'RX_AUTH',
    securityQuestion: 'in what city or town was your first job?',
    registrationDate: '2019-07-17 13:27:57:0',
    createdUser: 'ACS_REG'
  },
  profileId: '11942712532',
  acctStatus: 'ACTIVE'
};

const membersList = [
  {
    profileId: '11942712532',
    type: 'Head of Household (You)',
    firstName: 'Prerna',
    lastName: 'Sharma',
    dateOfBirth: '02/13/1999'
  },
  {
    profileId: '11934372238',
    type: 'Adult',
    firstName: 'Aishu',
    lastName: 'Rai',
    dateOfBirth: '02/13/1999'
  },
  {
    profileId: '11936350157',
    type: 'Adult',
    firstName: 'Merlin',
    lastName: 'Barbee',
    dateOfBirth: '05/05/1995'
  },
  {
    profileId: '11936350202',
    type: 'Adult',
    firstName: 'Elmo',
    lastName: 'Daly',
    dateOfBirth: '05/05/1995'
  },
  {
    profileId: '11936760338',
    type: 'Adult',
    firstName: 'Vaisu',
    lastName: 'Ksfjk',
    dateOfBirth: '03/25/1995'
  }
];

describe('NewInsuranceComponent', () => {
  let component: NewInsuranceComponent;
  let fixture: ComponentFixture<NewInsuranceComponent>;
  let _commonUtil: CommonUtil;
  let userService: UserService;
  let spy: any;
  let appContext: AppContext;
  let messageService: MessageService;
  let _common: CommonUtil;
  let _router: Router;
  let _httpService: HttpClientService;
  let debugElement: DebugElement;
  let insureService: NewInsuranceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      providers: [
        AppContext,
        HttpClientService,
        MessageService,
        CommonUtil,
        NewInsuranceService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(NewInsuranceComponent);
        component = fixture.componentInstance;
        _commonUtil = TestBed.get(CommonUtil);
        insureService = TestBed.get(NewInsuranceService);
        appContext = TestBed.get(AppContext);
        userService = TestBed.get(UserService);
        messageService = TestBed.get(MessageService);
        _common = TestBed.get(CommonUtil);
        _router = TestBed.get(Router);
        _httpService = TestBed.get(HttpClientService);
        debugElement = fixture.debugElement;
        spyOn(userService, 'getActiveMemberId').and.returnValue('11942712532');
      });
  }));

  xit('should create the component', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.loadingStatus = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`should call ngOnInit`, () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    sessionStorage.removeItem('insurance_info');
    fixture.detectChanges();
    spy = spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call ngOnInit`, () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    const val = JSON.stringify(retriveInsurValue);
    sessionStorage.setItem('insurance_info', val);
    fixture.detectChanges();
    spy = spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event1 = {
      target: {
        checked: 'true'
      }
    };
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event1, '000000');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event1 = {
      target: {
        checked: 'true'
      }
    };
    component.HealthConditionListMap.set('000000', 'sds');
    component.HealthConditionListMap.set('000001', 'sds');
    component.HealthConditionListMap.set('000002', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event1, '000001');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event1 = {
      target: {
        checked: 'true'
      }
    };
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event1, '0');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event1 = {
      target: {
        checked: 'true'
      }
    };
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event1, '1');
    expect(spy).toHaveBeenCalled();
  });

  it('should call submitInsuranceAndHealthData message=WAG_I_MS_INSURANCE_002', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return { messages: [{ code: 'WAG_I_MS_INSURANCE_002', message: 'success', type: 'INFO' }] }; }
      }));
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData message=else', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return { messages: [{ code: 'WAG_I_MS_INSURANCE_001', message: 'success', type: 'INFO' }] }; }
      }));
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData error', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return {status: 500};
        }
      })
    );
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData', () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.isCheckoutFlow=true;
    fixture.detectChanges();
    insureService.insuranceInfo.healthConditionList = ['Heart Disease'];
    component.submitInsuranceAndHealthData();
  });
  it('should call dobUpdater', () => {
    const event_data = { target: {value: 'test'}};
    component.dobUpdater(event_data);
  });
  it('should call initFakeInsuranceModel', () => {
    // component.insuranceResponse = undefined;
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    // spy = spyOn(component, 'initFakeInsuranceModel').and.callThrough();
    component.initFakeInsuranceModel();
    // expect(spy).toHaveBeenCalled();
  });

  it(`should call redirectToCallBackURlForRegistration`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    spyOn(_common, 'navigate').and.stub();
    fixture.detectChanges();
    spy = spyOn(
      component,
      'redirectToCallBackURlForRegistration'
    ).and.callThrough();
    component.redirectToCallBackURlForRegistration('/regsiter');
    expect(spy).toHaveBeenCalled();
  });

  
  it('should call editAction', () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'editAction').and.callThrough();
    component.editAction();
    expect(spy).toHaveBeenCalled();
  });

  it('should call continueReviewInsurance', () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'continueReviewInsurance').and.callThrough();
    component.continueReviewInsurance();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getPersonName`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'getPersonName').and.callThrough();
    component.getPersonName('profilename arasan vino');
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getPersonName`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'getPersonName').and.callThrough();
    component.getPersonName('');
    expect(spy).toHaveBeenCalled();
  });

  it(`should call continueAction`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    component.continueAction();
  });
  xit(`should call continueAction else`, () => {
    component.insuranceInformationForm.setValue({
      'planName': 'test',
      'memberNumber': 'test',
      'groupNumber': 'test',
      'cardholderName': 'test',
      'cardholderDOB': 'test'
    });
    fixture.detectChanges();
    component.continueAction();
  });
  it(`should call gaEvent`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'gaEvent').and.callThrough();
    component.gaEvent();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getInsuranceInformation`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.activeMember = '11934372238';
    spyOn(component, 'prepareEverything').and.stub();
    // spyOn(userService, 'getActiveMemberId').and.returnValue('11934372238');
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({ status: '200 OK' })
    );
    fixture.detectChanges();
    spy = spyOn(component, 'getInsuranceInformation').and.callThrough();
    component.getInsuranceInformation();
    expect(spy).toHaveBeenCalled();
  });

  it(`should call getInsuranceInformation`, () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.activeMember = '11934372238';
    spyOn(component, 'prepareEverything').and.stub();
    // spyOn(userService, 'getActiveMemberId').and.returnValue('11934372238');
    spyOn(_httpService, 'postData').and.returnValue(Observable.throw('error'));
    component.loadingStatus = true;
    fixture.detectChanges();
    spy = spyOn(component, 'getInsuranceInformation').and.callThrough();
    component.getInsuranceInformation();
    expect(spy).toHaveBeenCalled();
  });

  it('should call submitInsuranceAndHealthData message=WAG_I_MS_INSURANCE_002345', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return { messages: [{ code: 'WAG_I_MS_INSURANCE_002', message: 'success', type: 'INFO' }] }; }
      }));
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData message=else12', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({
        json: () => {
          return { messages: [{ code: 'WAG_I_MS_INSURANCE_001', message: 'success', type: 'INFO' }] }; }
      }));
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData error12', () => {
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.HealthConditionListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({
        json: () => {
          return {status: 500};
        }
      })
    );
    component.submitInsuranceAndHealthData();
  });
  it('should call submitInsuranceAndHealthData34', () => {
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.isCheckoutFlow=true;
    fixture.detectChanges();
    insureService.insuranceInfo.healthConditionList = ['Heart Disease'];
    component.submitInsuranceAndHealthData();
  });
  it('should call dobUpdater1', () => {
    const event_data = { target: {value: 'test'}};
    component.dobUpdater(event_data);
  });
  it('should call initFakeInsuranceModel2', () => {
    // component.insuranceResponse = undefined;
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    // spy = spyOn(component, 'initFakeInsuranceModel').and.callThrough();
    component.initFakeInsuranceModel();
    // expect(spy).toHaveBeenCalled();
  });


});
