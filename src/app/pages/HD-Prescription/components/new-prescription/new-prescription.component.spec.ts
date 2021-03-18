import { jsonUsr } from './../../../../../../test/mocks/userService.mocks';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';
import { HttpClientService } from '@app/core/services/http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '@app/core/services/user.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { DebugElement, OnInit } from '@angular/core';
import { NewPrescriptionComponent } from './new-prescription.component';
import { SharedModule } from '@app/shared/shared.module';
import { GaService } from '@app/core/services/ga-service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { ArxUser } from '@app/models/user.model';
import { of } from 'rxjs/observable/of';
import { prescriptions } from '../../../../../../test/mocks/prescriptions';
const mockData = [
  {
    profileId: '200000300021',
    type: 'Head of Household (You)',
    firstName: 'Patrestart',
    lastName: 'Patrestart',
    dateOfBirth: '05/06/1987'
  },
  {
    profileId: '11948190939',
    type: 'Adult',
    firstName: 'Patpccone',
    lastName: 'Patpccone',
    dateOfBirth: '05/06/1987'
  }
];
describe('NewPrescriptionComponent', () => {
  let component: NewPrescriptionComponent;
  let fixture: ComponentFixture<NewPrescriptionComponent>;
  let debugElement: DebugElement;
  let userservice: UserService;
  let httpservice;
  let router: Router;
  let commonutil;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewPrescriptionComponent],
      imports: [
        SharedModule,
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
        DatePipe,
        AppContext,
        HttpClientService,
        { provide: APP_BASE_HREF, useValue: '/' },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { IsmultipleMember: mockData } } }
        },
        CommonUtil,
        CookieService,
        UserService,
        CheckoutService,
        GaService
      ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrescriptionComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    httpservice = TestBed.get(HttpClientService);
    userservice = TestBed.get(UserService);
    userservice.user = new ArxUser('11948190939');
    userservice.user.firstName = 'testFirst';
    userservice.user.lastName = 'test';
    userservice.user.dateOfBirth = '01-01-2000';
    userservice.user.phoneNumber = '1234567899';
    userservice.user.profile = jsonUsr;
    router = TestBed.get(Router);
    commonutil = TestBed.get(CommonUtil);
  });
  it('should create app component', () => {
    expect(component).toBeTruthy();
  });
  it('should able to  ngOnInit', () => {
    sessionStorage.setItem('insuranceNewBanerStatus', 'true');
    component.ngOnInit();
  });
  it('should execute convertDateFormat', () => {
    const DOJ = new Date();
    component.convertDateFormat(DOJ);
  });

  it('should execute getInsuranceStatus', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(httpservice, 'postData').and.callFake(() => {
      return of({ insuranceOnFile: 'No' });
    });
    component.getInsuranceStatus();
    localStorage.setItem('insuranceOnData', 'No');
  });
  it('Should execute  getInsuranceStatus error', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(httpservice, 'postData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getInsuranceStatus();
  });
  it('should execute EditPrescription ', () => {
    spyOn(sessionStorage, 'getItem').and.callFake(() => {
      return JSON.stringify(prescriptions);
    });
    component.newprescriptionForm.patchValue({
      newprescriptionFormFields: [
        {
          doctorName: 'xxx',
          doctorphone: 'xxx',
          drugname: 'xxx',
          quantity: 'xxx',
          terms: ['', '']
        }
      ]
    });
    component.EditPrescription();
  });
  it('should execute ViewMoreaction', () => {
    component.ViewMoreaction();
  });
  it('should execute ViewMoreaction else', () => {
    component.viewless = false;
    component.ViewMoreaction();
  });
  it('should execute getActiveMemberName', () => {
    component.memberjson = [jsonUsr];
    component.getActiveMemberName();
  });
  it('should able to  Callformsubmit return empty', () => {
    component.Callformsubmit();
  });
  it('should able to  Callformsubmit getActiveMember', () => {
    spyOn(router, 'navigateByUrl').and.stub();
    spyOn(commonutil, 'convertDataFormat').and.stub();
    sessionStorage.setItem('fm_info', 'true');
    component.newprescriptionForm.patchValue({
      doctorName: 'xxx',
      doctorphone: 'xxx',
      drugname: 'xxx',
      quantity: 'xxx',
      terms: ['', '']
    });
    component.Callformsubmit();
  });
  it('should execute CallCancelAction', () => {
    component.CallCancelAction({ preventDefault: () => {} });
  });
  it('should execute CallRemoveAction', () => {
    component.CallRemoveAction(1);
  });
  it('should execute changedGenericEquivalentCheckBox', () => {
    component.changedGenericEquivalentCheckBox(
      { target: { checked: true } },
      1
    );
  });
  it('should execute changedGenericEquivalentCheckBox false', () => {
    component.changedGenericEquivalentCheckBox(
      { target: { checked: false } },
      1
    );
  });
  it('should execute updateRxModalstate', () => {
    component.updateRxModalstate({});
  });
  it('should execute updateDeleteModalstate', () => {
    component.updateDeleteModalstate({});
  });
  it('should execute closeremoveModal for yes', () => {
    component.closeremoveModal({ preventDefault: () => {} }, 'yes', 1);
  });
  it('should execute closeremoveModal for yes curentindex empty', () => {
    component.closeremoveModal({ preventDefault: () => {} }, 'yes', '');
  });
  it('should execute closeremoveModal for No', () => {
    component.closeremoveModal({ preventDefault: () => {} }, 'no', 1);
  });
  it('should execute closecancelModal for no', () => {
    component.closecancelModal({ preventDefault: () => {} }, 'no');
  });
  it('should execute callAddAnother', () => {
    component.newprescriptionForm.patchValue({
      doctorName: 'xxx',
      doctorphone: 'xxx',
      drugname: 'xxx',
      quantity: 'xxx',
      terms: ['', '']
    });
    component.callAddAnother({ preventDefault: () => {} });
  });
  it('should execute changeAction', () => {
    spyOn(document, 'getElementById').and.callFake(function() {
      return {
        style: { display: 'none' }
      };
    });
    const index = 1;
    component.changeAction(index, 'test');
    expect(document.getElementById).toHaveBeenCalledWith(
      'priscriber_inform_' + index
    );
    expect(document.getElementById).toHaveBeenCalledWith(
      'Change_fields_' + index
    );
  });
  it('should execute getDrugs', () => {
    const eventdata = { target: { value: 'test', id: 1 } };
    const data = {
      drugTypeAheadResult: {
        result: 'xxx'
      }
    };
    spyOn(httpservice, 'getData').and.callFake(() => {
      return of(data);
    });
    component.getDrugs(eventdata);
  });
  it('should execute getDrugs error', () => {
    const eventdata = { target: { value: 'test', id: 1 } };
    spyOn(httpservice, 'getData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.getDrugs(eventdata);
  });
  it('should execute getDrugs else', () => {
    const eventdata = { target: { value: undefined } };
    component.getDrugs(eventdata);
  });
  it('should execute selectSuggestion', () => {
    const index = undefined;
    const itemdata = { test: 'test' };
    component.selectSuggestion(itemdata, {}, index);
  });
  it('should execute getPatientInfo ', () => {
    component.getPatientInfo(1);
  });
  it('Should execute - updateMember', () => {
    spyOn(component, 'getPatientInfo').and.returnValue([
      { firstName: 'firstName', lastName: 'lastName' }
    ]);
    component.updateMember({ preventDefault: () => {} });
  });
  it('should execute fireupdateFamilyMemberGaEvent ', () => {
    component.fireupdateFamilyMemberGaEvent();
  });
  it('should execute firePhoneNumberSpecialtyPharmacyGaEvent ', () => {
    component.firePhoneNumberSpecialtyPharmacyGaEvent();
  });
  it('should execute fireSignedinHdNewRxGAEvent ', () => {
    component.fireSignedinHdNewRxGAEvent();
  });
  it('should execute fireRxFaxFormEngGaEvent', () => {
    component.fireRxFaxFormEngGaEvent();
  });
  it('should execute fireRxFaxFormSpanishGaEvent', () => {
    component.fireRxFaxFormSpanishGaEvent();
  });
  it('should execute fireChangeDoctorInformationGAEvent', () => {
    component.fireChangeDoctorInformationGAEvent();
  });
  it('should execute onCloseBanner ', () => {
    component.onCloseBanner();
  });
  it('should execute emptySuggestions ', () => {
    component.emptySuggestions();
  });
  it(`Doctor's first and last name validity`, () => {
    let errors = {};
    const doctorName = component.newprescriptionForm.controls['doctorName'];
    expect(doctorName.valid).toBeFalsy();
    errors = doctorName.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it(`Doctor’s phone number validity`, () => {
    let errors = {};
    const doctorphone = component.newprescriptionForm.controls['doctorphone'];
    expect(doctorphone.valid).toBeFalsy();
    errors = doctorphone.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it(`Drug name and strength validity`, () => {
    let errors = {};
    const drugname = component.newprescriptionForm.controls['drugname'];
    expect(drugname.valid).toBeFalsy();
    errors = drugname.errors || {};
    expect(errors['required']).toBeTruthy();
  });
});
