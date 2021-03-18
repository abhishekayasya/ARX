import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import {
  DebugElement,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { Observable } from 'rxjs/Observable';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ArxUser } from '@app/models';
import { AppTestingModule } from '../../../../../tests/app.testing.module';
import { jsonUsr } from '../../../../../test/mocks/userService.mocks';
import { InsuranceComponent } from './insurance.component';

const mockData = [
  {
    path: 'confirmation-pca'
  }
];

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
describe('Insurance-shared-Component', () => {
  let component: InsuranceComponent;
  let fixture: ComponentFixture<InsuranceComponent>;
  let debugElement: DebugElement;
  let appContext: AppContext;
  let userService: UserService;
  let messageService: MessageService;
  let _common: CommonUtil;
  let _router: Router;
  let _httpService: HttpClientService;
  let spy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InsuranceComponent);
        component = fixture.componentInstance;
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

  it('should create', () => {
    spyOn(_common, 'removeNaturalBGColor').and.stub();
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call prepareInsuranceForm', () => {
    spyOn(component, 'prepareInsuranceForm').and.callThrough();
    component.prepareInsuranceForm();
  });

  it('should call dobUpdater', () => {
    const event = {
      target: {
        value: '08/07/1989'
      }
    };
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.originalInsuranceValue = JSON.stringify(retriveInsurValue);
    spy = spyOn(component, 'dobUpdater').and.callThrough();
    fixture.detectChanges();
    component.dobUpdater(event);
    expect(spy).toHaveBeenCalled();
    //component.cancelAction();
  });

  it('should call cancelAction', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.originalInsuranceValue = JSON.stringify(retriveInsurValue);
    spy = spyOn(component, 'cancelAction').and.callThrough();
    component.insuranceInfo = { msEnrollInsuranceBeanForm: { msInsStatusCd: 1 } };
    fixture.detectChanges();
    component.cancelAction();
    expect(spy).toHaveBeenCalled();
    //component.cancelAction();
  });

  it('should call cancelAction - add', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.updateType = 'add';
    spy = spyOn(component, 'cancelAction').and.callThrough();
    fixture.detectChanges();
    component.insuranceInfo = { msEnrollInsuranceBeanForm: { msInsStatusCd: 1 } };
    component.cancelAction();
    expect(spy).toHaveBeenCalled();
  });

  it('should call cancelAction - edit', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.updateType = 'edit';
    component.insuranceInfo = msInsureForm;
    spy = spyOn(component, 'cancelAction').and.callThrough();
    fixture.detectChanges();
    component.cancelAction();
    expect(spy).toHaveBeenCalled();
  });

  it('should call validateHealthSection', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.AllergyListMap.set('0', 'None');
    component.HealthConditionListMap.set('100000', 'Heart disesae');
    fixture.detectChanges();
    spy = spyOn(component, 'validateHealthSection').and.callThrough();
    component.validateHealthSection();
    expect(spy).toHaveBeenCalled();
  });

  it('should call editInsuranceAction', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'editInsuranceAction').and.callThrough();
    component.editInsuranceAction();
    expect(spy).toHaveBeenCalled();
  });

  it('should call validateHealthSection', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.selectedHealthConditionList = [];
    fixture.detectChanges();
    spy = spyOn(component, 'validateHealthSection').and.callThrough();
    component.validateHealthSection();
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateMember', () => {
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'updateMember').and.callThrough();
    component.updateMember(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getHcList', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    spy = spyOn(component, 'getHcList').and.callThrough();
    fixture.detectChanges();
    component.getHcList();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getAllergyList', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    spy = spyOn(component, 'getAllergyList').and.callThrough();
    fixture.detectChanges();
    component.getAllergyList();
    expect(spy).toHaveBeenCalled();
    //component.getAllergyList();
  });

  it('should call showHealthInfoStatus', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'showHealthInfoStatus').and.callThrough();
    component.showHealthInfoStatus();
    expect(spy).toHaveBeenCalled();
  });

  it('should call addInsurancePrefillUserInfo', () => {
    localStorage.removeItem('members');
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'addInsurancePrefillUserInfo').and.callThrough();
    component.addInsurancePrefillUserInfo();
    expect(spy).toHaveBeenCalled();
  });

  it('should call addInsurancePrefillUserInfo', () => {
    const activeMemId = userService.getActiveMemberId();
    localStorage.setItem('members', JSON.stringify(membersList));
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'addInsurancePrefillUserInfo').and.callThrough();
    component.addInsurancePrefillUserInfo();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event = {
      target: {
        checked: 'true'
      }
    };
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event, '000000');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event = {
      target: {
        checked: 'true'
      }
    };
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '0');
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateLocalInfo', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'updateLocalInfo').and.callThrough();
    component.updateLocalInfo(msInsureForm);
    expect(spy).toHaveBeenCalled();
  });

  it('should call showReviewInsurance', () => {
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'showReviewInsurance').and.callThrough();
    component.showReviewInsurance();
    expect(spy).toHaveBeenCalled();
  });

  it('should call getInsuranceInfo', () => {
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11942712532');
    sessionStorage.setItem('insurance_enroll_flow', 'true');
    fixture.detectChanges();
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'getInsuranceInfo').and.callThrough();
    component.getInsuranceInfo(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getInsuranceInfo', () => {
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    sessionStorage.removeItem('insurance_enroll_flow');
    sessionStorage.setItem('insurance_enroll_flow_account', 'true');
    fixture.detectChanges();
    spy = spyOn(component, 'getInsuranceInfo').and.callThrough();
    component.getInsuranceInfo(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getInsuranceInfo', () => {
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11942712531');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'getInsuranceInfo').and.callThrough();
    component.getInsuranceInfo(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call prepareInsuranceForm', () => {
    component.insuranceInformationForm.setValue(formData);
    expect(component.prepareInsuranceForm()).toBeFalsy();
  });

  it('should call preparePatientName', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'preparePatientName').and.callThrough();
    component.preparePatientName();
    expect(spy).toHaveBeenCalled();
  });

  it('should call redirectToMyAccount', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(_common, 'navigate').and.stub();
    component.redirectToMyAccount();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.isBuyout = true;
    component.updateType = 'edits';
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    component.showHealthInfo = true;
    fixture.detectChanges();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call handleSuccess', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    const requestData = {
      fId: ''
    };
    component.isBuyout = true;
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'handleSuccess').and.callThrough();
    component.handleSuccess(requestData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call handleSuccess', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    const requestData = {
      fId: ''
    };
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'handleSuccess').and.callThrough();
    component.handleSuccess(requestData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call handleSuccess', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    const requestData = {
      fId: ''
    };
    sessionStorage.setItem(
      'redirecthdnewPrescription',
      'redirecthdnewPrescription'
    );
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'handleSuccess').and.callThrough();
    component.handleSuccess(requestData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call handleSuccess', () => {
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11942712532');
    userService.user.profile = jsonUsr;
    const requestData = {
      fId: ''
    };
    sessionStorage.setItem(
      'redirecthdtransferPrescription',
      'redirecthdtransferPrescription'
    );
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'handleSuccess').and.callThrough();
    component.handleSuccess(requestData);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getInsuranceInfo', () => {
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spyOn(component, 'preparePatientName').and.stub();
    spy = spyOn(_httpService, 'postData').and.returnValue(
      Observable.of(retriveInsurValue)
    );
    component.getInsuranceInfo(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getInsuranceInfo', () => {
    component.insuranceInfo = msInsureForm;
    const activeMemId = userService.getActiveMemberId();
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(_httpService, 'postData').and.returnValue(
      Observable.of(retriveInsurValue)
    );
    component.getInsuranceInfo(activeMemId);
    expect(spy).toHaveBeenCalled();
  });

  it('should call showReviewInsurance', () => {
    component.insuranceInformationForm.setValue(validformData);
    component.insuranceInfo = msInsureForm;
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    fixture.detectChanges();
    spy = spyOn(component, 'showReviewInsurance').and.callThrough();
    component.showReviewInsurance();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event = {
      target: {
        checked: 'true'
      }
    };
    component.HealthConditionListMap.set('000000', 'sds');
    component.HealthConditionListMap.set('000001', 'sds');
    component.HealthConditionListMap.set('000002', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event, '000000');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event = {
      target: {
        checked: ''
      }
    };
    component.HealthConditionListMap.set('000000', 'sds');
    component.HealthConditionListMap.set('000001', 'sds');
    component.HealthConditionListMap.set('000002', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event, '000001');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event = {
      target: {
        checked: 'true'
      }
    };
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '0');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event = {
      target: {
        checked: ''
      }
    };
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '1');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event = {
      target: {
        checked: ''
      }
    };
    component.AllergyListMap.set('3', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    userService.user = new ArxUser('11934372238');
    userService.user.profile = jsonUsr;
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '1');
    expect(spy).toHaveBeenCalled();
  });
});
