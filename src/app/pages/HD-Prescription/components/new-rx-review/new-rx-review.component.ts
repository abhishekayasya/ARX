import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppContext } from '@app/core/services/app-context.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROUTES, ARX_MESSAGES, Microservice, STATE_US } from '@app/config';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { AddressBookService } from '@app/core/services/address-book.service';
import { Message } from '@app/models';
import { HttpClientService } from '@app/core/services/http.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { GA } from '@app/config/ga-constants';
import { GAEvent, GaData, TwoFAEnum } from '@app/models/ga/ga-event';
import { GaService } from '@app/core/services/ga-service';
import { JsonPipe } from '@angular/common';
import { async } from '@angular/core/testing';
// tslint:disable-next-line: import-blacklist
import { Subject } from 'rxjs';

// natpdfgen response message for success
const FINAL_RESPONSE_SUCCESS_CODE = 'ARX_5001_CREATED';

@Component({
  selector: 'arxrf-new-rxreview',
  templateUrl: './new-rx-review.component.html',
  styleUrls: ['./new-rx-review.component.scss']
})
export class NewRxReviewComponent implements OnInit, OnDestroy {
  STATE_US = STATE_US;

  addressSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  editObservable: Observable<any> = this.addressSubject.asObservable();

  loader = false;
  loaderMessage = 'Please wait while processing your request...';
  loaderOverlay = false;

  addshippingaddress = false;
  editshippingaddress = false;
  enableaddbutton = true;

  upgradeCancelModel = false;
  editPrescriptionLink;

  shippingMethod: { message: string };

  address: any;
  _editAddressForm: FormGroup;
  newRxDetails: any;
  pcaType: string;
  pcaConfirmationdata: any;
  emailSub = new Subject<boolean>();

  constructor(
    private _formBuilder: FormBuilder,
    public appContext: AppContext,
    private _http: HttpClientService,
    private _common: CommonUtil,
    private _router: Router,
    public addressesService: AddressBookService,
    private _message: MessageService,
    private _gaService: GaService,
    private route: ActivatedRoute
  ) {
    this.initializeRequest();
  }

  initializeRequest() {
    this._editAddressForm = this._formBuilder.group({
      street: ['', [Validators.required, this._common.onlyWhitespaceValidator]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required]
    });
    if (sessionStorage.getItem('pcaInfo')) {
      this.route.queryParams.subscribe(param => (this.pcaType = param.pca));
    }
    if (this.pcaType === 'new') {
      const patientInfo = JSON.parse(sessionStorage.getItem('pcaInfo'));
      const newRcInfo = {
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
        type: 'pcanrx'
      };
      const prescriptions = [];
      if (patientInfo.displayBaseForm) {
        prescriptions.push({
          doctorName: patientInfo.doctorName,
          doctorPhoneNumber: patientInfo.doctorphone,
          drugName: patientInfo.drugname,
          drugQuantity: patientInfo.quantity,
          genericEquivalent: patientInfo.terms ? 'Y' : 'N'
        });
      }
      patientInfo.prescriptionInfo.forEach(function(item) {
        prescriptions.push({
          doctorName: item.doctorName,
          doctorPhoneNumber: item.doctorphone,
          drugName: item.drugname,
          drugQuantity: item.quantity,
          genericEquivalent: item.terms ? 'Y' : 'N'
        });
      });
      newRcInfo['prescriptions'] = prescriptions;
      this.newRxDetails = newRcInfo;
    } else {
      this.newRxDetails = JSON.parse(sessionStorage.getItem('Nrx'));
    }

    this.shippingMethod = {
      message: 'Arrival in 5-10  business days.'
    };
    if (this.pcaType === 'new') {
      this.addshippingaddress = false;
    } else {
      this.loader = true;
      this.loaderOverlay = true;
      this.fetchAddressList().subscribe(
        res => {
          this.loader = false;
          this.loaderOverlay = false;
          if (res.addresses !== undefined) {
            this.address = this.getSelectedAddress(res.addresses);
          } else {
            this.addshippingaddress = true;
          }
          if (sessionStorage.getItem('shippingAddress')) {
            const data = JSON.parse(sessionStorage.getItem('shippingAddress'));
            this.newRxDetails.patient.patientAddress = data['street'];
            this.newRxDetails.patient.patientCity = data['city'];
            this.newRxDetails.patient.patientState = data['state'];
            this.newRxDetails.patient.patientZip = data['zipCode'];
            this.addshippingaddress = false;
          } else if (this.address) {
            this.addshippingaddress = false;
            this.newRxDetails.patient.patientAddress = this.address['street1'];
            this.newRxDetails.patient.patientCity = this.address['city'];
            this.newRxDetails.patient.patientState = this.address['state'];
            this.newRxDetails.patient.patientZip = this.address['zipCode'];

            this._editAddressForm.patchValue({
              street: this.address['street1'],
              city: this.address['city'],
              state: this.address['state'],
              zipCode: this.address['zipCode']
            });
          } else {
            this.addshippingaddress = true;
          }
        },
        () => {
          this.onsubmitError();
        }
      );
    }
  }

