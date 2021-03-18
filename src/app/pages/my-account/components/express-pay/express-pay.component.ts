import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { UserService } from "@app/core/services/user.service";
import { HttpClientService } from "@app/core/services/http.service";
import { CommonUtil } from "@app/core/services/common-util.service";
import { ARX_MESSAGES, ROUTES, Microservice } from "@app/config";
import { Message } from "@app/models";
import { MessageService } from "@app/core/services/message.service";

import { GA } from "@app/config/ga-constants";
import { GAEvent } from "@app/models/ga/ga-event";
import { GaService } from "@app/core/services/ga-service";

@Component({
  templateUrl: "./express-pay.component.html",
  selector: "arxrf-express-pay",
  styleUrls: ["./express-pay.component.scss"]
})
export class ExpressPayComponent implements OnInit {
  public _expressPayForm: FormGroup;
  loaderState = true;
  addCardBlock = false;
  addCardForm = false;
  showCardBlock = false;
  creditCardNumber: number;
  ccExpiryDate;
  ccZip: number;
  cardType: string;
  ccExpiryMonth;
  ccExpiryYear;
  fullCCNumber: number;

  isDeleteModalVisible = false;
  public isPastRouteEdit = false;
  constructor(
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _util: CommonUtil,
    private _gaService: GaService
  ) {
    this._util.removeNaturalBGColor();
  }
  ngOnInit(): void {
    this.getExpressPayCard();
  }
  getExpressPayCard(retainMessages: boolean = false) {
    this._httpService
      .postData(Microservice.retrieve_expresspay, {}, false, retainMessages)
      .subscribe(
        res => {
          this.loaderState = false;
          if (res.creditCard) {
            this.addCardBlock = false;
            this.showCardBlock = true;
            this.fullCCNumber = res.creditCard;
            this.creditCardNumber = res.creditCard.slice(-5);
            this.ccExpiryMonth = res.expiryMonth;
            this.ccExpiryYear = res.expiryYear;
            this.cardType = res.creditCardType;
            this.ccExpiryDate =
              this.ccExpiryMonth + "/" + this.ccExpiryYear.slice(-2);
            this.ccZip = res.zipCode;

            // istanbul ignore else
            if (res.messages) {
              this._messageService.addMessage(
                new Message(res.messages[0].message, res.messages[0].type)
              );
            }
          } else {
            this.addCardBlock = true;
          }
        },
        error => {
          this.loaderState = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
  }
  addCreditCard(isEdit: boolean) {
    this.fireAddCreditCardGAEvent();
    this._messageService.clear();
    this.isPastRouteEdit = isEdit;
    this.addCardBlock = false;
    this.showCardBlock = false;
    this.addCardForm = true;
    this.createExpressPayForm();
    // istanbul ignore else
    if (isEdit) {
      this.setValueToEdit();
    }
  }
  createExpressPayForm() {
    this._expressPayForm = this._formBuilder.group({
      ccNumber: ["", Validators.required],
      expDate: ["", Validators.required],
      ccZip: ["", Validators.required]
    });
  }
  setValueToEdit() {
    this._expressPayForm.patchValue({
      ccNumber: this.fullCCNumber,
      expDate: this.ccExpiryDate,
      ccZip: this.ccZip
    });
  }
  saveCreditCard(isDelete: boolean) {
    this.fireSaveCreditCardGAEvent();
    // let url = `/svc/profiles/${this._userService.user.id}/rxsettings/expresspay`,
    let requestBody;
    this.loaderState = true;
    let encrypted_data;
    // istanbul ignore else
    if (!isDelete) {
      encrypted_data = this._util.encryptCCNumber(
        this._expressPayForm.value.ccNumber
      );

      // istanbul ignore else
      if (encrypted_data === undefined && encrypted_data.number === undefined) {
        this._messageService.addMessage(
          new Message(
            "Unable to process your request. Please try again",
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
        return;
      }
      requestBody = this.prepareRequestDataToUpdate(encrypted_data);
      // get transacionId
      this._userService.getCCToken(requestBody).subscribe(
        res => {
          if (res.tokenDetails[0].transactionId) {
            requestBody = { transactionId: res.tokenDetails[0].transactionId };
            this.submitCCData(requestBody, isDelete);
          } else {
            // handle error
            this.loaderState = false;
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        },
        err => {
          this.loaderState = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    } else {
      requestBody = { transactionId: "delete" };
      this.submitCCData(requestBody, isDelete);
    }
  }

  submitCCData(requestBody, isDelete) {
    this._httpService
      .doPost(Microservice.submit_expresspay, requestBody)
      .then(response => {
        this.loaderState = false;
        this.isDeleteModalVisible = false;
        const _body = response.json(),
          codeToCheck = isDelete
            ? "WAG_I_RX_SETTINGS_010"
            : "WAG_I_RX_SETTINGS_004";
        if (_body.messages[0].code === codeToCheck) {
          if (isDelete) {
            this.addCardBlock = true;
            this.showCardBlock = false;
          } else {
            this.addCardForm = false;
          }
          this.getExpressPayCard(true);
          this._messageService.addMessage(
            new Message(
              _body.messages[0].message,
              _body.messages[0].type.toUpperCase()
            )
          );
        } else {
          this._messageService.addMessage(
            new Message(
              _body.messages[0].message,
              _body.messages[0].type.toUpperCase()
            )
          );
        }
      })
      .catch(error => {
        this.isDeleteModalVisible = false;
        this.loaderState = false;
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
  }
  prepareRequestDataToUpdate(encrypted_data) {
    let requestData = {};
    requestData = {
      creditCard: [
        {
          ccTokenNumber: encrypted_data.number,
          subfid9B: encrypted_data.subfid9B,
          creditCardType: this.cardType,
          expiryMonth: this._expressPayForm.value.expDate.slice(0, 2),
          expiryYear: "20" + this._expressPayForm.value.expDate.slice(-2),
          zipCode: this._expressPayForm.value.ccZip
        }
      ]
    };
    return requestData;
  }

  deleteCreditCard() {
    this.saveCreditCard(true);
  }

  goBackToPreviousRoute() {
    this.fireCancelCreditCardGAEvent();
    if (this.isPastRouteEdit) {
      this.showCardBlock = true;
      this.addCardBlock = false;
      this.addCardForm = false;
    } else {
      this.addCardBlock = true;
      this.addCardForm = false;
      this.showCardBlock = false;
    }
  }

  deleteConfirm(event, deleteCard) {
    if (deleteCard) {
      this.deleteCreditCard();
      this.isDeleteModalVisible = false;
    } else {
      this.isDeleteModalVisible = false;
    }
  }

  deleteModalUpdate(event: boolean) {
    // istanbul ignore else
    if (!event) {
      this.isDeleteModalVisible = false;
    }
  }

  showDeleteModal() {
    this.fireDeleteCreditCardGAEvent();
    this._messageService.clear();
    this.isDeleteModalVisible = true;
  }

  /**
   * update cc type on cc number enter.
   *
   * @param event
   */
  updateCCType(event) {
    this.cardType = event.type;
  }

  fireAddCreditCardGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.express_pay.edit_express_pay_card)
    );
  }

  fireSaveCreditCardGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.express_pay.save_express_pay_card)
    );
  }

  fireDeleteCreditCardGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.express_pay.delete_express_pay_card)
    );
  }

  fireCancelCreditCardGAEvent() {
    this._gaService.sendEvent(
      this.gaEvent(GA.actions.express_pay.cancel_express_pay_card)
    );
  }

  gaEvent(action, label = ""): GAEvent {
    const event = <GAEvent>{};
    event.category = GA.categories.my_account_express_pay;
    event.action = action;
    event.label = label;
    return event;
  }
}
