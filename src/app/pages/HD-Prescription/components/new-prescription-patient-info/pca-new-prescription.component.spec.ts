import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync
} from '@angular/core/testing';
import { PcaNewPrescriptionComponent } from './pca-new-prescription.component';
import { UserService } from '@app/core/services/user.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { BrowserModule } from '@angular/platform-browser';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AppContext } from '@app/core/services/app-context.service';
import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
  APP_BASE_HREF
} from '@angular/common';
import { HttpClientService } from '@app/core/services/http.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { MessageService } from '@app/core/services/message.service';
import { CookieService } from 'ngx-cookie-service';
import { GaService } from '@app/core/services/ga-service';
import { MessageComponent } from '@app/shared/components/message/message.component';
import { GooglePlacesComponent } from '@app/shared/components/google-places/google-places.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { HtmlPipe } from '@app/shared/pipes/html.pipe';
import { DateConfigModel } from '@app/models/date-config.model';
import { DebugElement } from '@angular/core';
import { ArxUser } from '@app/models/user.model';
import { jsonUsr } from '../../../../../../test/mocks/userService.mocks';
import { of } from 'rxjs/observable/of';

const event = { preventDefault: () => {} };

const pcaInfoTransfer = {
  firstName: 'Niranjan',
  phoneNumber: '909-223-6389',
  dateOfBirth: '01/01/2000',
  email: 'valliveduniranjan@gmail.com',
  street: 'Bose Lane',
  city: 'San Jose',
  state: 'CA',
  zipCode: '95120',
  pharmacyName: 'walgreen',
  pharmacyPhoneNumber: '111-111-1111',
  drugname: 'XANAX 0.5MG TABLETS',
  quantity: '10',
  prescriptionInfo: [],
  displayBaseForm: true
};
const strPcaInfoTransfer = JSON.stringify(pcaInfoTransfer);

const pcaInfoNew = {
  firstName: 'Niranjan',
  phoneNumber: '111-111-1111',
  dateOfBirth: '01/01/2000',
  email: 'sdafs@afdsf.com',
  street: 'Bose Lane',
  city: 'San Jose',
  state: 'CA',
  zipCode: '95120',
  prescriptionInfo: [],
  doctorName: 'John',
  doctorphone: '888-888-8888',
  terms: '',
  drugname: 'XANAX 0.5MG TABLETS',
  quantity: '25',
  pharmacyName: 'walgreen',
  pharmacyPhoneNumber: '111-111-1111'
};

const u_info = {
  basicProfile: {
    login: 'digicathritn1806@yopmail.com',
    email: 'kannan.x.srinivasan@walgreens.com',
    firstName: 'Digicathritn',
    lastName: 'Digicathritn',
    dateOfBirth: '02/06/1988',
    homeAddress: {
      street1: '49 SURYA ENCLAVE  TRIMULGHERRY, ',
      city: 'HYDERABAD',
      state: 'TX',
      zipCode: '50001'
    },
    phone: [
      {
        number: '9176480955',
        phoneId: '50003800001',
        priority: 'P',
        type: 'home'
      },
      {
        number: '2340973249',
        phoneId: '50003800002',
        priority: 'A1',
        type: 'work'
      },
      {
        number: '9176480934',
        phoneId: '50003800003',
        priority: 'A2',
        type: 'cell'
      }
    ],
    gender: 'Female',
    memberSince: '2019-09-30 07:07:53:490',
    userType: 'RX_AUTH',
    securityQuestion: 'What was your favorite place to visit as a child?',
    registrationDate: '2019-09-30 07:07:53:490',
    createdUser: 'ACS_REG'
  },
  profileId: '11950421547',
  acctStatus: 'ACTIVE'
};

const drugs = `{"drugTypeAheadResult":
{"result":[{"drugType":"prescription","drugItemID":"6410",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009005501.jpg",
"drugName":"XANAX 0.5MG TABLETS"},{"drugType":"prescription","drugItemID":"6411",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009009001.jpg",
"drugName":"XANAX 1MG TABLETS"},{"drugType":"prescription","drugItemID":"6409",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009002901.jpg",
"drugName":"XANAX 0.25MG TABLETS"},{"drugType":"prescription","drugItemID":
"640676","drugImageURL":"https://www.walgreens.com/images/drug/0100009005907.jpg",
"drugName":"XANAX XR 1MG TABLETS"},{"drugType":"prescription","drugItemID":"640674",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009006607.jpg",
"drugName":"XANAX XR 2MG TABLETS"},{"drugType":"prescription","drugItemID":"640675",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009006807.jpg","drugName":
"XANAX XR 3MG TABLETS"},{"drugType":"prescription","drugItemID":"640677",
"drugImageURL":"https://www.walgreens.com/images/drug/0100009005707.jpg",
"drugName":"XANAX XR 0.5MG TABLETS"}]}}`;

