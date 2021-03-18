import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";

import { ShippingAddress } from "@app/models";
import { UserService } from "@app/core/services/user.service";
import { EditShippingRequest } from "@app/models";
import { Prescription } from "@app/models";
import { AppContext } from "@app/core/services/app-context.service";
import { HttpClientService } from "@app/core/services/http.service";
import { MessageService } from "@app/core/services/message.service";
import { Message } from "@app/models/message.model";
import { ARX_MESSAGES } from "@app/config/messages.constant";
import { ValidateDate } from "@app/shared/validators/date.validator";
import { DateConfigModel } from "@app/models/date-config.model";
import { validateConfig } from "@angular/router/src/config";
import { RefillBaseService } from "@app/core/services/refill-base.service";
import { STATE_US, Microservice } from "@app/config";
import { CommonUtil } from "app/core/services/common-util.service";

@Component({
  selector: "arxrf-refillhub-editShipping",
  templateUrl: "./edit-shipping.component.html",
  styleUrls: ["./edit-shipping.component.scss"]
})
export class EditShippingComponent implements AfterViewInit, OnInit {
  @Input() shippingObservable: Observable<Prescription>;

  public shippingForm: FormGroup;

  private _prescription: Prescription;

  isCCDetailAvailable = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSuccess = new EventEmitter<boolean>();

  isCreditCardEditable = true;
  creditCardNumber;
  creditCardExpiryDate;
  creditCardZip;
  autoCCpayload;
  CCardType;
  ccTransactionId;

  @Input()
  showPaymentMessage = false;

