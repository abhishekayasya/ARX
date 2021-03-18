import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { AppTestingModule } from './../../../../../tests/app.testing.module';
import { MailReviewComponent } from './mail-review.component';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { Observable } from 'rxjs/Observable';
import { HttpClientService } from '@app/core/services/http.service';
import { UserService } from '@app/core/services/user.service';
import { Router } from '@angular/router';
import { CheckoutService } from '@app/core/services/checkout.service';

const error = [{ type: 'error', message: 'error' }];
const checkValidSubmissionres: any = {
    messages: error,
    checkoutDetails: [{ messages: error }]
};
const data = {
    selectedShipping: '',
    ccInfo: { ccNumber: '123', expDate: '', zipCode: '', saveAsExpress: '' },
    isCardUpdated: true,
    cardType: ''
};

describe('MailReviewComponent', () => {
    let component: MailReviewComponent;
    let fixture: ComponentFixture<MailReviewComponent>;
    let refillBaseService: RefillBaseService;
    let httpService;
    let userService;
    let routerService;
    let checkoutService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(MailReviewComponent);
                component = fixture.componentInstance;
                refillBaseService = TestBed.get(RefillBaseService);
                httpService = TestBed.get(HttpClientService);
                userService = TestBed.get(UserService);
                routerService = TestBed.get(Router);
                checkoutService = TestBed.get(CheckoutService);
            });
    }));

    it('should create MailReviewComponent', () => {
        expect(component).toBeTruthy();
    });

    it('should call onfurtherRedirectionError ', () => {
        component.onfurtherRedirectionError();
        expect(component).toBeTruthy();
    });

    it('should call updateAddressSelected', () => {
        component.payload.boxDetails = { shippingInfo: { deliveryAddr: '123' } };
        component.updateAddressSelected([{ preferred: true }]);
        expect(component).toBeTruthy();
    });

    it('should call updateAddressSelected1', () => {
        component.payload.boxDetails = { shippingInfo: { deliveryAddr: '123' } };
        component.updateAddressSelected([{ isPreferred: true }]);
        expect(component).toBeTruthy();
    });

    it('should call scrollToError ', () => {
        spyOn(window, 'setTimeout').and.stub();
        component.scrollToError();
        expect(component).toBeTruthy();
    });

    it('should call checkValidSubmission ', () => {
        checkValidSubmissionres.messages = [{ code: 'WAG_I_AB_1000', message: 'success', type: 'ERROR' }];
        component.checkValidSubmission(checkValidSubmissionres);
        expect(component).toBeTruthy();
    });

    it('should call checkValidSubmission1', () => {
        checkValidSubmissionres.messages = [{ code: 'WAG_RXCHECKOUT_002', message: 'success', type: 'WARN' }];
        component.checkValidSubmission(checkValidSubmissionres);
        expect(component).toBeTruthy();
    });

    it('should call checkValidSubmission2', () => {
        checkValidSubmissionres.checkoutDetails = [{ messages: [{ message: 'fail', type: 'ERROR', code: 'WAG_RXCHECKOUT_003' }] }];
        component.checkValidSubmission(checkValidSubmissionres);
        expect(component).toBeTruthy();
    });

    // it('should call checkValidSubmission3', () => {
    //     checkValidSubmissionres.messages = [];
    //     checkValidSubmissionres.checkoutDetails = [{ boxDetails: { shippingInfo: { creditCard: { messages: [{ type: 'error' }] } } } }];
    //     component.checkValidSubmission(checkValidSubmissionres);
    //     expect(component).toBeTruthy();
    // });

    it('should call prepareRxNumber', () => {
        component.prepareRxNumber('123456');
        expect(component).toBeTruthy();
    });

    it('should call prepareRxNumber1', () => {
        component.prepareRxNumber('RX-123456');
        expect(component).toBeTruthy();
    });

    it('should call prepareRxNumber2', () => {
        component.prepareRxNumber('RX-123');
        expect(component).toBeTruthy();
    });

    it('should call gaEvent', () => {
        component.gaEvent();
        expect(component).toBeTruthy();
    });

    it('should call gaEvent1', () => {
        component.checkout['isCombo'] = true;
        component.isHDRefillReminder = true;
        component.gaEvent();
        expect(component).toBeTruthy();
    });

    it('should call getAdditionalDetails', () => {
        const res = { 'rxNumber': '123' };
        const response = { 'prescriptions': [{ 'rxNumber': '123', 'fillDetails': [{ 'statusPrice': { 'price': '20' } }] }] };
        spyOn(refillBaseService, 'fetchRxHistory').and.returnValue(Observable.of(response));
        component.getAdditionalDetails(res);
        expect(component).toBeTruthy();
    });

    it('should call getAdditionalDetails1', () => {
        const res = { 'rxNumber': '123456' };
        const response = { 'prescriptions': [{ 'rxNumber': '123', 'fillDetails': [{ 'statusPrice': { 'price': '20' } }] }] };
        spyOn(refillBaseService, 'fetchRxHistory').and.returnValue(Observable.of(response));
        component.getAdditionalDetails(res);
        expect(component).toBeTruthy();
    });

    it('should call getAdditionalDetails2', () => {
        const res = { 'rxNumber': '123456' };
        const response = {};
        spyOn(refillBaseService, 'fetchRxHistory').and.returnValue(Observable.of(response));
        component.getAdditionalDetails(res);
        expect(component).toBeTruthy();
    });

    it('should call getAdditionalDetailsError', () => {
        const res = { 'rxNumber': '123456' };
        spyOn(refillBaseService, 'fetchRxHistory').and.returnValue(Observable.throw(''));
        component.getAdditionalDetails(res);
        expect(component).toBeTruthy();
    });

    it('should call loadUserContext', () => {
        sessionStorage.removeItem('ck_hd_context');
        spyOn(component, 'updateShippingDetailsOnScreen').and.stub();
        component.loadUserContext();
        expect(component).toBeTruthy();
    });

    it('should call loadUserContext1', () => {
        data.selectedShipping = undefined;
        component.context = data;
        sessionStorage.setItem('ck_hd_context', JSON.stringify(data));
        component.payload.boxDetails = { shippingInfo: { shippingOptions: [{ value: '20' }] } };
        component.loadUserContext();
        expect(component).toBeTruthy();
    });

    it('should call validateCConBlur', () => {
        const event = { 'target': { 'id': 'ccNumber' } };
        component.validateCConBlur(event);
        expect(component).toBeTruthy();
    });

    it('should call validateCConBlur1', () => {
        const event = { 'target': { 'id': 'expDate' } };
        component.validateCConBlur(event);
        expect(component).toBeTruthy();
    });

    it('should call validateCConBlur2', () => {
        const event = { 'target': { 'id': 'zipCode' } };
        component.validateCConBlur(event);
        expect(component).toBeTruthy();
    });

    it('should call submitMailData', () => {
        component.payload.boxDetails = { shippingInfo: { creditCard: '123' } };
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of({
            checkoutDetails: [{ boxDetails: { shippingInfo: { creditCard: { messages: [{ message: 'test', type: 'ERROR' }] } } } }]
        }));
        component.submitMailData();
        expect(component).toBeTruthy();
    });

    it('should call submitMailData1', () => {
        component.payload.boxDetails = { shippingInfo: { creditCard: '123' } };
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of({
            checkoutDetails: [{ boxDetails: { shippingInfo: { creditCard: { messages: [{ message: 'test', type: 'ERROR' }] } } } }]
        }));
        component.isHDRefillReminder = true;
        component.submitMailData();
        expect(component).toBeTruthy();
    });

    it('should call submitMailData2', () => {
        component.payload.boxDetails = { shippingInfo: { creditCard: '123' } };
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of({
            checkoutDetails: [{ messages: [{ message: 'fail', type: 'ERROR', code: 'WAG_RXCHECKOUT_003' }] }]
        }));
        component.isHDRefillReminder = false;
        component.submitMailData();
        expect(component).toBeTruthy();
    });

    it('should call submitMailData3', () => {
        component.payload.boxDetails = { shippingInfo: { creditCard: '123' } };
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.throw('error'));
        component.submitMailData();
        expect(component).toBeTruthy();
    });

    it('should call updateCCType', () => {
        const event = { 'type': 'error' };
        spyOn(component, 'saveContext').and.stub();
        component.updateCCType(event);
        expect(component).toBeTruthy();
    });

    it('should call prepareMailData', () => {
        spyOn(component, 'scrollToError').and.stub();
        component.prepareMailData();
        expect(component).toBeTruthy();
    });

    it('should call prepareMailData1', () => {
        component.needCreditCard = false;
        component.payload.boxDetails = { shippingInfo: { deliveryAddr: undefined } };
        component.prepareMailData();
        expect(component).toBeTruthy();
    });

    // xit('should call prepareMailData1', () => {
    //     component.ccUpdateForm.setErrors({ 'valid': true });
    //     component.needCreditCard = true;
    //     component.payload.boxDetails = { shippingInfo: { deliveryAddr : ''} };
    //     component.context = data;
    //     component.prepareMailData();
    //     expect(component).toBeTruthy();
    // });

    it('should call updateItemsForSpecialityIfMissing', () => {
        component.checkout.data_deliveryOptions = { checkoutDetails: [{ subType: 'CLEANSED' }] };
        component.updateItemsForSpecialityIfMissing();
        expect(component).toBeTruthy();
    });

    it('should call updateItemsForSpecialityIfMissing', () => {
        component.checkout.data_deliveryOptions = { checkoutDetails: [{ subType: 'UNSOLICITED' }] };
        component.updateItemsForSpecialityIfMissing();
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit', () => {
        component.isHDRefillReminder = true;
        spyOn(component, 'calculateMailPrescriptionsDays').and.stub();
        spyOn(component, 'processCreditCardInformation').and.stub();
        spyOn(component, 'prepareLayout').and.stub();
        spyOn(component, 'loadUserContext').and.stub();
        spyOn(component, 'initPayload').and.stub();
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should call ngOnInit1', () => {
        component.isHDRefillReminder = false;
        component.checkout['isCombo'] = true;
        spyOn(component, 'calculateMailPrescriptionsDays').and.stub();
        spyOn(component, 'processCreditCardInformation').and.stub();
        spyOn(component, 'prepareLayout').and.stub();
        spyOn(component, 'loadUserContext').and.stub();
        spyOn(component, 'initPayload').and.stub();
        component.ngOnInit();
        expect(component).toBeTruthy();
    });

    it('should call isExpiryDateValid', () => {
        component.isExpiryDateValid('05/1994');
        expect(component).toBeTruthy();
    });

    it('should call isExpiryDateValid', () => {
        component.isExpiryDateValid('01/2020');
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': 'WAG_RXHOMEDELIVERY_001' }] }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': 'WAG_RXHOMEDELIVERY_VAL_001' }] }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': '' }], isValidRx: false }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

    it('should call prepareLayout', () => {
        component.isHDRefillReminder = false;
        spyOn(component.checkout, 'deliveryOptions').and.returnValue(Observable.of('test'));
        spyOn(component, 'updateItemsForSpecialityIfMissing').and.stub();
        spyOn(checkoutService, 'storeHomeDeliveryItemsInCache').and.stub();
        component.prepareLayout();
        expect(component).toBeTruthy();
    });

    it('should call prepareLayout1', () => {
        component.isHDRefillReminder = false;
        spyOn(component, 'updateItemsForSpecialityIfMissing').and.stub();
        spyOn(checkoutService, 'storeHomeDeliveryItemsInCache').and.stub();
        component.prepareLayout();
        expect(component).toBeTruthy();
    });

    it('should call prepareLayout2', () => {
        component.isHDRefillReminder = false;
        spyOn(component.checkout, 'deliveryOptions').and.returnValue(Observable.throw('error'));
        spyOn(component, 'updateItemsForSpecialityIfMissing').and.stub();
        spyOn(checkoutService, 'storeHomeDeliveryItemsInCache').and.stub();
        spyOn(component, 'getAdditionalDetails').and.stub();
        component.prepareLayout();
        expect(component).toBeTruthy();
    });

    it('should call prepareLayout3', () => {
        component.isHDRefillReminder = true;
        component.payload.prescriptionList = [{ rxViewId: '123', rxNumber: '123', prescription: [] }];
        spyOn(component.checkout, 'deliveryOptions').and.returnValue(Observable.throw('error'));
        spyOn(component, 'updateItemsForSpecialityIfMissing').and.stub();
        spyOn(checkoutService, 'storeHomeDeliveryItemsInCache').and.stub();
        spyOn(component, 'getAdditionalDetails').and.stub();
        component.prepareLayout();
        expect(component).toBeTruthy();
    });

    it('should call prepareLayout4', () => {
        component.isHDRefillReminder = true;
        component.checkout.data_deliveryOptions = 'addr';
        component.payload.prescriptionList = [{ rxViewId: '123', rxNumber: '123', prescription: [] }];
        spyOn(component.checkout, 'deliveryOptions').and.returnValue(Observable.throw('error'));
        spyOn(component, 'updateItemsForSpecialityIfMissing').and.stub();
        spyOn(checkoutService, 'storeHomeDeliveryItemsInCache').and.stub();
        spyOn(component, 'getAdditionalDetails').and.stub();
        component.prepareLayout();
        expect(component).toBeTruthy();
    });

    it('should call calculateMailPrescriptionsDays', () => {
        component.payload.boxDetails = { shippingInfo: { shippingOptions: [{ selected: true }] } };
        component.calculateMailPrescriptionsDays();
        expect(component).toBeTruthy();
    });

    xit('should call removePrescription', () => {
        spyOn(routerService, 'navigate').and.stub();
        spyOn(checkoutService, 'deliveryOptions').and.returnValue(Observable.of({
            checkoutDetails: [{ type: 'HOMEDELIVERY' }, { type: 'SPECIALITY' }]
        }));
        spyOn(httpService, 'postData').and.returnValue(Observable.of(true));
        spyOn(userService, 'updateCartRxCount').and.stub();
        spyOn(checkoutService, 'storeReviewRefresh').and.stub();
        component.removePrescription('123', '15');
        expect(component).toBeTruthy();
    });
    xit('should call removePrescription1', () => {
        spyOn(routerService, 'navigate').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of(true));
        spyOn(checkoutService, 'deliveryOptions').and.returnValue(Observable.of({
            messages: [{ code: 'WAG_RXCHECKOUT_002', message: 'success', type: 'WARN' }]
        }));
        component.removePrescription('123', '15');
        expect(component).toBeTruthy();
    });
    xit('should call removePrescription2', () => {
        spyOn(routerService, 'navigate').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of(true));
        spyOn(checkoutService, 'deliveryOptions').and.returnValue(Observable.of({
            message: [{ code: 'WAG_RXCHECKOUT_002', message: 'success', type: 'WARN' }]
        }));
        component.removePrescription('123', '15');
        expect(component).toBeTruthy();
    });
    it('should call removePrescription else', () => {
        spyOn(routerService, 'navigate').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.of(false));
        component.removePrescription('123', '15');
        expect(component).toBeTruthy();
    });
    it('should call removePrescription error', () => {
        spyOn(routerService, 'navigate').and.stub();
        spyOn(httpService, 'postData').and.returnValue(Observable.throw({status: 500}));
        component.removePrescription('123', '15');
        expect(component).toBeTruthy();
    });
    it('should call processCreditCardInformation', () => {
        component.payload.boxDetails = { shippingInfo: { creditCard: [{ creditCardNumber: undefined }] } };
        component.processCreditCardInformation();
        expect(component).toBeTruthy();
    });

    it('should call processCreditCardInformation1', () => {
        spyOn(component, 'isExpiryDateValid').and.returnValue(false);
        component.payload.boxDetails = { shippingInfo: { creditCard: [{ creditCardNumber: '123' }] } };
        component.processCreditCardInformation();
        expect(component).toBeTruthy();
    });

    it('should call saveContext', () => {
        component.context = data;
        spyOn(component, 'updateShippingDetailsOnScreen').and.stub();
        component.saveContext();
        expect(component).toBeTruthy();
    });

    it('should call saveContext1', () => {
        component.needCreditCard = false;
        component.ccExpired = true;
        component.context = data;
        spyOn(component, 'updateShippingDetailsOnScreen').and.stub();
        component.saveContext();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection', () => {
        //component.context = data;
        //spyOn(component, 'updateShippingDetailsOnScreen').and.stub();
        spyOn(routerService, 'navigateByUrl').and.stub();
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = true;
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection1', () => {
        spyOn(routerService, 'navigateByUrl').and.stub();
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = true;
        spyOn(component, 'submitMailData').and.stub();
        spyOn(userService, 'getCCToken').and.returnValue(Observable.of({ tokenDetails: [{ transactionId: 123 }] }));
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection1', () => {
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = true;
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(component, 'submitMailData').and.stub();
        spyOn(userService, 'getCCToken').and.returnValue(Observable.of({ tokenDetails: [{}] }));
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection2', () => {
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = true;
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(component, 'submitMailData').and.stub();
        spyOn(userService, 'getCCToken').and.returnValue(Observable.throw('error'));
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection3', () => {
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = false;
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(component, 'submitMailData').and.stub();
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call initPayload', () => {
        component.isHDRefillReminder = false;
        component.checkout.data_deliveryOptions = { checkoutDetails: [{ subType: 'HOMEDELIVERY' }] };
        component.payload.prescriptionList = [{ messages: [{ 'code': 'WAG_RXHOMEDELIVERY_VAL_001' }] }];
        spyOn(component, 'checkAndDisplayPrescriptionsErrorMessage').and.stub();
        component.initPayload();
        expect(component).toBeTruthy();
    });

    it('should call initPayload else', () => {
        component.isHDRefillReminder = true;
        component.initPayload();
        expect(component).toBeTruthy();
    });
    it('should call initCCForm', () => {
        component.disableFormValiation = true;
        component.initCCForm('01/2050');
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection4', () => {
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = true;
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(component, 'submitMailData').and.stub();
        spyOn(userService, 'getCCToken').and.returnValue(Observable.throw('error'));
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call furtherRedirection5', () => {
        component.checkout.hdCCReqPayload = true;
        component.payload.boxDetails = { shippingInfo: { hdCCReqPayload: true, creditCard: { zipCode: '12345' } } };
        component.checkout.isCombo = false;
        component.needCreditCard = false;
        spyOn(routerService, 'navigateByUrl').and.stub();
        spyOn(component, 'submitMailData').and.stub();
        component.furtherRedirection();
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': 'WAG_RXHOMEDELIVERY_001' }] }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage2', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': 'WAG_RXHOMEDELIVERY_VAL_001' }] }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

    it('should call checkAndDisplayPrescriptionsErrorMessage3', () => {
        component.payload.prescriptionList = [{ messages: [{ 'code': '' }], isValidRx: false }];
        component.checkAndDisplayPrescriptionsErrorMessage();
        expect(component).toBeTruthy();
    });

});
