import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyInsuranceComponent } from './insurance.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { Validators, FormBuilder } from '@angular/forms';
import { ValidateDate } from '@app/shared/validators/date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { of } from 'rxjs/observable/of';

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
const msInsure1Form = {
  msEnrollInsuranceBeanForm: {
    planName: 'xzczx',
    memberNumber: 1,
    groupNumber: 'zxc',
    msInsGroupNbr: 'xzvczx',
    cardholderName: 'Juvenille Account',
    cardholderDOB: '01',
    msInsCardholderBirthMonth: '01',
    msInsCardholderBirthYear: 1991
  },
  allergysList: ['Penicillin'],
  healthConditionList: ['Heart Disease'],
  flow: 'ARX'
};

describe('FamilyInsuranceComponent', () => {
  let component: FamilyInsuranceComponent;
  let _userService: UserService;
  let fixture: ComponentFixture<FamilyInsuranceComponent>;
  let spy: any;
  let _common: CommonUtil;
  let router;
  let _formBuilder: FormBuilder;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyInsuranceComponent],
      imports: [AppTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ mid: 'test', type: 'add' })
          }
        }
      ],
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
        fixture = TestBed.createComponent(FamilyInsuranceComponent);
        component = fixture.componentInstance;
        _common = TestBed.get(CommonUtil);
        (_formBuilder = TestBed.get(FormBuilder)),
          (router = TestBed.get(Router));
      });
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    fixture.detectChanges();
    component.ngOnInit();
  });
  it('should call getHcList', () => {
    component.insuranceInfo = retriveInsurValue;
    spy = spyOn(component, 'getHcList').and.callThrough();
    fixture.detectChanges();
    component.getHcList();
    expect(spy).toHaveBeenCalled();
  });
  it('should call getHcArray', () => {
    component.insuranceInfo = retriveInsurValue;
    spy = spyOn(component, 'getHcArray').and.callThrough();
    fixture.detectChanges();
    component.getHcArray();
    expect(spy).toHaveBeenCalled();
  });
  it('should call getAllergyList', () => {
    component.insuranceInfo = retriveInsurValue;
    spy = spyOn(component, 'getAllergyList').and.callThrough();
    fixture.detectChanges();
    component.getAllergyList();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event = {
      target: {
        checked: 'true'
      }
    };
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event, '000000');
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
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onHcItemClick').and.callThrough();
    component.onHcItemClick(event, '000001');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onHcItemClick', () => {
    const event = {
      target: {
        // checked: 'true'
      }
    };
    component.HealthConditionListMap.set('000000', 'sds');
    component.HealthConditionListMap.set('000001', 'sds');
    component.HealthConditionListMap.set('000002', 'sdsd');
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
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '0');
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
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '1');
    expect(spy).toHaveBeenCalled();
  });

  it('should call onAllergyItemClick', () => {
    const event = {
      target: {
        //checked: 'false'
      }
    };
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    component.insuranceInfo = retriveInsurValue;
    fixture.detectChanges();
    spy = spyOn(component, 'onAllergyItemClick').and.callThrough();
    component.onAllergyItemClick(event, '1');
    expect(spy).toHaveBeenCalled();
  });

  it('should call dobUpdater', () => {
    component.insuranceInfo = msInsureForm;
    const event = {
      target: {
        checked: 'true'
      }
    };
    fixture.detectChanges();
    component.dobUpdater(event);
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    component.updateType = 'edits';
    fixture.detectChanges();
    spyOn(_common, 'navigate').and.stub();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should call sendUpdateInsuranceRequest', () => {
    const dateConfig = new DateConfigModel();
    component.insuranceInfo = msInsureForm;
    component.insuranceInformationForm = _formBuilder.group({
      planName: ['', Validators.required],
      memberNumber: ['', Validators.required],
      groupNumber: [''],
      cardholderName: ['', Validators.required],
      cardholderDOB: ['', [Validators.required, ValidateDate(dateConfig)]]
    });
    fixture.detectChanges();
    component.AllergyListMap.set('0', 'sds');
    component.AllergyListMap.set('1', 'sds');
    component.AllergyListMap.set('2', 'sdsd');
    component.HealthConditionListMap.set('000000', 'sds');
    component.HealthConditionListMap.set('000001', 'sds');
    component.HealthConditionListMap.set('000002', 'sdsd');
    spy = spyOn(component, 'sendUpdateInsuranceRequest').and.callThrough();
    component.sendUpdateInsuranceRequest();
    expect(spy).toHaveBeenCalled();
  });

  it('should execute confirmAction', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    component.confirmAction();
  });
  it('should call updateLocalInfo', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'updateLocalInfo').and.callThrough();
    component.updateLocalInfo(msInsureForm);
    expect(spy).toHaveBeenCalled();
  });
  it('should call editInsuranceAction', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'editInsuranceAction').and.callThrough();
    component.editInsuranceAction();
    expect(spy).toHaveBeenCalled();
  });
  it('should call preparePatientName', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(component, 'preparePatientName').and.callThrough();
    component.preparePatientName();
    expect(spy).toHaveBeenCalled();
  });

  it('should call prepareInsuranceSubmitRequestData', () => {
    component.insuranceInfo = msInsureForm;
    fixture.detectChanges();
    spy = spyOn(
      component,
      'prepareInsuranceSubmitRequestData'
    ).and.callThrough();
    component.prepareInsuranceSubmitRequestData();
    expect(spy).toHaveBeenCalled();
  });
});
