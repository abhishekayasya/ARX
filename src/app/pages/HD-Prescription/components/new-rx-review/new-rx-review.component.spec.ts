import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
import { NewRxReviewComponent } from './new-rx-review.component';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { HttpClientService } from '@app/core/services/http.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { HttpModule } from '@angular/http';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { AddressBookService } from '@app/core/services/address-book.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { GaService } from '@app/core/services/ga-service';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
import { Message } from '@app/models';
const mockAddress = {
  street: 'south',
  zipCode: '20901',
  city: 'Silver Spring',
  state: 'MD'
};

const mockAddress3 = {
  addresses: {
    street1: 'south',
    zipCode: '20901',
    preferred: true,
    isPreferred: true,
    city: 'Silver Spring',
    state: 'MD'
  }
};

const mockAddress4 = {
  street1: 'south',
  zipCode: '20901',
  city: 'Silver Spring',
  state: 'MD'
};

const mockaAddress2 = {
  messages: [
    {
      code: 'WAG_W_AB_1012',
      message: 'Invalid Request: Address does not exist.',
      type: 'WARN'
    }
  ],
  homeAddress: {
    street1: '09 PIES ROAD',
    city: 'ADDISON',
    state: 'TX',
    zipCode: '75001',
    newlyAdded: false,
    msRequest: false
  }
};

const mockData = {
  patient: {
    patientName: 'Patrestart Patrestart',
    patientPhoneNumber: '848-979-8797',
    patientDOB: '05-06-1987 00:00'
  },
  type: 'nrx',
  prescriptions: [
    {
      doctorName: 'karupp',
      doctorPhoneNumber: '123-456-7807',
      drugName: '678',
      drugQuantity: '1234',
      genericEquivalent: 'N'
    }
  ]
};

const patientMock = {
  firstName: 'Prerna',
  lastName: 'Sharma',
  dateOfBirth: '02/13/1999',
  street1: '154 WILMOT ROAD, ',
  city: 'DEERFIELD',
  state: 'IL',
  zipCode: '60015',
  email: 'prerna12@test.com'
};

const data = {
  displayBaseForm: true,
  basicProfile: {
    login: 'prerna12@test.com',
    email: 'prerna12@test.com',
    firstName: 'Prerna',
    lastName: 'Sharma',
    dateOfBirth: '02/13/1999',
    homeAddress: {
      street1: '154 WILMOT ROAD, ',
      city: 'DEERFIELD',
      state: 'IL',
      zipCode: '60015'
    },
    phone: [
      {
        number: '3216543164',
        phoneId: '50000270001',
        priority: 'P',
        type: 'home'
      }
    ],
    gender: 'Female',
    memberSince: '2019-02-06 04:58:29:0',
    userType: 'RX_AUTH',
    securityQuestion: 'who was your childhood hero?',
    registrationDate: '2019-02-06 04:58:29:0',
    createdUser: 'ACS_REG'
  },
  profileId: '11906473822',
  acctStatus: 'ACTIVE'
};

