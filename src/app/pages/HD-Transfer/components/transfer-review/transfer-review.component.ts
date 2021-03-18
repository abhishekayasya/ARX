import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { AppContext } from 'app/core/services/app-context.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ROUTES, Microservice } from 'app/config/index';
import { HttpClientService } from 'app/core/services/http.service';
import { MessageService } from 'app/core/services/message.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DateConfigModel } from 'app/models/date-config.model';
import { CommonUtil } from 'app/core/services/common-util.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent, GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { STATE_US, ARX_MESSAGES } from '@app/config';
import { Message } from '@app/models';
// tslint:disable-next-line: import-blacklist
import { Subject } from 'rxjs';

@Component({
  selector: 'arxrf-new-rxreview',
  templateUrl: './transfer-review.component.html',
  styleUrls: ['./transfer-review.component.scss']
})
export class TransferReviewComponent implements OnInit, OnDestroy {
  loader = false;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;
  upgradeCancelModel = false;

  addshippingaddress = false;
  editshippingaddress = false;
  enableaddbutton = true;
  shippAddress: FormGroup;
  addresses: Array<any>;
  deliveryAddress: Array<any>;
  showLoader = true;
  disableSubmitbtn = false;
  newRcInfo: any;
  emailAddress: string;

  dataitem;
  prescriptiondetails: Array<any>;
  pharmacydetails = {
    pharmacyName: '',
    pharmacyPhoneNumber: ''
  };
  patientdetails = {
    patientName: '',
    patientPhoneNumber: '',
    patientDOB: '',
    patientAddress: '',
    patientCity: '',
    patientState: '',
    patientZip: ''
  };

  addedShippingAddress = {
    street: '',
    city: '',
    state: '',
    zipcode: ''
  };

  transferJson: any = {};
  ROUTES = ROUTES;

  STATE_US = STATE_US;
  pcaType: string;
  emailSub = new Subject<boolean>();

  constructor(
    private _http: HttpClientService,
    private _formBuilder: FormBuilder,
    private _common: CommonUtil,
    private _message: MessageService,
    private _router: Router,
    private _gaService: GaService,
    private route: ActivatedRoute
  ) {
    const dateConfig = new DateConfigModel();
    dateConfig.allowFuture = true;
    dateConfig.isCreditCardExpiryDate = true;

    this.shippAddress = this._formBuilder.group({
      street: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: ['', Validators.required]
    });
    if (sessionStorage.getItem('pcaInfo')) {
      this.route.queryParams.subscribe(param => {
        this.pcaType = param.pca;
      });
    }
  }

