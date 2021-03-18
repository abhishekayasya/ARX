import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { MessageService } from '@app/core/services/message.service';

@Component({
  templateUrl: './express-pay-members.component.html',
  selector: 'arxrf-express-pay-members',
  styleUrls: ['./express-pay-members.component.scss']
})
export class ExpressPayMembersComponent implements OnInit {
  private _expressPayForm: FormGroup;
  loaderState = true;
  loaderOverlay = false;
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

  activemember: string;

  isDeleteModalVisible = false;
  public isPastRouteEdit = false;
  constructor(
    private _userService: UserService,
    private _httpService: HttpClientService,
    private _formBuilder: FormBuilder,
    private _messageService: MessageService,
    private _util: CommonUtil
  ) {
    this._util.removeNaturalBGColor();
  }
  ngOnInit(): void {
    this.activemember = this._userService.getActiveMemberId();
    this.getExpressPayCard();
  }
  getExpressPayCard(retainMessages: boolean = false) {
    const url = `/svc/profiles/${this.activemember}/rxsettings`;
    this.loaderState = true;
    this._httpService.getData(url, retainMessages).subscribe(
      res => {
        this.loaderState = false;
        this.loaderOverlay = false;
        if (res.expressPay) {
          this.addCardBlock = false;
          this.showCardBlock = true;
          this.fullCCNumber = res.expressPay.cardNumber;
          this.creditCardNumber = res.expressPay.cardNumber.slice(-5);
          this.ccExpiryMonth = res.expressPay.expiryMonth;
          this.ccExpiryYear = res.expressPay.expiryYear;
          this.cardType = res.expressPay.creditCardType;
          this.ccExpiryDate =
            this.ccExpiryMonth + '/' + this.ccExpiryYear.slice(-2);
          this.ccZip = res.expressPay.zipCode;
          if (res.expressPay.messages) {
            this._messageService.addMessage(
              new Message(res.messages[0].message, res.messages[0].type)
            );
          }
        } else {
          this.addCardBlock = true;
          this.showCardBlock = false;
        }
      },
      error => {
        this.loaderState = false;
        this.loaderOverlay = false;
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
    this._messageService.clear();
    this.isPastRouteEdit = isEdit;
    this.addCardBlock = false;
    this.showCardBlock = false;
    this.addCardForm = true;
    this.createExpressPayForm();
    if (isEdit) {
      this.setValueToEdit();
    }
  }
  createExpressPayForm() {
    this._expressPayForm = this._formBuilder.group({
      ccNumber: ['', Validators.required],
      expDate: ['', Validators.required],
      ccZip: ['', Validators.required]
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
    const url = `/svc/profiles/${this.activemember}/rxsettings/expresspay`;
    let requestBody: any;
    this.loaderState = true;
    let encrypted_data;
    if (!isDelete) {
      encrypted_data = this._util.encryptCCNumber(
        this._expressPayForm.value.ccNumber
      );
      if (encrypted_data === undefined && encrypted_data.number === undefined) {
        this._messageService.addMessage(
          new Message(
            'Unable to process your request. Please try again',
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
        return;
      }
    }

    this._httpService
      .doPost(
        url,
        (requestBody = isDelete
          ? this.prepareRequestDataToDelete()
          : this.prepareRequestDataToUpdate(encrypted_data))
      )
      .then(response => {
        this.loaderState = false;
        this.isDeleteModalVisible = false;
        const _body = response.json(),
          codeToCheck = isDelete
            ? 'WAG_I_RX_SETTINGS_010'
            : 'WAG_I_RX_SETTINGS_004';
        if (_body.messages[0].code === codeToCheck) {
          if (isDelete) {
            this.addCardBlock = true;
            this.showCardBlock = false;
          } else {
            this.addCardForm = false;
          }

          this._messageService.addMessage(
            new Message(_body.messages[0].message, _body.messages[0].type)
          );
          this.getExpressPayCard(true);
        } else {
          this._messageService.addMessage(
            new Message(_body.messages[0].message, _body.messages[0].type)
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
      expressPay: {
        ccTokenNumber: encrypted_data.number,
        subfid9B: encrypted_data.subfid9B,
        expiryMonth: this._expressPayForm.value.expDate.slice(0, 2),
        expiryYear: '20' + this._expressPayForm.value.expDate.slice(-2),
        zipCode: this._expressPayForm.value.ccZip
      },
      isDelete: false
    };
    return requestData;
  }
  prepareRequestDataToDelete() {
    let requestData = {};
    requestData = {
      expressPay: {
        cardNumber: '***********' + this.creditCardNumber,
        expiryMonth: this.ccExpiryMonth,
        expiryYear: this.ccExpiryYear,
        zipCode: this.ccZip,
        creditCardType: this.cardType
      },
      isDelete: true
    };
    return requestData;
  }
  deleteCreditCard() {
    this.saveCreditCard(true);
  }

  goBackToPreviousRoute() {
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
    event.preventDefault();
    if (deleteCard) {
      this.deleteCreditCard();
    } else {
      this.isDeleteModalVisible = false;
    }
  }

  deleteModalUpdate(event: boolean) {
    if (!event) {
      this.isDeleteModalVisible = false;
    }
  }

  showDeleteModal() {
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

  updateMember(event) {
    this.activemember = event;
    this.loaderOverlay = true;
    this.getExpressPayCard();
  }
}