describe('NewRxReviewComponent', () => {
  let component: NewRxReviewComponent;
  let fixture: ComponentFixture<NewRxReviewComponent>;
  let debugElement: DebugElement;
  let router: Router;
  let _http: HttpClientService;
  let appContext: AppContext;
  let commonUtil: CommonUtil;
  let _gaService: GaService;
  let messageService: MessageService;
  let addressesService: AddressBookService;
  // tslint:disable-next-line: prefer-const
  let httpMock: HttpTestingController;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewRxReviewComponent],
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientTestingModule
      ],

      providers: [
        CommonUtil,
        DatePipe,

        { provide: APP_BASE_HREF, useValue: '/' },
        AppContext,
        HttpClientService,
        DatePipe,
        CookieService,
        AddressBookService,
        MessageService,
        CommonUtil,
        GaService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRxReviewComponent);
    component = fixture.componentInstance;
    _http = TestBed.get(HttpClientService);
    _gaService = TestBed.get(GaService);
    appContext = TestBed.get(AppContext);
    commonUtil = TestBed.get(CommonUtil);
    messageService = TestBed.get(MessageService);
    addressesService = TestBed.get(AddressBookService);
    debugElement = fixture.debugElement;
    router = TestBed.get(Router);
    component.newRxDetails = mockData;
    route = TestBed.get(ActivatedRoute);
    fixture.detectChanges();
  });

  function updateForm(street, city, state, zipCode) {
    component._editAddressForm.controls['street'].setValue(street);
    component._editAddressForm.controls['city'].setValue(city);
    component._editAddressForm.controls['state'].setValue(state);
    component._editAddressForm.controls['zipCode'].setValue(zipCode);
  }

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it(`Shold call ngOnInit`, () => {
    component.ngOnInit();
    expect(component.editPrescriptionLink).toBe(
      '/new-home-delivery-prescription/prescription'
    );
  });

  it(`Should call cancelRequest`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.cancelRequest();
    component.transferReviewGAEvent();
    fixture.detectChanges();
    expect(_gaService.sendEvent).toHaveBeenCalledWith({
      category: 'new-home-delivery-prescription/review',
      action: 'Cancel'
    });
    component.upgradeCancelModel = true;
  });

  it(`Should call transferReviewGAEvent`, () => {
    component.transferReviewGAEvent();
  });

  it(`Should call hideUpgradeCancelModel`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.hideUpgradeCancelModel(false);
    fixture.detectChanges();
    component.upgradeCancelModel = false;
    component.gaEvent('Remove Modal');
    expect(_gaService.sendEvent).toHaveBeenCalledWith({
      category: 'new-home-delivery-prescription/review',
      action: 'Remove Modal',
      label: 'Cancel request'
    });
  });

  it(`Should call gaEvent`, () => {
    component.gaEvent('Remove Modal', 'Cancel request');
  });

  it(`Should call cancelShippAddress`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.cancelShippAddress();
    fixture.detectChanges();
    component.addshippingaddress = false;
    component.gaEvent('Cancel Shipping address');
    expect(_gaService.sendEvent).toHaveBeenCalledWith({
      category: 'new-home-delivery-prescription/review',
      action: 'Cancel Shipping address',
      label: ''
    });
  });

  it(`Should call prefillAddressComponents`, () => {
    component.prefillAddressComponents(mockAddress);
    fixture.detectChanges();
    component._editAddressForm.patchValue({
      zipCode: mockAddress.zipCode,
      city: mockAddress.city,
      state: mockAddress.state
    });
  });

  it(`Should call getSelectedAddress`, () => {
    spyOn(component, 'getSelectedAddress').and.returnValue(mockAddress4);
    component.getSelectedAddress(mockAddress3);
    fixture.detectChanges();
  });

  it(`Should call editShippAddress`, () => {
    sessionStorage.setItem('shippingAddress', JSON.stringify(mockAddress));
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.editShippAddress();
    component.addshippingaddress = true;
    component.editshippingaddress = true;
    component.enableaddbutton = false;
    component.gaEvent('Edit Shipping address');
    expect(_gaService.sendEvent).toHaveBeenCalledWith({
      category: 'new-home-delivery-prescription/review',
      action: 'Edit Shipping address',
      label: ''
    });
    JSON.parse(sessionStorage.getItem('shippingAddress'));
    component._editAddressForm.setValue(mockAddress);
  });

  it(`Should call updateShippAddress`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    spyOn(component._editAddressForm, 'getRawValue');
    spyOn(commonUtil, 'validateForm').and.callThrough();
    component.updateShippAddress();
    expect(component._editAddressForm.valid).toBeFalsy();
    fixture.detectChanges();
    expect(commonUtil.validateForm).toHaveBeenCalledWith(
      component._editAddressForm
    );
    component._editAddressForm.setValue({
      street: 'Katy Freeway',
      city: 'Houston',
      state: 'TX',
      zipCode: '10003'
    });

    component.updateShippAddress();
    fixture.detectChanges();
    const formObj = component._editAddressForm.getRawValue();
    sessionStorage.setItem('shippingAddress', JSON.stringify(formObj));
    component.newRxDetails.patient.patientAddress = '1351 NW 12th St';
    component.newRxDetails.patient.patientCity = 'Miami';
    component.newRxDetails.patient.patientState = 'FL';
    component.newRxDetails.patient.patientZip = '33125';
    component.addshippingaddress = false;
    component.gaEvent('Update Shipping address');
  });

  it(`Should call goBackPrescriptionPage`, () => {
    component.pcaType = 'new';
    const navigateSpy = spyOn(router, 'navigateByUrl');
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.goBackPrescriptionPage();
    fixture.detectChanges();
    component.gaEvent('Edit New Prescriptions');
    //expect(_gaService.sendEvent).toHaveBeenCalled();
    // expect(navigateSpy).toHaveBeenCalledWith(
    //   '/new-home-delivery-prescription/prescription-pca'
    // );
    component.pcaType = 'new1';
    component.goBackPrescriptionPage();
    fixture.detectChanges();
    component.gaEvent('Edit New Prescriptions');
    //expect(_gaService.sendEvent).toHaveBeenCalled();
    // expect(navigateSpy).toHaveBeenCalledWith(
    //   '/new-home-delivery-prescription/prescription'
    // );
  });

  it('Should call cancelUpgradeProcess', () => {
    spyOn(component, 'goBackPrescriptionPage').and.stub();
    spyOn(component, 'redirectToRoute').and.stub();
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.pcaType = 'new';
    component.cancelUpgradeProcess();
    fixture.detectChanges();
    sessionStorage.removeItem('pcaInfo');
    component.pcaType = 'new1';
    fixture.detectChanges();
    component.cancelUpgradeProcess();
    sessionStorage.removeItem('Nrx');
    sessionStorage.removeItem('shippingAddress');
    component.gaEvent('Cancel request');
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it('Should call submitPrescription', () => {
    spyOn(component, 'redirectToRoute').and.stub();
    spyOn(_http, 'postRxData').and.callFake(() => {
      return of({ requestId: '1234567890', status: '200 OK' });
    });
    component.pcaType = 'new';
    component.submitPrescription();
    fixture.detectChanges();
    component.loader = true;
    component.loaderOverlay = true;
    component.pcaConfirmationdata = mockData;
    component.loader = true;
    component.loaderOverlay = true;
    localStorage.setItem('u_info', JSON.stringify(data));
    component.emailConfirmation('1234567890', 'test@gmail.com');
  });

  it(`Should handle error message`, () => {
    spyOn(_http, 'postRxData').and.callFake(() => {
      return of({ status: 500, statusText: 'Custome error' });
    });
    component.submitPrescription();
    component.onsubmitError();
  });

  it(`Should call email confiramation`, () => {
    spyOn(component, 'redirectToRoute').and.stub();
    localStorage.setItem('u_info', JSON.stringify(data));
    component.pcaType = 'new';
    component.emailConfirmation('01234567890', 'prerna12@test.com');
    fixture.detectChanges();
    component.newRxDetails['email'].emailId = 'prerna12@test.com';
    component.pcaType = 'new1';
    component.emailConfirmation('01234567890', 'prerna12@test.com');
    fixture.detectChanges();
    component.newRxDetails['email'].emailId = JSON.parse(
      localStorage.getItem('u_info')
    ).basicProfile.email;
    component.loader = true;
    component.loaderOverlay = true;
  });

  xit('Should call initializeRequest', () => {
    const mock = {
      message: 'Arrival in 5-10  business days.'
    };
    spyOn(component, 'fetchAddressList').and.returnValue(
      of({
        mockaAddress2
      })
    );
    component.pcaType = 'new1';
    sessionStorage.setItem('pcaInfo', JSON.stringify(patientMock));
    component.initializeRequest();
    fixture.detectChanges();
    component.newRxDetails = JSON.parse(sessionStorage.getItem('Nrx'));
    component.loader = true;
    component.loaderOverlay = true;
    component.shippingMethod = mock;
    component.fetchAddressList();
    component.loader = false;
    component.loaderOverlay = false;
    component.addshippingaddress = true;

    //  component.address =  component.getSelectedAddress(mockAddress1);
    // component.newRxDetails.patient.patientAddress = 'South';
  });

  it(`Should call onsubmitError`, () => {
    spyOn(messageService, 'addMessage').and.callThrough();
    const mockError = {
      service_failed:
        'Sorry, an unexpected error occurred. Please try again later.',
      ERROR: 'ERROR'
    };
    component.onsubmitError();
    const message = new Message(mockError.service_failed, mockError.ERROR);
    expect(messageService.addMessage).toHaveBeenCalledWith(message);
  });
});