  ngOnInit() {
    this.emailSub.subscribe(() => {
      if (this.pcaType === 'transfer') {
        sessionStorage.setItem(
          'pcaConfirmationdata',
          JSON.stringify(this.newRcInfo)
        );
        location.replace(
          ROUTES.hd_transfer.children.confirmation_pca.absoluteRoute
        );
      } else {
        location.replace(
          ROUTES.hd_transfer.children.confirmation.absoluteRoute
        );
      }
    });
    if (
      !sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list) &&
      this.pcaType !== 'transfer'
    ) {
      this.cancelPrescription();
    }
    if (this.pcaType === 'transfer') {
      this.disableSubmitbtn = false;
      this.showLoader = false;
    } else {
      this.checkShippingAddressIsAvail();
    }
    this._common.addNaturalBGColor();
    this.getDataFromSesssion();
  }
  checkShippingAddressIsAvail() {
    const request_body = {};
    request_body['profileId'] = localStorage.getItem('uid');
    this._http
      .postData(Microservice.mailservice_address_fetch, request_body)
      .subscribe(res => {
        this.addresses = res.addresses;
        this.deliveryAddress = this.getSelectedAddress(this.addresses);
        if (sessionStorage.getItem('shippingAddress')) {
          const data = JSON.parse(sessionStorage.getItem('shippingAddress'));
          this.addedShippingAddress.street = data['street'];
          this.addedShippingAddress.city = data['city'];
          this.addedShippingAddress.state = data['state'];
          this.addedShippingAddress.zipcode = data['zipcode'];
          this.addshippingaddress = false;
          this.showLoader = false;
          this.disableSubmitbtn = false;
        } else if (this.deliveryAddress !== undefined) {
          this.addedShippingAddress.street = this.deliveryAddress['street1'];
          this.addedShippingAddress.city = this.deliveryAddress['city'];
          this.addedShippingAddress.state = this.deliveryAddress['state'];
          this.addedShippingAddress.zipcode = this.deliveryAddress['zipCode'];
          this.showLoader = false;
          this._gaService.sendEvent(this.transferReviewGAEvent('all'));
        } else {
          this.ShippAddStatus();
        }
      });
  }

  getSelectedAddress(addresses) {
    if (addresses && addresses.length > 0) {
      for (const idx in addresses) {
        if (addresses[idx].preferred || addresses[idx].isPreferred) {
          return addresses[idx];
        }
      }
    }
    return;
  }

  ShippAddStatus() {
    if (this.shippAddress.status === 'INVALID') {
      this.addshippingaddress = true;
      this.showLoader = false;
      this.disableSubmitbtn = true;
    }
  }

  getDataFromSesssion() {
    if (this.pcaType === 'transfer') {
      const patientInfo = JSON.parse(sessionStorage.getItem('pcaInfo'));
      this.newRcInfo = {
        patient: {
          patientName: patientInfo.firstName,
          patientPhoneNumber: patientInfo.phoneNumber,
          patientDOB: patientInfo.dateOfBirth,
          patientAddress: patientInfo.street,
          patientCity: patientInfo.city,
          patientState: patientInfo.state,
          patientZip: patientInfo.zipCode,
          patientEmail: patientInfo.email,
          patientAddressLine2: `${patientInfo.city}, ${patientInfo.state} ${patientInfo.zipCode}`
        },
        pharmacy: {
          pharmacyName: patientInfo.pharmacyName,
          pharmacyPhoneNumber: patientInfo.pharmacyPhoneNumber
        },
        prescriptions: [],
        type: 'xrx'
      };
      const baseForm = {
        prescriptionName: patientInfo.drugname,
        rxNumber: patientInfo.quantity
      };
      if (baseForm['prescriptionName']) {
        this.newRcInfo.prescriptions.push(baseForm);
      }
      patientInfo.prescriptionInfo.map(item => {
        this.newRcInfo.prescriptions.push({
          prescriptionName: item.drugname,
          rxNumber: item.quantity
        });
      });
      this.patientdetails = this.newRcInfo.patient;
      this.pharmacydetails = this.newRcInfo.pharmacy;
      this.prescriptiondetails = this.newRcInfo.prescriptions;
      this.transferJson = JSON.parse(JSON.stringify(this.newRcInfo));
      this.transferJson.patient.patientDOB = this._common.convertDataFormat(
        this.transferJson.patient.patientDOB,
        'MM-dd-yyyy HH:mm'
      );
      this.emailAddress = this.transferJson.patient.patientEmail;
      delete this.transferJson.patient.patientEmail;
      delete this.transferJson.patient.patientAddressLine2;
    } else {
      //istanbul ignore else
      if (
        sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list) != null
      ) {
        this.dataitem = JSON.parse(
          sessionStorage.getItem(AppContext.CONST.hd_transfer_rx_list)
        );
        this.patientdetails = this.dataitem.patient;
        this.pharmacydetails = this.dataitem.pharmacy;
        this.prescriptiondetails = this.dataitem.prescriptions;
        console.log(this.dataitem, 'dataitem');
      }
    }
  }

  generateJson() {
    const prescriptions = [] as any;
    //istanbul ignore else
    if (this.pcaType !== 'transfer') {
      this.prescriptiondetails.forEach(function(key, val) {
        prescriptions.push(key);
      });

      this.transferJson = {
        patient: {
          patientName: this.dataitem.patient.patientName,
          patientPhoneNumber: this.dataitem.patient.patientPhoneNumber,
          patientDOB: this.dataitem.patient.patientDOB,
          patientAddress: this.addedShippingAddress.street,
          patientCity: this.addedShippingAddress.city,
          patientState: this.addedShippingAddress.state,
          patientZip: this.addedShippingAddress.zipcode
        },
        pharmacy: {
          pharmacyName: this.dataitem.pharmacy.pharmacyName,
          pharmacyPhoneNumber: this.dataitem.pharmacy.pharmacyPhoneNumber
        },
        prescriptions: prescriptions,
        type: 'xrx'
      };
    }
    sessionStorage.setItem(
      AppContext.CONST.hd_transfer_rx_list,
      JSON.stringify(this.transferJson)
    );
    if (this.pcaType === 'transfer') {
      this.transferJson.type = 'pcaxrx';
    }
    this._http
      .postRxData(Microservice.hd_transfer_review_submit, this.transferJson)
      .subscribe(
        res => {
          this.loader = false;
          this.loaderOverlay = false;
          if (res.requestId) {
            this.emailConfirmation(res.requestId);
          }
        },
        error => {
          this.loader = false;
          this.loaderOverlay = false;
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          return false;
        }
      );
  }

  addShippAddress() {
    if (!this.shippAddress.valid) {
      this._common.validateForm(this.shippAddress);
      return;
    }
    const formObj = this.shippAddress.getRawValue();
    sessionStorage.setItem('shippingAddress', JSON.stringify(formObj));
    this._gaService.sendEvent(this.transferReviewGAEvent('zero state'));
    this.addedShippingAddress.street = this.shippAddress.value.street;
    this.addedShippingAddress.city = this.shippAddress.value.city;
    this.addedShippingAddress.state = this.shippAddress.value.state;
    this.addedShippingAddress.zipcode = this.shippAddress.value.zipcode;
    this.addshippingaddress = false;
    this.disableSubmitbtn = false;
  }

  editShippAddress() {
    if (this.pcaType === 'transfer') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.EDIT_PATIENT_INFO
      });
    } else {
      this._gaService.sendEvent(
        this.transferReviewGAEvent('editShippingAddress')
      );
    }
    const formObj = JSON.parse(sessionStorage.getItem('shippingAddress'));
    if (formObj) {
      this.shippAddress.setValue(formObj);
    } else {
      this.shippAddress = this._formBuilder.group({
        street: this.addedShippingAddress.street,
        city: this.addedShippingAddress.city,
        state: this.addedShippingAddress.state,
        zipcode: this.addedShippingAddress.zipcode
      });
    }
    this.addshippingaddress = true;
    this.editshippingaddress = true;
    this.enableaddbutton = false;
    this.disableSubmitbtn = true;
  }

  updateShippAddress() {
    //istanbul ignore else
    if (!this.shippAddress.valid) {
      this._common.validateForm(this.shippAddress);
      return;
    }
    this._gaService.sendEvent(
      this.transferReviewGAEvent('Update Shipping address')
    );
    const formObj = this.shippAddress.getRawValue();
    sessionStorage.setItem('shippingAddress', JSON.stringify(formObj));
    this.addedShippingAddress.street = this.shippAddress.value.street;
    this.addedShippingAddress.city = this.shippAddress.value.city;
    this.addedShippingAddress.state = this.shippAddress.value.state;
    this.addedShippingAddress.zipcode = this.shippAddress.value.zipcode;
    this.addshippingaddress = false;
    this.disableSubmitbtn = false;
  }

  prefillAddressComponents(data) {
    this.shippAddress.patchValue({
      city: data.city,
      state: data.state,
      zipcode: data.zipCode
    });
  }

  transferPrescriptionGAEvent(property: string = ''): GAEvent {
    const event = <GAEvent>{};
    if (property === 'cancel') {
      event.category = GA.categories.hd_transfer_prescription;
      event.action = GA.actions.hd_transferprescription.cancel;
    } else {
      event.category = GA.categories.hd_transfer_prescription;
      event.action = GA.actions.hd_transferprescription.removal;
    }

    return event;
  }

  cancelShippAddress() {
    this._gaService.sendEvent(
      this.transferReviewGAEvent('Cancel Shipping address')
    );
    this.addshippingaddress = false;
    this.disableSubmitbtn = false;
  }

  submitRequest() {
    if (this.pcaType === 'transfer') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.SUBMIT_REQUEST_REVIEW
      });
    } else {
      this._gaService.sendEvent(this.transferReviewGAEvent('submitRequest'));
    }
    this.loader = true;
    this.loaderOverlay = true;
    sessionStorage.removeItem('shippingAddress');
    this.generateJson();
  }

  cancelPrescription() {
    this._router.navigateByUrl(
      ROUTES.hd_transfer.children.prescription.absoluteRoute
    );
  }

  hideUpgradeCancelModel(event) {
    //istanbul ignore else
    if (!event) {
      this.upgradeCancelModel = false;
    }
  }

  cancelRequest() {
    if (this.pcaType === 'transfer') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.CANCEL_REVIEW
      });
    } else {
      this._gaService.sendEvent(this.transferReviewGAEvent('cancel'));
    }
    this.upgradeCancelModel = true;
  }

  editprescription(source?: string) {
    if (this.pcaType === 'transfer') {
      if (source === 'shippingAddress') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_SHIPPING_ADDRESS
        });
      } else if (source === 'prescriptions') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_PRESCPTIONS
        });
      } else if (source === 'patientInfo') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_PATIENT_INFO
        });
      }
      this._common.navigate(
        ROUTES.hd_transfer.children.prescription_pca.absoluteRoute
      );
    } else {
      this._gaService.sendEvent(this.transferReviewGAEvent('editPrecription'));
      this._common.navigate(
        ROUTES.hd_transfer.children.prescription.absoluteRoute
      );
    }
  }

  cancelUpgradeProcess() {
    if (this.pcaType === 'transfer') {
      sessionStorage.removeItem('pcaInfo');
      this._common.navigate(
        ROUTES.hd_transfer.children.prescription_pca.absoluteRoute
      );
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.CONFIRM_CANCEL_REVIEW
      });
    } else {
      sessionStorage.removeItem('shippingAddress');
      this._gaService.sendEvent(this.transferReviewGAEvent('cancelUpgrade'));
      sessionStorage.removeItem(AppContext.CONST.hd_transfer_rx_list);
      this._common.navigate('/myaccount');
    }
  }

  transferReviewGAEvent(property: string = ''): GAEvent {
    const event = <GAEvent>{};
    if (property === 'editPrecription') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.edit;
    } else if (property === 'editShippingAddress') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.editShippingAddress;
    } else if (property === 'submitRequest') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.submitRequest;
    } else if (property === 'All') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.all;
    } else if (property === 'zero state') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.zero_state;
    } else if (property === 'Cancel Shipping address') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.Cancel_Shipping_address;
    } else if (property === 'Update Shipping address') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.Update_Shipping_address;
    } else if (property === 'cancelUpgrade') {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.cancelReq;
    } else {
      event.category = GA.categories.hd_transfer;
      event.action = GA.actions.hd_transfer.cancel;
    }
    return event;
  }

  emailConfirmation(reqId: string) {
    this.transferJson['email'] = {
      requestId: reqId,
      mask: 'Y'
    };
    if (this.pcaType === 'transfer') {
      this.transferJson['email'].emailId = this.emailAddress;
    } else {
      this.transferJson['email'].emailId = JSON.parse(
        localStorage.getItem('u_info')
      ).basicProfile.email;
    }

    this._http
      .postRxData(Microservice.hd_transferRx_confirmation, this.transferJson)
      .subscribe(
        res => {
          this.loader = false;
          this.loaderOverlay = false;
          if (res.status === 200) {
            this.emailSub.next(true);
          }
        },
        () => {
          this.loader = false;
          this.loaderOverlay = false;
          this._message.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.service_failed,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
          this.emailSub.next(true);
        }
      );
  }

  ngOnDestroy(): void {
    this.emailSub.unsubscribe();
  }
}