  ngOnInit(): void {
    this.emailSub.subscribe(() => {
      if (this.pcaType === 'new') {
        sessionStorage.setItem(
          'pcaConfirmationdata',
          JSON.stringify(this.pcaConfirmationdata)
        );
        this.redirectToRoute(
          ROUTES.hd_prescription.children.confirmation_pca.absoluteRoute
        );
      } else {
        this.redirectToRoute(
          ROUTES.hd_prescription.children.confirmation.absoluteRoute
        );
      }
    });
    this.editPrescriptionLink =
      ROUTES.hd_prescription.children.prescription.absoluteRoute;
  }

  prefillAddressComponents(data) {
    this._editAddressForm.patchValue(data);
  }

  submitPrescription() {
    if (this.pcaType === 'new') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_REVIEW_SUBMIT
      });
    } else {
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_rx_prescription_review.submit_request_button
        )
      );
    }

    this.loader = true;
    this.loaderOverlay = true;
    let emailId: string;
    if (this.pcaType === 'new') {
      this.pcaConfirmationdata = JSON.parse(JSON.stringify(this.newRxDetails));
      emailId = this.newRxDetails.patient.patientEmail;
      delete this.newRxDetails.patient.patientEmail;
      delete this.newRxDetails.patient.patientAddressLine2;
      this.newRxDetails.patient.patientDOB = this._common.convertDataFormat(
        this.newRxDetails.patient.patientDOB,
        'MM-dd-yyyy HH:mm'
      );
    }
    sessionStorage.setItem('Nrx', JSON.stringify(this.newRxDetails));
    this._http
      .postRxData(Microservice.hd_new_review_submit, this.newRxDetails)
      .subscribe(
        res => {
          this.loader = false;
          this.loaderOverlay = false;

          if ( res.message && res.message === FINAL_RESPONSE_SUCCESS_CODE ) {
            if (res.requestId) {
              this.emailConfirmation(res.requestId, emailId);
            }
          }
        },
        () => {
          this.onsubmitError();
        }
      );
  }

  cancelRequest() {
    if (this.pcaType === 'new') {
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_REVIEW_CANCEL
      });
    } else {
      this._gaService.sendEvent(this.transferReviewGAEvent());
    }
    this.upgradeCancelModel = true;
  }

  transferReviewGAEvent(): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.new_rx_prescription_review;
    event.action = GA.actions.hd_transfer.cancel;
    return event;
  }

  hideUpgradeCancelModel(event) {
    if (!event) {
      this.upgradeCancelModel = false;
      this._gaService.sendEvent(
        this.gaEvent(
          GA.actions.new_rx_prescription_review.remove_modal,
          GA.label.new_prescription_review
        )
      );
    }
  }

  cancelUpgradeProcess() {
    if (this.pcaType === 'new') {
      sessionStorage.removeItem('pcaInfo');
      this._gaService.sendGoogleAnalytics(<GaData>{
        type: TwoFAEnum.PCA_CONTINUE_CLICK
      });
      this.goBackPrescriptionPage();
    } else {
      sessionStorage.removeItem('Nrx');
      sessionStorage.removeItem('shippingAddress');
      this._gaService.sendEvent(this.gaEvent(GA.label.new_prescription_review));
      this.redirectToRoute(ROUTES.account.absoluteRoute);
    }
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

  fetchAddressList() {
    const request_body = {};
    request_body['profileId'] = localStorage.getItem('uid');

    return this._http.postData(
      Microservice.mailservice_address_fetch,
      request_body
    );
  }

  editShippAddress() {
    this.addshippingaddress = true;
    this.editshippingaddress = true;
    this.enableaddbutton = false;
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.new_rx_prescription_review.edit_shipping_address)
    );
    const formObj = JSON.parse(sessionStorage.getItem('shippingAddress'));
    if (formObj) {
      this._editAddressForm.setValue(formObj);
    }
  }

  updateShippAddress() {
    if (!this._editAddressForm.valid) {
      this._common.validateForm(this._editAddressForm);
      return;
    }
    const formObj = this._editAddressForm.getRawValue();
    sessionStorage.setItem('shippingAddress', JSON.stringify(formObj));
    this.newRxDetails.patient.patientAddress = this._editAddressForm.value.street;
    this.newRxDetails.patient.patientCity = this._editAddressForm.value.city;
    this.newRxDetails.patient.patientState = this._editAddressForm.value.state;
    this.newRxDetails.patient.patientZip = this._editAddressForm.value.zipCode;

    this.addshippingaddress = false;
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.new_rx_prescription_review.update_address_button)
    );
  }

  cancelShippAddress() {
    this.addshippingaddress = false;
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.new_rx_prescription_review.cancel_address_button)
    );
  }

  gaEvent(action, label = ''): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.new_rx_prescription_review;
    event.action = action;
    event.label = label;
    return event;
  }

  goBackPrescriptionPage(source?: string) {
    if (this.pcaType === 'new') {
      if (source === 'shippingAddress') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_SHIPPING_ADDRESS_NEW
        });
      } else if (source === 'prescriptions') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_PRESCPTIONS_NEW
        });
      } else if (source === 'patientInfo') {
        this._gaService.sendGoogleAnalytics(<GaData>{
          type: TwoFAEnum.EDIT_PATIENT_INFO_NEW
        });
      }
    } else {
      this._gaService.sendEvent(
        this.gaEvent(GA.actions.new_rx_prescription_review.edit_prescription)
      );
    }

    let url: string;
    if (this.pcaType === 'new') {
      url =
        ROUTES.hd_prescription.children.new_prescription_patient_info
          .absoluteRoute;
    } else {
      url = ROUTES.hd_prescription.children.prescription.absoluteRoute;
    }
    this._router.navigateByUrl(url);
  }

  emailConfirmation(reqId: string, emailId: string) {
    this.newRxDetails['email'] = {
      requestId: reqId,
      mask: 'Y'
    };
    if (this.pcaType === 'new') {
      this.newRxDetails['email'].emailId = emailId;
    } else {
      this.newRxDetails['email'].emailId = JSON.parse(
        localStorage.getItem('u_info')
      ).basicProfile.email;
    }

    this.loader = true;
    this.loaderOverlay = true;
    this._http
      .postRxData(Microservice.hd_newRx_confirmation, this.newRxDetails)
      .subscribe(
        res => {
          this.loader = false;
          this.loaderOverlay = false;
          this.emailSub.next(true);
        },
        () => {
          this.onsubmitError();
          this.emailSub.next(true);
        }
      );
  }
  get patientInfo() {
    return this.newRxDetails.patient;
  }

  get getHeaderText() {
    return this.pcaType !== 'new' && this.pcaType !== 'transfer'
      ? `New prescription`
      : `Patient Information`;
  }
  onsubmitError() {
    this.loader = false;
    this.loaderOverlay = false;
    this._message.addMessage(
      new Message(
        ARX_MESSAGES.ERROR.service_failed,
        ARX_MESSAGES.MESSAGE_TYPE.ERROR
      )
    );
  }

  redirectToRoute(param) {
    location.replace(param);
  }

  ngOnDestroy(): void {
    this.emailSub.unsubscribe();
  }
}
