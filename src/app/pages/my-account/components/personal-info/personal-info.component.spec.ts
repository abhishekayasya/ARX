import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from '../../../../../../tests/app.testing.module';
import { CommonUtil } from '@app/core/services/common-util.service';
import { UserService } from '@app/core/services/user.service';
import { RegistrationService } from '@app/core/services/registration.service';
import { HttpClientService } from '@app/core/services/http.service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import {
  INSURANCE_DATA,
  MOCK_RESPONSE1,
  MOCK_RESPONSE2
} from '../../../../../../tests/insurance.model';
import { PersonalInfoComponent } from './personal-info.component';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { ArxUser } from '@app/models/user.model';
import {
  jsonUsr,
  u_info
} from '../../../../../../test/mocks/userService.mocks';
import { Validators, FormArray } from '@angular/forms';
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

describe('PersonalInfoComponent', () => {
  let component: PersonalInfoComponent;
  let _messageService: MessageService;
  let fixture: ComponentFixture<PersonalInfoComponent>;
  let _commonUtil: CommonUtil;
  let _userService: UserService;
  let _regService: RegistrationService;
  let _httpService: HttpClientService;
  let _gaService: GaService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalInfoComponent],
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PersonalInfoComponent);
        component = fixture.componentInstance;
        _messageService = TestBed.get(MessageService);
        _gaService = TestBed.get(GaService);
        _commonUtil = TestBed.get(CommonUtil);
        _userService = TestBed.get(UserService);
        _regService = TestBed.get(RegistrationService);
        _httpService = TestBed.get(HttpClientService);
        _userService.user = new ArxUser('11948190939');
        _userService.user.profile = jsonUsr;
        spyOn(_userService, 'getActiveMemberId').and.returnValue('11948190939');
        fixture.detectChanges();
      });
  }));

  it('should create PersonalInfoComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`Should call gaEvent`, () => {
    component.gaEvent('test');
  });

  it(`Should call gaEvent`, () => {
    component.gaEvent('test', 'test');
  });

  it('Should call fireAddNewPhoneNumberGaEvent', () => {
    component.fireAddNewPhoneNumberGaEvent();
  });

  it('Should call fireSavePersonalInfoGaEvent', () => {
    component.fireSavePersonalInfoGaEvent();
  });

  it('Should call fireCancelEditPersonalInfoGaEvent', () => {
    component.fireCancelEditPersonalInfoGaEvent();
  });

  it('Should call fireupdateFamilyMemberGaEvent', () => {
    component.fireupdateFamilyMemberGaEvent();
    fixture.detectChanges();
    component.activeMember = 'addMember';
    component.fireupdateFamilyMemberGaEvent();
  });

  it('Should call updateMember', () => {
    component.updateMember('test');
  });

  it('Should call getPersonalInfo', () => {
    spyOn(component, 'setPersonalInfoData').and.stub();
    spyOn(_httpService, 'postData').and.returnValue(
      Observable.of({
        status: '200 OK'
      })
    );
    component.getPersonalInfo('11948190939');
  });

  it('Should call getAreaCode', () => {
    component.getAreaCode('00000000000');
  });

  it('Should call getNumberWithoutAreaCode', () => {
    component.getNumberWithoutAreaCode('00000000000');
  });

  it('Should call setPersonalInfoData', () => {
    component.setPersonalInfoData(jsonUsr);
  });

  it('Should call setPersonalInfoData', () => {
    component.firstName = 'test';
    component.lastName = 'test';
    component.dateOfBirth = '01-01-2000';
    component.gender = 'gfghdf';
    const jsonUsr1 = {
      basicProfile: {
        dateOfBirth: '',
        email: 'adff.@afsdf.com',
        userName: 'sdaff',
        login: 'dgg',
        lastName: '',
        firstName: '',
        gender: '',
        memberSince: '',
        oldEmail: 'fgdh@hgsdg.com',
        phone: [
          {
            number: '1234567899',
            phoneId: 'h',
            priority: 'high',
            type: 'home'
          }
        ],
        securityQuestion: 'tryert',
        userType: ''
      },
      profileId: 'dsfgsd',
      regType: 'fgdh'
    };

    component.setPersonalInfoData(jsonUsr1);
  });

  it('Should call setPersonalInfoData', () => {
    const jsonUsr1 = {
      basicProfile: {
        dateOfBirth: '',
        email: 'adff.@afsdf.com',
        userName: 'sdaff',
        login: 'dgg',
        lastName: '',
        firstName: '',
        gender: '',
        memberSince: '',
        oldEmail: 'fgdh@hgsdg.com',

        homeAddress: {},
        phone: [
          {
            number: '1234567899',
            phoneId: 'h',
            priority: 'high',
            type: 'home'
          }
        ],
        securityQuestion: 'tryert',
        userType: ''
      },
      profileId: 'dsfgsd',
      regType: 'fgdh'
    };

    component.setPersonalInfoData(jsonUsr1);
  });

  it('Should call setPersonalInfoData', () => {
    component.setPersonalInfoData(u_info);
  });

  it('Should call prepareZipAndAddOnZip', () => {
    component.prepareZipAndAddOnZip(u_info.basicProfile.homeAddress);
  });

  it('Should call prepareZipAndAddOnZip', () => {
    const homeAddress = {
      street1: '49 SURYA ENCLAVE  TRIMULGHERRY, ',
      city: 'HYDERABAD',
      state: 'TX',
      zipCode: '50001'
    };
    component.prepareZipAndAddOnZip(homeAddress);
  });

  it('Should call firePersonalInfoEditGaEvent', () => {
    component.firePersonalInfoEditGaEvent();
  });

  it('Should call cancelEdit', () => {
    const e = jasmine.createSpyObj('e', ['preventDefault']);
    component.cancelEdit(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('Should call editPersonalInfo', () => {
    const e = jasmine.createSpyObj('e', ['preventDefault']);
    component.editPersonalInfo(e);
    expect(e.preventDefault).toHaveBeenCalled();
  });

  it('Shpuld call savePersonalInfo without form fields', () => {
    component.savePersonalInfo({ preventDefault: () => {} });
  });

  it('Shpuld call savePersonalInfo -> else block', () => {
    spyOn(component, 'fireSavePersonalInfoGaEvent').and.stub();
    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());
    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: 'home',
      alternateNumFields: [
        {
          number: '1234567890',
          type: ''
        }
      ],
      aptSuite: ''
    });
    component.savePersonalInfo({ preventDefault: () => {} });
  });
  it('Shpuld call savePersonalInfo', () => {
    spyOn(_httpService, 'putData').and.returnValue(
      Observable.of({
        status: 'success',
        messages: [
          { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
        ]
      })
    );
    spyOn(component, 'fireSavePersonalInfoGaEvent').and.stub();
    spyOn(_commonUtil, 'scrollTop').and.stub();
    spyOn(component, 'setPersonalInfoData').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();

    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());

    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: 'home',
      alternateNumFields: [
        {
          number: '1234567890',
          type: 'work'
        }
      ],
      aptSuite: ''
    });
    component.savePersonalInfo({ preventDefault: () => {} });
  });

  it('Shpuld call savePersonalInfo -> else block', () => {
    spyOn(_httpService, 'putData').and.returnValue(
      Observable.of({
        status: 'success1',
        messages: [
          { code: 'WAG_I_LOGIN_10000', message: 'Login success', type: 'INFO' }
        ]
      })
    );
    spyOn(component, 'fireSavePersonalInfoGaEvent').and.stub();
    spyOn(_commonUtil, 'scrollTop').and.stub();
    spyOn(component, 'setPersonalInfoData').and.stub();
    spyOn(_messageService, 'addMessage').and.stub();

    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());

    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: 'home',
      alternateNumFields: [
        {
          number: '1234567890',
          type: 'work'
        }
      ],
      aptSuite: ''
    });
    component.savePersonalInfo({ preventDefault: () => {} });
  });

  it('Should call savePersonalInfo -> error block', () => {
    spyOn(_httpService, 'putData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.savePersonalInfo({ preventDefault: () => {} });
  });

  it(`Should call validatePhoneType`, () => {
    component.validatePhoneType();
  });

  it(`Should call validatePhoneType`, () => {
    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());
    control.push(component.createItem());
    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: '',
      alternateNumFields: [
        {
          number: '1234567890',
          type: 'work'
        },
        {
          number: '1234567891',
          type: 'cell'
        }
      ],
      aptSuite: ''
    });
    component.validatePhoneType();
  });

  it(`Should call validatePhoneType`, () => {
    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());
    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: '',
      alternateNumFields: [
        {
          number: '1234567890',
          type: ''
        }
      ],
      aptSuite: ''
    });
    component.validatePhoneType();
  });

  it(`Should call validatePhoneType`, () => {
    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());
    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '8489798797',
      phoneType: 'work',
      alternateNumFields: [
        {
          number: '1234567890',
          type: 'work'
        }
      ],
      aptSuite: ''
    });
    component.validatePhoneType();
  });

  it('Should call patchPersonalInfoForm', () => {
    component.initialisePersonalInfoForm();
    component.aptSuite = 'test';
    component.patchPersonalInfoForm();
    component.aptSuite = '';
    component.patchPersonalInfoForm();
  });

  it('Should call patchPersonalInfoForm', () => {
    component.initialisePersonalInfoForm();
    const control = <FormArray>(
      component.personalInfoForm.controls['alternateNumFields']
    );
    control.push(component.createItem());
    control.push(component.createItem());
    component.personalInfoForm.setValue({
      street: '09 PIES ROAD',
      city: 'ADDISON',
      state: 'TX',
      zipCode: '75001',
      addOnZipCode: '',
      primaryPhone: '1234567890',
      phoneType: 'work',
      alternateNumFields: [
        {
          number: '1234567890',
          type: 'work'
        },
        {
          number: '1234567891',
          type: 'cell'
        }
      ],
      aptSuite: ''
    });
    component.primaryNumber = {
      primaryPhone: '1234567890'
    };
    component.alternateNumbers = [
      {
        number: '1234567890',
        type: 'work'
      },
      {
        number: '1234567891',
        type: 'cell'
      }
    ];
    component.patchPersonalInfoForm();
  });

  it('Should call addItem', () => {
    component.addItem();
  });

  // it('should call validatePhone', () => {
  //     component.initialisePersonalInfoForm();
  //   const control = <FormArray>(
  //     component.personalInfoForm.controls['alternateNumFields']
  //   );
  //   control.push(component.createItem());
  //   control.push(component.createItem());
  //   component.personalInfoForm.setValue({
  //     street: '09 PIES ROAD',
  //     city: 'ADDISON',
  //     state: 'TX',
  //     zipCode: '75001',
  //     addOnZipCode: '626005',
  //     primaryPhone: '1234567890',
  //     phoneType: 'work',
  //     alternateNumFields: [
  //       {
  //         number: '1234567890',
  //         type: 'work'
  //       },
  //       {
  //         number: '1234567891',
  //         type: 'cell'
  //       },
  //     ],
  //     aptSuite: ''
  //   });
  //   component.validatePhone();
  // });

  //   it('should call validatePhone', () => {
  //     component.initialisePersonalInfoForm();
  //   const control = <FormArray>(
  //     component.personalInfoForm.controls['alternateNumFields']
  //   );
  //   control.push(component.createItem());
  //   component.personalInfoForm.setValue({
  //     street: '09 PIES ROAD',
  //     city: 'ADDISON',
  //     state: 'TX',
  //     zipCode: '75001',
  //     addOnZipCode: '',
  //     primaryPhone: '1234567890',
  //     phoneType: 'work',
  //     alternateNumFields: [
  //       {
  //         number: '123456789',
  //         type: 'work'
  //       },
  //     ],
  //     aptSuite: ''
  //   });
  //   component.validatePhone();
  // });

  // it('should call validatePhone', () => {
  //   component.initialisePersonalInfoForm();
  // const control = <FormArray>(
  //   component.personalInfoForm.controls['alternateNumFields']
  // );
  // control.push(component.createItem());
  // component.personalInfoForm.setValue({
  //   street: '09 PIES ROAD',
  //   city: 'ADDISON',
  //   state: 'TX',
  //   zipCode: '75001',
  //   addOnZipCode: '',
  //   primaryPhone: '1234567890',
  //   phoneType: 'work',
  //   alternateNumFields: [
  //     {
  //       number: '1234567890',
  //       type: 'work'
  //     },
  //   ],
  //   aptSuite: ''
  // });
  // component.validatePhone();
  // });

  // it('should call validatePhone', () => {
  //   component.initialisePersonalInfoForm();
  // const control = <FormArray>(
  //   component.personalInfoForm.controls['alternateNumFields']
  // );
  // control.push(component.createItem());
  // control.push(component.createItem());
  // component.personalInfoForm.setValue({
  //   street: '09 PIES ROAD',
  //   city: 'ADDISON',
  //   state: 'TX',
  //   zipCode: '75001',
  //   addOnZipCode: '',
  //   primaryPhone: '1234567890',
  //   phoneType: 'work',
  //   alternateNumFields: [
  //     {
  //       number: '1234567890',
  //       type: 'work'
  //     },
  //     {
  //       number: '1234567892',
  //       type: 'cell'
  //     },
  //   ],
  //   aptSuite: ''
  // });
  // component.validatePhone();
  // });
});
