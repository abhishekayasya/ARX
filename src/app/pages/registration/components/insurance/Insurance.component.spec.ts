import { InsuranceComponent } from './insurance.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { InsuranceService } from './insurance.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import {
  INSURANCE_DATA,
  MOCK_RESPONSE1,
  MOCK_RESPONSE2
} from '../../../../../../tests/insurance.model';
const event = {
  target: {
    checked: true
  }
};

const event1 = {
  target: {
    checked: false
  }
};
describe('InsuranceComponent', () => {
  let component: InsuranceComponent;
  let fixture: ComponentFixture<InsuranceComponent>;
  let _commonUtil: CommonUtil;
  let _userService: UserService;
  let _insuranceService: InsuranceService;
  let _regService: RegistrationService;
  let _httpService: HttpClientService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InsuranceComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InsuranceComponent);
        component = fixture.componentInstance;
        _commonUtil = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _insuranceService = TestBed.get(InsuranceService);
        _regService = TestBed.get(RegistrationService);
        _httpService = TestBed.get(HttpClientService);
        fixture.detectChanges();
      });
  }));

  it('should create InsuranceComponent component', () => {
    expect(component).toBeTruthy();
  });
  it(`Should call gaEvent`, () => {
    component.gaEvent();
    expect(component).toBeTruthy();
  });
  it('Should call redirectToCallBackURlForRegistration', () => {
    spyOn(_commonUtil, 'navigate').and.stub();
    component.redirectToCallBackURlForRegistration('test');
    expect(component).toBeTruthy();
  });

  it(`Should call preparePrefillInfoLocally`, () => {
    _userService.user = new ArxUser('11948190939');
    _userService.user.profile = jsonUsr;
    component.preparePrefillInfoLocally();
    expect(component).toBeTruthy();
  });

  it(`Should call getPersonName`, () => {
    component.getPersonName('test test');
    expect(component).toBeTruthy();
  });
  it(`Should call initFakeInsuranceModel`, () => {
    component.initFakeInsuranceModel();
    expect(component).toBeTruthy();
  });

  it(`Should call dobUpdater`, () => {
    const events = {
      target: {
        value: 'test'
      }
    };
    component.dobUpdater(event);
    component.insuranceInformationForm.patchValue({
      cardholderDOB: events.target.value
    });
    expect(component).toBeTruthy();
  });

  it(`Should call continueAction`, () => {
    spyOn(_insuranceService, 'cacheInsuranceInformation').and.stub();
    component.insuranceInformationForm.reset();
    component.continueAction();
    fixture.detectChanges();
    component.insuranceInformationForm.setValue(INSURANCE_DATA);
    component.continueAction();
    fixture.detectChanges();
    component.insuranceInforStatus = true;
    expect(component.insuranceInforStatus).toBeTruthy();
  });

  it(`Should call getHcList`, () => {
    component.insuranceResponse.HealthConditionMap = {
      key: 'Krunal',
      text: 'IT Engineer'
    };
    component.getHcList();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it(`Should call getAllergyList`, () => {
    component.insuranceResponse.AllergyMap = {
      key: 'Krunal',
      text: 'IT Engineer'
    };
    component.getAllergyList();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call onHcItemClick`, () => {
    component.insuranceResponse.HealthConditionMap = {
      '000000': 'Test'
    };
    component.onHcItemClick(event, '000000');
    fixture.detectChanges();
    component.onHcItemClick(event1, '000000');
    fixture.detectChanges();

    component.HealthConditionListMap.set('000000', 'Test1');
    component.HealthConditionListMap.set('111111', 'Test2');
    component.HealthConditionListMap.set('111112', 'Test3');
    component.HealthConditionListMap.set('111113', 'Test4');
    component.onHcItemClick(event, '000001');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call onAllergyItemClick`, () => {
    component.insuranceResponse.AllergyMap = {
      '0': 'Test'
    };
    component.onAllergyItemClick(event, '0');
    fixture.detectChanges();
    component.onAllergyItemClick(event1, '0');
    fixture.detectChanges();

    component.AllergyListMap.set('0', 'Test1');
    component.AllergyListMap.set('1', 'Test2');
    component.AllergyListMap.set('2', 'Test3');
    component.AllergyListMap.set('3', 'Test4');
    component.onAllergyItemClick(event, '1');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call submitInsuranceAndHealthData`, () => {
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MOCK_RESPONSE1 })
    );
    spyOn(_regService, 'enableLoader').and.callThrough();
    component.AllergyListMap.clear();
    component.HealthConditionListMap.clear();
    component.submitInsuranceAndHealthData();
    fixture.detectChanges();

    component.AllergyListMap.set('0', 'Test1');
    component.AllergyListMap.set('1', 'Test2');
    component.AllergyListMap.set('2', 'Test3');
    component.AllergyListMap.set('3', 'Test4');

    component.HealthConditionListMap.set('000000', 'Test1');
    component.HealthConditionListMap.set('111111', 'Test2');
    component.HealthConditionListMap.set('111112', 'Test3');
    component.HealthConditionListMap.set('111113', 'Test4');

    component.submitInsuranceAndHealthData();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call submitInsuranceAndHealthData -> check message`, () => {
    const res = {};
    spyOn(_commonUtil, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => res })
    );
    spyOn(_regService, 'enableLoader').and.callThrough();
    component.AllergyListMap.clear();
    component.HealthConditionListMap.clear();
    component.submitInsuranceAndHealthData();
    fixture.detectChanges();
    component.AllergyListMap.set('0', 'Test1');
    component.AllergyListMap.set('1', 'Test2');
    component.AllergyListMap.set('2', 'Test3');
    component.AllergyListMap.set('3', 'Test4');
    component.HealthConditionListMap.set('000000', 'Test1');
    component.HealthConditionListMap.set('111111', 'Test2');
    component.HealthConditionListMap.set('111112', 'Test3');
    component.HealthConditionListMap.set('111113', 'Test4');
    component.submitInsuranceAndHealthData();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call submitInsuranceAndHealthData -> check error message`, () => {
    const res = {};
    spyOn(_commonUtil, 'navigate').and.stub();
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.reject({ _body: JSON.stringify(res) })
    );
    spyOn(_regService, 'enableLoader').and.callThrough();
    component.AllergyListMap.clear();
    component.HealthConditionListMap.clear();
    component.submitInsuranceAndHealthData();
    fixture.detectChanges();
    component.AllergyListMap.set('0', 'Test1');
    component.AllergyListMap.set('1', 'Test2');
    component.AllergyListMap.set('2', 'Test3');
    component.AllergyListMap.set('3', 'Test4');
    component.HealthConditionListMap.set('000000', 'Test1');
    component.HealthConditionListMap.set('111111', 'Test2');
    component.HealthConditionListMap.set('111112', 'Test3');
    component.HealthConditionListMap.set('111113', 'Test4');
    component.submitInsuranceAndHealthData();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call getInsuranceInformation`, () => {
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MOCK_RESPONSE1 })
    );
    // { status: '200 OK', insuranceOnFile: 'Yes' }
    spyOn(_httpService, 'postData').and.callFake(() => {
      return Observable.of({ status: '200 OK', isPrimeSSOFlow: 'Yes' });
    });
    component.getInsuranceInformation();
    expect(component).toBeTruthy();
  });

  it(`Should call getInsuranceInformation check message fields`, () => {
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => MOCK_RESPONSE2 })
    );
    spyOn(_httpService, 'postData').and.callFake(() => {
      return Observable.of({ status: '200 OK', isPrimeSSOFlow: 'Yes' });
    });
    component.getInsuranceInformation();
    expect(component).toBeTruthy();
  });

  it(`Should call getInsuranceInformation check message fields`, () => {
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => () => {} })
    );
    spyOn(_httpService, 'postData').and.callFake(() => {
      return Observable.of({ status: '200 OK', isPrimeSSOFlow: 'Yes' });
    });
    component.getInsuranceInformation();
    expect(component).toBeTruthy();
  });

  it(`Should call getInsuranceInformation => set  isSSO false `, () => {
    _userService.user = new ArxUser('11948190939');
    spyOn(_httpService, 'doPost').and.returnValue(
      Promise.resolve({ json: () => () => {} })
    );
    spyOn(_httpService, 'postData').and.callFake(() => {
      return Observable.of({ status: '200 OK', isPrimeSSOFlow: 'No' });
    });

    component.getInsuranceInformation();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('Should call error response', () => {
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    _userService.user = new ArxUser('11948190939');
    _userService.user.profile = jsonUsr;
    component.getInsuranceInformation();
    expect(component).toBeTruthy();
  });
});