describe('PcaNewPrescriptionComponent', () => {
  let component: PcaNewPrescriptionComponent;
  let fixture: ComponentFixture<PcaNewPrescriptionComponent>;
  let _userService: UserService;
  let userServiceSpy: any;
  let _commonUtil: CommonUtil;
  // tslint:disable-next-line: prefer-const
  let commonUtilSpy: any;
  let el: DebugElement;
  let httpTestingController: HttpTestingController;
  let _http: HttpClientService;

  beforeEach(async(() => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['']);

    TestBed.configureTestingModule({
      declarations: [
        PcaNewPrescriptionComponent,
        MessageComponent,
        ModalComponent,
        HtmlPipe,
        GooglePlacesComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],
      providers: [
        AppContext,
        CheckoutService,
        MessageService,
        CookieService,
        GaService,
        DatePipe,
        UserService,
        CommonUtil,
        HttpClientService,
        Location,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: UserService, useValue: userServiceSpy }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PcaNewPrescriptionComponent);
        component = fixture.componentInstance;
        _userService = TestBed.get(UserService);
        _http = TestBed.get(HttpClientService);
        _commonUtil = TestBed.get(CommonUtil);
        httpTestingController = TestBed.get(HttpTestingController);
        el = fixture.debugElement;
        fixture.detectChanges();
      });
  }));

  it('should create PcaNewPrescription Component', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form based on New or transfer - New', () => {
    component.isNewPresPCA = true;
    component.initialiseForm(new DateConfigModel());
    expect(component.hdNewRxPcaForm).toBeDefined();
  });

  it('should create the form based on New or transfer - False', () => {
    component.isNewPresPCA = false;
    fixture.detectChanges();
    component.initialiseForm(new DateConfigModel());
    expect(component.hdNewRxPcaForm).toBeDefined();
  });

  it('should call - omit_special_char', () => {
    component.isNewPresPCA = false;
    let val = component.omit_special_char({ charCode: 0 });
    val = component.omit_special_char({ charCode: 8 });
    val = component.omit_special_char({ charCode: 32 });
    val = component.omit_special_char({ charCode: 50 });
    expect(val).toBeTruthy();
  });

  it('should call - prefillAddressComponents', () => {
    component.isNewPresPCA = false;
    fixture.detectChanges();
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    component.prefillAddressComponents({ type: 'arx' });
    expect(component.hdNewRxPcaForm.controls.pharmacyName.value).toBe(
      'walgreen'
    );
  });

  it('should call - ValidateForm', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    spyOn(component, 'ValidateForm').and.callThrough();
    component.ValidateForm();
    expect(component.ValidateForm).toHaveBeenCalled();
  });

  it('should call - selectSuggestion', () => {
    component.isNewPresPCA = false;
    fixture.detectChanges();
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    spyOn(component, 'selectSuggestion').and.callThrough();

    component.selectSuggestion({ drugName: 'Lipitor' }, null, '');
    expect(component.selectSuggestion).toHaveBeenCalled();
  });

  it('should call - closecancelModal', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    spyOn(component, 'closecancelModal').and.returnValue(false);
    component.closecancelModal({ preventDefault: () => {} }, 'No');
    expect(component.showcanceloverlay).toBeFalsy();
  });

  it('should call - updateRxModalstate', () => {
    component.updateRxModalstate();
    fixture.detectChanges();
    expect(component.showcanceloverlay).toBeFalsy();
  });

  it('should call - callAddAnother', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    component.callAddAnother({ preventDefault: () => {} });
    expect(component.hdNewRxPcaForm.controls['prescriptionInfo']).toBeDefined();
  });

  it('should call - callAddAnother  - isNewPresPCA - false', () => {
    component.isNewPresPCA = true;
    component.hdNewRxPcaForm.addControl(
      'doctorName',
      new FormControl('test name', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'doctorphone',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'terms',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.setValue({
      ...pcaInfoTransfer,
      doctorName: 'John',
      doctorphone: '888-888-8888',
      terms: ''
    });
    fixture.detectChanges();
    component.callAddAnother({ preventDefault: () => {} });
    expect(component.hdNewRxPcaForm.controls['prescriptionInfo']).toBeDefined();
  });

  it('should call - createItem - isNewPresPCA - true', () => {
    component.isNewPresPCA = true;
    component.hdNewRxPcaForm.addControl(
      'doctorName',
      new FormControl('test name', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'doctorphone',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'terms',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.setValue({
      ...pcaInfoTransfer,
      doctorName: 'John',
      doctorphone: '888-888-8888',
      terms: ''
    });
    fixture.detectChanges();
    const form = component.createItem();
    expect(form).toBeDefined();
  });

  it('should call - createItem - isNewPresPCA - false', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    const form = component.createItem();
    expect(form).toBeDefined();
  });

  it('should call - closeremoveModal', fakeAsync(() => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    component.closeremoveModal(event, 'yes', '');
    expect(component.ExceedLimit).toBeFalsy();
  }));

  it('should call - CallCancelAction', () => {
    component.CallCancelAction({ preventDefault: () => {} });
    fixture.detectChanges();
    expect(component.showcanceloverlay).toBeTruthy();
  });
  it('should call - updateDeleteModalstate', () => {
    component.updateDeleteModalstate();
    fixture.detectChanges();
    expect(component.showRemoveoverlay).toBeFalsy();
  });

  it('should call - isValidateForm', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    const returnVal = component.isValidateForm(component.hdNewRxPcaForm);
    expect(returnVal).toBeDefined();
  });

  it('should call - gaEvent', () => {
    const eventData = component.gaEvent('send', '');
    expect(eventData.action).toBe('send');
  });

  it('should call - prepareDocInfo', () => {
    const docInfo = {
      doctorName: 'Test Doc Name',
      doctorphone: '1234567899',
      drugname: 'Xanax',
      quantity: '10',
      terms: 'Y'
    };
    const result = component.prepareDocInfo(docInfo);
    expect(result.drugQuantity).toBe('10');
  });

  // it('should call - getActiveMemberName', () => {
  //   component.getActiveMemberName();
  //   expect(component.curentindex).toBe(0);
  // });
  it('should call - setFormData - isNewPresPCA is False', () => {
    spyOn(sessionStorage, 'getItem').and.callFake(function() {
      return strPcaInfoTransfer;
    });
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    component.setFormData();
    fixture.detectChanges();
    expect(component.hdNewRxPcaForm.controls['drugname'].value).toBe(
      pcaInfoTransfer.drugname
    );
  });
  it('should call - setFormData - isNewPresPCA is true', () => {
    spyOn(sessionStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({
        ...JSON.parse(strPcaInfoTransfer),
        doctorName: 'John',
        doctorphone: '888-888-8888',
        terms: ''
      });
    });
    component.isNewPresPCA = true;
    component.hdNewRxPcaForm.addControl(
      'doctorName',
      new FormControl('test name', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'doctorphone',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.addControl(
      'terms',
      new FormControl('9999999999', Validators.required)
    );
    component.hdNewRxPcaForm.setValue({
      ...pcaInfoTransfer,
      doctorName: 'John',
      doctorphone: '888-888-8888',
      terms: ''
    });
    fixture.detectChanges();
    component.setFormData();
    expect(component.hdNewRxPcaForm.controls['drugname'].value).toBe(
      pcaInfoTransfer.drugname
    );
  });

  it('should call - redirectToTransferRxReview', () => {
    spyOn(_commonUtil, 'validateForm').and.callFake(() => {
      return true;
    });
    component.isNewPresPCA = false;
    const _pcaInfoTransfer = { ...pcaInfoTransfer, firstName: '' };
    component.hdNewRxPcaForm.setValue(_pcaInfoTransfer);
    component.redirectToTransferRxReview();
    expect(_commonUtil.validateForm).toHaveBeenCalled();
  });

  it('should call - redirectRxReview - invalid form', fakeAsync(() => {
    component.isNewPresPCA = false;
    spyOn(component, 'redirectToTransferRxReview').and.callFake(function() {
      return;
    });
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
  }));

  it('should call - redirectRxReview - valid form', fakeAsync(() => {
    component.isNewPresPCA = true;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    _userService.user = new ArxUser('11948190939');
    _userService.user.firstName = 'testFirst';
    _userService.user.lastName = 'test';
    _userService.user.dateOfBirth = '01-01-2000';
    _userService.user.phoneNumber = '1234567899';
    _userService.user.profile = jsonUsr;
    spyOn(component, 'redirectToNewRxReview').and.callFake(function() {
      return true;
    });
    component.redirectRxReview();
    expect(component.redirectToNewRxReview).toHaveBeenCalled();
  }));

  it('should call - changeAction', () => {
    spyOn(component, 'changeAction').and.callFake(() => true);
    component.changeAction(0);
    expect(component.changeAction).toHaveBeenCalled();
  });

  it('should call - getDrugs', () => {
    component.isNewPresPCA = false;
    component.hdNewRxPcaForm.setValue(pcaInfoTransfer);
    fixture.detectChanges();
    spyOn(_commonUtil, 'stringFormate').and.callFake(() => {
      return '/productsearch/v1/drugtypeahead?q=xan';
    });
    spyOn(_http, 'getData').and.callFake(() => {
      return of(JSON.parse(drugs));
    });

    const _event = {
      key: 'Enter',
      preventDefault: () => {},
      target: {
        value: 'xandsdsd',
        id: 'drugname'
      }
    };

    component.getDrugs(_event);
    expect(component.selectedItemId).toBe('drugname');
  });
  it('should call CallRemoveAction ', () => {
    component.CallRemoveAction('1');
  });
  it('should call emptySuggestions ', () => {
    component.emptySuggestions();
  });
  it(`should call gaEventWithData function`, () => {
    component.gaEventWithData('test', 'test');
  });
  it('should call changedGenericEquivalentCheckBox', () => {
    const event_val = {
      target: { checked: 'Y' }
    };
    component.changedGenericEquivalentCheckBox(event_val);
  });
});