  STATE_US = STATE_US;

  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _messageService: MessageService,
    public _refillService: RefillBaseService,
    private _common: CommonUtil
  ) {
    const dateConfig = new DateConfigModel();
    dateConfig.allowFuture = true;
    dateConfig.isCreditCardExpiryDate = true;

    this.shippingForm = this._formBuilder.group({
      city: ["", Validators.required],
      state: ["", Validators.required],
      zip: ["", Validators.required],
      street1: ["", Validators.required],
      ccZip: [""],
      ccNumber: [""],
      expDate: ["", ValidateDate(dateConfig)]
    });
  }

  ngOnInit() {
    this.shippingObservable.subscribe(prescription => {
      if (prescription !== undefined) {
        this._prescription = prescription;
        if (prescription.additionalAutoRefillInfo !== undefined) {
          // this.shippingForm.patchValue(prescription.additionalAutoRefillInfo.shippingInfo);
          this.shippingForm.patchValue({
            city:
              prescription.additionalAutoRefillInfo.deliverySettings
                .shippingInfo.address.city,
            state:
              prescription.additionalAutoRefillInfo.deliverySettings
                .shippingInfo.address.state,
            zip: prescription.additionalAutoRefillInfo.deliverySettings.shippingInfo.address.zip.substring(
              0,
              5
            ),
            street1:
              prescription.additionalAutoRefillInfo.deliverySettings
                .shippingInfo.address.street1
          });
          // this.fillCardData();
          this.setCreditCardView();
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  /**
   * Patching credit card details coming from service response as billing info.
   */
  fillCardData() {
    if (
      this._prescription.additionalAutoRefillInfo.deliverySettings !== undefined
    ) {
      this.isCreditCardEditable = false;
      const ccData = {
        ccNumber: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.creditCardNumber,
        expDate: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.expDate,
        ccZip: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.zip
      };

      this.shippingForm.patchValue(ccData);
    }
  }

  setCreditCardView() {
    if (
      this._prescription.additionalAutoRefillInfo.deliverySettings !== undefined
    ) {
      this.isCreditCardEditable = false;
      const ccData = {
        ccNumber: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.creditCardNumber,
        ccDate: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.expDate,
        ccZip: this._prescription.additionalAutoRefillInfo.deliverySettings
          .shippingInfo.zip
      };
      this.creditCardNumber = ccData.ccNumber;
      this.creditCardExpiryDate = ccData.ccDate;
      this.creditCardZip = ccData.ccZip;
    }
  }

  updateShippingInfo() {
    // tslint:disable-next-line: max-line-length
    if (!this.isCreditCardEditable) {
      this.updateShippingInfosave();
    } else {
      const encrypt_cc = this._common.encryptCCNumber(
        this.shippingForm.value.ccNumber
          ? this.shippingForm.value.ccNumber
          : this._prescription.additionalAutoRefillInfo.deliverySettings
              .shippingInfo.creditCardNumber
      );
      this.autoCCpayload = {
        creditCard: [
          {
            creditCardType: this.CCardType,
            // tslint:disable-next-line: max-line-length
            expDate: this.shippingForm.value.expDate
              ? this.shippingForm.value.expDate
              : this._prescription.additionalAutoRefillInfo.deliverySettings
                  .shippingInfo.expDate,
            ccTokenNumber: encrypt_cc.number,
            rxType: "HOMEDELIVERY",
            subfid9B: encrypt_cc.subfid9B,
            // tslint:disable-next-line: max-line-length
            zipCode: this.shippingForm.value.ccZip
              ? this.shippingForm.value.ccZip
              : this._prescription.additionalAutoRefillInfo.deliverySettings
                  .shippingInfo.zip
          }
        ]
      };

      this._userService.getCCToken(this.autoCCpayload).subscribe(
        res => {
          if (res.tokenDetails[0].transactionId) {
            this.ccTransactionId = res.tokenDetails[0].transactionId;
            this.updateShippingInfosave();
          } else {
            // handle error
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        err => {
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    }
  }

  updateShippingInfosave() {
    // let url = `/svc/profiles/${this._refillService.activeMemberId}/rxautorefill`;

    this._refillService.loaderStatus = true;
    this._refillService.loaderOverlay = true;

    this._httpService
      .doPost(
        Microservice.autorefill_save,
        this.prepareRequestData(this._refillService.activeMemberId)
      )
      .then(response => {
        const _body = response.json();

        if (_body.messages !== undefined) {
          this._messageService.addMessage(
            new Message(
              _body.messages[0].message,
              ARX_MESSAGES.MESSAGE_TYPE[_body.messages[0].type.toUpperCase()]
            )
          );
          this._refillService.loaderStatus = false;
          this._refillService.loaderOverlay = false;
        } else {
          this.onSuccess.emit(true);
          this._messageService.addMessage(
            new Message(
              "Your change is updated for all Rx.",
              ARX_MESSAGES.MESSAGE_TYPE.SUCCESS
            )
          );

          if (!this._prescription.autoRefillInfo["autoRefillEnabled"]) {
            this._refillService
              .autoRefillFN(true, this._prescription.viewId)
              // tslint:disable-next-line: no-shadowed-variable
              .then(response => {
                this._refillService.loaderStatus = false;
                this._refillService.loaderOverlay = false;
                const body = response.json();
                if (body.prescription.messages === undefined) {
                  // tslint:disable-next-line: max-line-length
                  const masterIndex = this._refillService.getPrescriptionIndex(
                    this._refillService.masterData.prescriptions,
                    this._prescription.viewId
                  );

                  this._refillService.masterData.prescriptions[
                    masterIndex
                  ].autoRefillInfo["autoRefillEnabled"] =
                    body.prescription.autoRefillInfo["autoRefillEnabled"];

                  this._refillService.masterData.prescriptions[
                    masterIndex
                  ].autoRefillInfo["autoRefillDate"] =
                    body.prescription.autoRefillInfo["autoRefillDate"];

                  this._refillService.masterData.prescriptions[
                    masterIndex
                  ].autoRefillInfo["newRefillDate"] =
                    body.prescription.autoRefillInfo["newRefillDate"];
                }
              });
          } else {
            this._refillService.loaderStatus = false;
          }
        }
      })
      .catch(error => {
        this._refillService.loaderStatus = false;
        this._refillService.loaderOverlay = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
  }

  prepareRequestData(activeMemberId): EditShippingRequest {
    const requestData = <EditShippingRequest>{};
    requestData.fId = "";
    if (activeMemberId === this._userService.user.id) {
      delete requestData.fId;
    } else {
      requestData.fId = activeMemberId;
    }
    requestData.order = "asc";
    requestData.sort = "prescription";
    requestData.prescriptionType = this._prescription.prescriptionType;
    requestData.deliverySettings = <any>{
      isAddressChanged: true,
      selectedLocation: "Ship",

      shippingInfo: {
        address: {
          street1: this.shippingForm.value.street1,
          city: this.shippingForm.value.city,
          state: this.shippingForm.value.state,
          zip: this.shippingForm.value.zip
        },
        // tslint:disable-next-line: max-line-length
        creditCardNumber: this.shippingForm.value.ccNumber
          ? this.shippingForm.value.ccNumber
          : this._prescription.additionalAutoRefillInfo.deliverySettings
              .shippingInfo.creditCardNumber,
        // tslint:disable-next-line: max-line-length
        expDate: this.shippingForm.value.expDate
          ? this.shippingForm.value.expDate
          : this._prescription.additionalAutoRefillInfo.deliverySettings
              .shippingInfo.expDate,
        // tslint:disable-next-line: max-line-length
        zip: this.shippingForm.value.ccZip
          ? this.shippingForm.value.ccZip
          : this._prescription.additionalAutoRefillInfo.deliverySettings
              .shippingInfo.zip,
        transactionId: this.ccTransactionId || ""
      }
    };

    return requestData;
  }

  updateCreditCard() {
    this.isCreditCardEditable = true;
  }

  updateCCType($event) {
    this.CCardType = $event.type;
  }
}
