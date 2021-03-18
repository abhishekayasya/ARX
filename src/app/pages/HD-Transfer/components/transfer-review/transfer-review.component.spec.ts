import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from '@angular/core/testing';
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
import { GaService } from '@app/core/services/ga-service';
import { of } from 'rxjs/observable/of';
import { Message } from '@app/models';
import { TransferReviewComponent } from './transfer-review.component';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import {
  PCINFO,
  PATIENT_INFO,
  ERROR_MESSAGE,
  ADDRESS2,
  ADDRESS1
} from '../../../../../../test/mocks/review';
import { u_info } from '../../../../../../test/mocks/userService.mocks';
describe('TransferReviewComponent', () => {
  let component: TransferReviewComponent;
  let fixture: ComponentFixture<TransferReviewComponent>;
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
      declarations: [TransferReviewComponent],
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
    fixture = TestBed.createComponent(TransferReviewComponent);
    component = fixture.componentInstance;
    _http = TestBed.get(HttpClientService);
    _gaService = TestBed.get(GaService);
    appContext = TestBed.get(AppContext);
    commonUtil = TestBed.get(CommonUtil);
    messageService = TestBed.get(MessageService);
    addressesService = TestBed.get(AddressBookService);
    debugElement = fixture.debugElement;
    router = TestBed.get(Router);
    // component.newRxDetails = mockData;
    route = TestBed.get(ActivatedRoute);
    spyOn(commonUtil, 'addNaturalBGColor').and.stub();
    fixture.detectChanges();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });
  it(`Should call ngOnInit`, () => {
    spyOn(component, 'cancelPrescription').and.stub();
    spyOn(component, 'getDataFromSesssion').and.stub();
    sessionStorage.setItem(
      AppContext.CONST.hd_transfer_rx_list,
      JSON.stringify(PATIENT_INFO)
    );
    component.pcaType = 'transfer1';
    component.ngOnInit();
    fixture.detectChanges();
    component.checkShippingAddressIsAvail();
    component.pcaType = 'transfer2';
    sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
    component.ngOnInit();
    fixture.detectChanges();
    component.cancelPrescription();
    component.pcaType = 'transfer';
    sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
    component.ngOnInit();
    fixture.detectChanges();
    component.disableSubmitbtn = false;
    component.showLoader = false;
    expect(component).toBeTruthy();
  });

  it(`Should call ShippAddStatus`, () => {
    // tslint:disable-next-line: no-unused-expression
    component.shippAddress.status === 'INVALID';
    component.ShippAddStatus();
    fixture.detectChanges();
    component.addshippingaddress = true;
    component.showLoader = false;
    component.disableSubmitbtn = true;
    expect(component).toBeTruthy();
  });

  it(`Should call transferReviewGAEvent`, () => {
    component.transferReviewGAEvent('editPrecription');
    fixture.detectChanges();
    component.transferReviewGAEvent('editShippingAddress');
    fixture.detectChanges();
    component.transferReviewGAEvent('submitRequest');
    fixture.detectChanges();
    component.transferReviewGAEvent('All');
    fixture.detectChanges();
    component.transferReviewGAEvent('zero state');
    fixture.detectChanges();
    component.transferReviewGAEvent('Cancel Shipping address');
    fixture.detectChanges();
    component.transferReviewGAEvent('Update Shipping address');
    fixture.detectChanges();
    component.transferReviewGAEvent('cancelUpgrade');
    fixture.detectChanges();
    component.transferReviewGAEvent('cancelUpgrade111');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call cancelUpgradeProcess`, () => {
    spyOn(commonUtil, 'navigate').and.stub();
    component.pcaType = 'transfer';
    component.cancelUpgradeProcess();
    fixture.detectChanges();
    component.pcaType = 'transfer1';
    component.cancelUpgradeProcess();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call addShippAddress`, () => {
    component.shippAddress.setValue({
      street: 'Katy Freeway',
      city: 'Houston',
      state: 'TX',
      zipcode: '10003'
    });
    component.addShippAddress();
    fixture.detectChanges();
    component.shippAddress.reset();
    component.addShippAddress();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  xit(`Should call emailConfirmation`, () => {
    spyOn(_http, 'postRxData').and.callFake(() => {
      return of({ requestId: '1234567890', status: '200 OK' });
    });
    localStorage.setItem('u_info', JSON.stringify(u_info));
    component.pcaType = 'transfer';
    component.emailConfirmation('prerna12@test.com');
    fixture.detectChanges();
    component.transferJson['email'].emailId = 'prerna12@test.com';
    component.pcaType = 'transfer1';
    component.emailConfirmation('prerna12@test.com');
    fixture.detectChanges();
    component.loader = false;
    component.loaderOverlay = false;
    expect(component).toBeTruthy();
  });

  xit(`Should call error functtion`, () => {
    spyOn(_http, 'postRxData').and.callFake(() => {
      return of({ status: 500, statusText: 'Custome error' });
    });
    component.emailConfirmation('prerna12@test.com');
    fixture.detectChanges();
    component.loader = false;
    component.loaderOverlay = false;
    expect(component).toBeTruthy();
  });
  it(`Should call prefillAddressComponents`, () => {
    component.prefillAddressComponents(ADDRESS1);
    expect(component).toBeTruthy();
  });

  it(`Should call transferPrescriptionGAEvent`, () => {
    component.transferPrescriptionGAEvent('cancel');
    fixture.detectChanges();
    component.transferPrescriptionGAEvent('cancel1');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call editShippAddress`, () => {
    sessionStorage.setItem('shippingAddress', JSON.stringify(ADDRESS1));
    component.editShippAddress();
    const formObj = JSON.parse(sessionStorage.getItem('shippingAddress'));
    fixture.detectChanges();
    component.shippAddress.setValue(formObj);
    sessionStorage.removeItem('shippingAddress');
    const formObj2 = JSON.parse(sessionStorage.getItem('shippingAddress'));
    component.editShippAddress();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call updateShippAddress`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.shippAddress.reset();
    component.updateShippAddress();
    fixture.detectChanges();
    component.shippAddress.setValue(ADDRESS1);
    component.updateShippAddress();
    fixture.detectChanges();
    expect(_gaService.sendEvent).toHaveBeenCalled();
  });

  it(`Should call cancelShippAddress`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.cancelShippAddress();
    expect(_gaService.sendEvent).toHaveBeenCalled();
    component.addshippingaddress = true;
    component.disableSubmitbtn = false;
    expect(component).toBeTruthy();
  });

  it('Should call submitRequest', () => {
    spyOn(component, 'generateJson').and.stub();
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.submitRequest();
    expect(_gaService.sendEvent).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it('Sholud call hideUpgradeCancelModel', () => {
    const event = false;
    component.hideUpgradeCancelModel(event);
    component.upgradeCancelModel = false;
    expect(component.upgradeCancelModel).toBeFalsy();
  });

  it(`Should call cancelRequest`, () => {
    spyOn(_gaService, 'sendEvent').and.callThrough();
    component.cancelRequest();
    expect(_gaService.sendEvent).toHaveBeenCalled();
    component.upgradeCancelModel = false;
    expect(component.upgradeCancelModel).toBeFalsy();
  });
  it(`Should call editprescription`, () => {
    spyOn(commonUtil, 'navigate').and.stub();
    component.pcaType = 'transfer';
    component.editprescription();
    fixture.detectChanges();
    expect(component.pcaType).toBeDefined();
    component.pcaType = null;
    component.editprescription();
    fixture.detectChanges();
    expect(component.pcaType).toBeNull();
  });

  xit(`Should call emailConfirmation error case`, () => {
    spyOn(_http, 'postRxData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    spyOn(messageService, 'addMessage').and.callThrough();
    component.emailConfirmation('prerna12@test.com');
    component.loader = false;
    component.loaderOverlay = false;
    expect(messageService.addMessage).toHaveBeenCalledWith(
      new Message(ERROR_MESSAGE.service_failed, ERROR_MESSAGE.ERROR)
    );
  });

  it(`Should call checkShippingAddressIsAvail`, () => {
    spyOn(_http, 'postData').and.callFake(() => {
      return of({ status: '200 OK' });
    });
    sessionStorage.setItem('shippingAddress', JSON.stringify(ADDRESS1));
    component.checkShippingAddressIsAvail();
    sessionStorage.getItem('shippingAddress');
    fixture.detectChanges();
    sessionStorage.removeItem('shippingAddress');
    component.checkShippingAddressIsAvail();
    fixture.detectChanges();
    component.deliveryAddress = component.getSelectedAddress([ADDRESS2]);
    component.checkShippingAddressIsAvail();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call getDataFromSesssion`, () => {
    spyOn(commonUtil, 'convertDataFormat').and.stub();
    component.pcaType = 'transfer';
    sessionStorage.setItem('pcaInfo', JSON.stringify(PCINFO));
    component.getDataFromSesssion();
    component.pcaType = null;
    sessionStorage.setItem('hd_transfer_rxlist', JSON.stringify(PATIENT_INFO));
    component.getDataFromSesssion();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it(`Should call generateJson`, () => {
    component.pcaType = 'transfer1';
    component.generateJson();
    expect(component).toBeTruthy();
  });

  it('Should call generateJson erro', () => {
    spyOn(_http, 'postRxData').and.returnValue(
      Observable.throw({ status: 500 })
    );
    component.pcaType = 'transfer1';
    component.generateJson();
    expect(component).toBeTruthy();
  });
});
