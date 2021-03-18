import {
  APP_BASE_HREF,
  DatePipe,
  Location,
  LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { DebugElement, ElementRef } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync
} from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { Microservice } from '@app/config';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { HttpClientService } from '@app/core/services/http.service';
import { MessageService } from '@app/core/services/message.service';
import { UserService } from '@app/core/services/user.service';
import { ArxUser } from '@app/models/user.model';
import { CookieService } from 'ngx-cookie-service';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { prescriptions } from '../../../../../../test/mocks/prescriptions';
import {
  jsonUsr,
  memberData,
  u_info
} from '../../../../../../test/mocks/userService.mocks';
import { CheckoutService } from '../../../../../app/core/services/checkout.service';
import { Hd_TransferModule } from '../../hd-transfer.module';
import { TransferPrescriptionComponent } from './transfer-prescription.component';
import { BuyoutService } from '@app/core/services/buyout.service';
import { FormControl, Validators } from '@angular/forms';

const familyMembers =
  '{"messages":[{"code":"WAG_I_FA_1010","message":"No family members","type":"INFO"}]}';

describe('TransferPrescriptionComponent', () => {
  let component: TransferPrescriptionComponent;
  let fixture: ComponentFixture<TransferPrescriptionComponent>;
  let debugElement: DebugElement;
  let _userService: UserService;
  let _gaService: GaService;
  let userServiceSpy: any;
  let httpTestingController: HttpTestingController;
  let gaServiceSpy: any;
  let _http: HttpClientService;
  let _router: Router;
  let _commonUtil: CommonUtil;
  let _title: Title;
  let _messageService: MessageService;

  beforeEach(async(() => {
    gaServiceSpy = jasmine.createSpyObj('GaService', ['sendEvent']);
    userServiceSpy = jasmine.createSpyObj('UserService', {
      getActiveMemberId: 11948190939
    });

    TestBed.configureTestingModule({
      imports: [
        Hd_TransferModule,
        HttpClientModule,
        HttpClientTestingModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        RouterModule.forRoot([])
      ],
      providers: [
        AppContext,
        DatePipe,
        CheckoutService,
        BuyoutService,
        MessageService,
        UserService,
        GaService,
        CookieService,
        HttpClientService,
        HttpClientTestingModule,
        HttpTestingController,
        CommonUtil,
        Title,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: GaService, useValue: gaServiceSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
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

        fixture = TestBed.createComponent(TransferPrescriptionComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        httpTestingController = TestBed.get(HttpTestingController);

        _router = TestBed.get(Router);
        _commonUtil = TestBed.get(CommonUtil);
        _gaService = TestBed.get(GaService);
        _title = TestBed.get(Title);
        _http = TestBed.get(HttpClientService);
        _messageService = TestBed.get(MessageService);
      });
  }));

  it('should create Component', () => {
    spyOn(component, 'checkBuyoutUser').and.stub();
    spyOn(component, 'showInsuranceMessageTxt').and.stub();
    spyOn(component, 'getPersonalInfo').and.stub();
    spyOn(_title, 'getTitle').and.stub();
    spyOn(_messageService, 'clear').and.stub();
    spyOn(_commonUtil, 'scrollTop').and.stub();
    spyOn(sessionStorage, 'removeItem').and.stub();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call - initRxNameFields', () => {
    const htmlElem = document.createElement('input');
    htmlElem.value = 'test';
    const elementRef = new ElementRef(htmlElem);
    component.anotherHdRxName = elementRef;
    spyOn(_http, 'getData').and.returnValue(
      Observable.of({ drugContents: [{ drugName: 'test' }] })
    );
    component.initRxNameFields();
    expect(component).toBeTruthy();
  });

  it('should call - initEditFields', () => {
    spyOn(sessionStorage, 'getItem').and.callFake(() => true);
    component.initEditFields();
    expect(sessionStorage.getItem).toBeTruthy();
  });

  it('should call - CallCancelAction', () => {
    component.CallCancelAction({});
    expect(component.showCancelOverlay).toBeTruthy();
  });

  it('should call - CallRemoveAction', () => {
    component.CallRemoveAction(2);
    expect(component.curentindex).toBe(2);
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('should call - initHdTransferRxFormFields - with Rx list', () => {
    spyOn(component, 'editHDTransferRxRequestData');
    spyOn(sessionStorage, 'getItem').and.callFake(() => {
      return JSON.stringify(prescriptions);
    });
    component.initHdTransferRxFormFields('test patient');
    expect(component.editHDTransferRxRequestData).toHaveBeenCalled();
  });

  it('should call - initHdTransferRxFormFields - without Rx list', () => {
    spyOn(component, 'addPrecriptionDetails');
    spyOn(sessionStorage, 'getItem').and.callFake(() => null);
    component.isHaveMembers = false;
    component.initHdTransferRxFormFields('test patient');
    expect(component.addPrecriptionDetails).toHaveBeenCalled();
  });

  it('Should execute - showInsuranceMessageTxt', () => {
    sessionStorage.setItem('insuranceTransferBanerStatus', 'true');
    component.showInsuranceMessageTxt();
    expect(component.showInsuranceMessage).toBeTruthy();
  });

  it('Should execute - mychange with <8 chars', () => {
    component.mychange('1-2-3');
    expect(component.hdTransferRxForm.controls.phoneNumber).toBeDefined();
  });

  it('Should execute - mychange with > 8 chars', () => {
    component.mychange('1-2-3-4-5');
    expect(component.hdTransferRxForm.controls.phoneNumber).toBeDefined();
  });

  it('Should execute - isMoreThanOnePrescriptionDetails', () => {
    component.perscriptionNumberCount = 2;
    const result = component.isMoreThanOnePrescriptionDetails();
    expect(result).toBeTruthy();
  });

  it('Should execute - isNotReachedMaxRx', () => {
    component.perscriptionNumberCount = 2;
    const result = component.isNotReachedMaxRx();
    expect(result).toBeTruthy();
  });

  it('Should execute - updateTransferRxModalState', () => {
    component.updateTransferRxModalState(null);
    expect(component.showCancelOverlay).toBeFalsy();
  });

  it('Should execute - updateDeleteRXDetailsModalState', () => {
    component.updateDeleteRXDetailsModalState(null);
    expect(component.showCancelOverlay).toBeFalsy();
  });

  it('Should execute - cancelAction', () => {
    component.cancelAction();
    expect(component.showCancelOverlay).toBeTruthy();
  });

  it('Should execute - closeCancelModal', () => {
    // const location = { replace: () => { } };
    // spyOn(location, 'replace').and.stub();
    // spyOn(sessionStorage, 'removeItem').and.stub();
    spyOn(component, 'firecloseremoveModalHdTransferRxDelGAEvent').and.stub();
    component.closeCancelModal({ preventDefault: () => {} }, 'no');
    expect(
      component.firecloseremoveModalHdTransferRxDelGAEvent
    ).toHaveBeenCalled();
  });

  it('Should execute - loadMemeberList ', () => {
    spyOn(_http, 'doPost').and.returnValue(
      Promise.resolve({ json: () => memberData })
    );
    component.loadMemeberList();
    expect(component.patientName).toEqual('gfhdfg ghfd');
  });

  it('Should execute - loadMemeberList - with memebers ', () => {
    const memData = { ...memberData, members: { profileId: 11948190939 } };

    spyOn(_http, 'doPost').and.returnValue(
      Promise.resolve({ json: () => memData })
    );
    component.loadMemeberList();
    expect(component.patientName).toEqual('gfhdfg ghfd');
  });

  it('Should execute - updateMember', () => {
    spyOn(component, 'getPatientInfo').and.returnValue([
      { firstName: 'firstName', lastName: 'lastName' }
    ]);
    spyOn(component, 'getInsuranceStatus').and.stub();
    //spyOn(component,'resetForm').and.stub();
    spyOn(component, 'getSingleMemeberPatientName').and.returnValue('testName');
    spyOn(component, 'checkBuyoutUser').and.stub();
    component.updateMember({ preventDefault: () => {} });
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - getDrugs', () => {
    spyOn(_commonUtil, 'stringFormate').and.returnValue('testUrl');
    spyOn(_http, 'getData').and.returnValue(Observable.of('testName'));
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.getDrugs(
      { target: { value: 'xan' } },
      { controls: { rxName: 'xan' } },
      1
    );
  });

  it('Should execute - getDrugs - no rxName', () => {
    spyOn(_commonUtil, 'stringFormate').and.returnValue('testUrl');
    spyOn(_http, 'getData').and.returnValue(
      Observable.of({
        drugTypeAheadResult: '',
        messages: [{ message: 'test' }]
      })
    );
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.getDrugs(
      { target: { value: 'xan' } },
      { controls: { rxName: 'xan' } },
      1
    );
  });

  it('Should execute - getDrugs - no rxName', () => {
    spyOn(_commonUtil, 'stringFormate').and.returnValue('testUrl');
    spyOn(_http, 'getData').and.returnValue(
      Observable.of({ drugTypeAheadResult: { result: '' } })
    );
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.getDrugs(
      { target: { value: 'x' } },
      { controls: { rxName: 'xan' } },
      1
    );
  });

  it('Should execute - deletePrecriptionDetail', () => {
    component.deletePrecriptionDetail(
      { preventDefault: () => {} },
      'yes',
      null
    );
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - callRemoveRxDetailAction', () => {
    component.callRemoveRxDetailAction(null, 1);
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - addPrecriptionDetails', () => {
    component.addPrecriptionDetails();
    expect(component).toBeTruthy();
  });

  it('Should execute - validatePrescriptionName - with value for rxNumber', () => {
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxName',
      new FormControl('test', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();
    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.validatePrescriptionName();
  });

  it('Should execute - validatePrescriptionNumber', () => {
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('', Validators.required)
    );
    component.validatePrescriptionNumber();
  });

  it('Should execute - validatePrescriptionNumber - with value for rxNumber', () => {
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.validatePrescriptionNumber();
  });

  it('Should execute - fireupdateFamilyMemberGaEvent', () => {
    component.fireupdateFamilyMemberGaEvent();
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - fireupdateFamilyMemberGaEvent when active member is Add Member', () => {
    component.activeMember = 'addMember';
    component.fireupdateFamilyMemberGaEvent();
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - getPersonalInfo', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of('test'));
    component.getPersonalInfo('');
  });

  it('Should execute - isHdTransferRxDetailsValidateForm', () => {
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1, 2];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        },
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.isHdTransferRxDetailsValidateForm(
      component.hdTransferRxForm.controls['hdTransferRxFields']
    );
    expect(component).toBeTruthy();
  });

  it('Should execute - redirectToHdTransferRxReview - invalid form', fakeAsync(() => {
    spyOn(component, 'isValidateForm').and.returnValue(true);
    spyOn(component, 'getHDTransferRxDataList').and.returnValue({});
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(sessionStorage, 'setItem').and.returnValue(true);
    //spyOn(_gaService, 'sendEvent').and.stub();
    component.initHdTransferRxFormFields('');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1, 2];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: '',
          rxNumber: '1234'
        },
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.redirectToHdTransferRxReview();
    tick();
    expect(component).toBeTruthy();
  }));

  it('Should execute - fireupdateFamilyMemberGaEvent when active member is Add Member', () => {
    component.activeMember = 'addMember';
    component.fireupdateFamilyMemberGaEvent();
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - HdTransferPrescriptionPatientNameGAEvent', () => {
    spyOn(component, 'gaEventWithData').and.stub();
    component.HdTransferPrescriptionPatientNameGAEvent('test');
    expect(gaServiceSpy.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - RemoveHdTransferPrescriptionGAEvent', () => {
    component.RemoveHdTransferPrescriptionGAEvent();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - RemoveHdTransferPrescriptionGAEvent', () => {
    component.RemoveHdTransferPrescriptionGAEvent();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - CancelHdTransferPrescriptionGAEvent', () => {
    component.CancelHdTransferPrescriptionGAEvent();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - ContinueTransferPrescriptionGAEvent', () => {
    component.ContinueTransferPrescriptionGAEvent();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - firedeletePrecriptionDetailHdTransferRxDelGAEvent', () => {
    component.firedeletePrecriptionDetailHdTransferRxDelGAEvent('yes', '');
    expect(_gaService.sendEvent).toHaveBeenCalledTimes(0);
  });

  it('Should execute - firedeletePrecriptionDetailHdTransferRxDelGAEvent - no', () => {
    component.firedeletePrecriptionDetailHdTransferRxDelGAEvent('no', '');
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - firecloseremoveModalHdTransferRxDelGAEvent - yes', () => {
    component.firecloseremoveModalHdTransferRxDelGAEvent('yes');
    expect(_gaService.sendEvent).toHaveBeenCalledTimes(1);
  });

  it('Should execute - firecloseremoveModalHdTransferRxDelGAEvent- no', () => {
    component.firecloseremoveModalHdTransferRxDelGAEvent('no');
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - getPersonalInfo', () => {
    spyOn(_http, 'postData').and.returnValue(Observable.of({}));
    component.activeMember = '11948190939';
    component.getPersonalInfo('11948190939');
    _userService.user = new ArxUser('11948190939');
    expect(_http.postData).toHaveBeenCalled();
  });

  it('Should execute - AddTransferPrescriptionDetailsGaEvent', () => {
    component.AddTransferPrescriptionDetailsGaEvent();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should execute - gaEventWithData', () => {
    component.gaEventWithData('', '', {});
    expect(component).toBeTruthy();
  });

  xit('Should execute - getHDTransferRxDataList', () => {
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(u_info));
    component.initHdTransferRxFormFields('test patient');
    component.getHDTransferRxDataList(component.hdTransferRxForm);
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('Should execute - getActiveMemberName', () => {
    component.memberjson = {
      members: [
        {
          profileId: '11948190939',
          firstName: 'firstName',
          lastName: 'lastName',
          dateOfBirth: '01-01-2000'
        }
      ]
    };
    component.getActiveMemberName();
    expect(component).toBeTruthy();
  });

  it('Should execute - editHDTransferRxRequestData', () => {
    const editData = prescriptions;
    component.editHDTransferRxRequestData(editData);
    expect(component).toBeTruthy();
  });

  it('Should execute - validateFormHdTransferRxFields', () => {
    spyOn(_commonUtil, 'validateForm').and.stub();
    component.validateFormHdTransferRxFields({ valid: true });
    expect(component).toBeTruthy();
  });

  it('Should execute - getInsuranceStatus - cancel', () => {
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ insuranceOnFile: 'No' })
    );
    _userService.user = new ArxUser('11948190939');
    component.getInsuranceStatus();
    expect(component).toBeTruthy();
  });

  it('Should execute - getInsuranceStatus - yes', () => {
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_http, 'postData').and.returnValue(
      Observable.of({ insuranceOnFile: 'yes' })
    );
    _userService.user = new ArxUser('11948190939');
    component.getInsuranceStatus();
    expect(component).toBeTruthy();
  });

  it('Should execute - getInsuranceStatus - fail', () => {
    spyOn(_router, 'navigateByUrl').and.stub();
    spyOn(_http, 'postData').and.returnValue(
      Observable.throw({ insuranceOnFile: 'yes' })
    );
    _userService.user = new ArxUser('11948190939');
    component.getInsuranceStatus();
    expect(component).toBeTruthy();
  });

  it('Should execute - transferPrescriptionGAEvent - cancel', () => {
    component.transferPrescriptionGAEvent('cancel');
    expect(component).toBeTruthy();
  });

  it('Should execute - transferPrescriptionGAEvent', () => {
    component.transferPrescriptionGAEvent();
    expect(component).toBeTruthy();
  });

  it('Should execute - checkBuyoutUser', () => {
    component.checkBuyoutUser();
    expect(component).toBeTruthy();
  });

  it('Should execute - onCloseBanner', () => {
    component.onCloseBanner();
    expect(component).toBeTruthy();
  });

  it('Should execute - onCloseBuyoutBanner', () => {
    component.onCloseBuyoutBanner();
    expect(component).toBeTruthy();
  });

  it('Should execute - emptySuggestions', () => {
    component.emptySuggestions();
    expect(component).toBeTruthy();
  });

  it('Should execute - isValidateForm', () => {
    component.initHdTransferRxFormFields('testName');
    component.hdTransferRxForm.addControl(
      'rxNumber',
      new FormControl('1234', Validators.required)
    );
    component.anotherMoreHdPrescriptions = [1];
    component.patchHdTransferRxInfoForm();

    component.hdTransferRxForm.patchValue({
      hdTransferRxFields: [
        {
          rxName: 'test',
          rxNumber: '1234'
        }
      ]
    });
    component.isValidateForm(component.hdTransferRxForm);
    expect(component).toBeTruthy();
  });
});
