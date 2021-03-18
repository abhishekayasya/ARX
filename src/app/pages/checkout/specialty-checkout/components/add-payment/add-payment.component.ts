import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ROUTES, STATE_US, ARX_MESSAGES } from '@app/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { PaymentService } from '@app/pages/checkout/specialty-checkout/payment.service';
import { ActivatedRoute } from '@angular/router';
import { CHECKOUT } from '@app/config/checkout.constant';
import { CheckoutService } from '@app/core/services/checkout.service';
import { Message } from '@app/models';
import { MessageService } from '@app/core/services/message.service';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent, TwoFAEnum, GaData } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { UserService } from '@app/core/services/user.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-speciality-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  ROUTES = ROUTES;

  @ViewChild('ccNumber') ccInput;

  pid: string;

  ccType: string;

  newCardForm: FormGroup;

  ccPayload;

  nocard = false;

  backUrl: string;

  STATE_US = STATE_US;

  constructor(
    private _formBuilder: FormBuilder,
    private _refillService: RefillBaseService,
    private _util: CommonUtil,
    public payments: PaymentService,
    private _route: ActivatedRoute,
    private _checkout: CheckoutService,
    private _messageService: MessageService,
    private _userService: UserService,
    private _gaService: GaService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(false);
    }
    this._route.queryParams.subscribe(params => {
      this.pid = params.pid;
    });
    this.initNewCardForm();

    if (sessionStorage.getItem(CHECKOUT.session.key_nocard) != null) {
      this.nocard = true;
      sessionStorage.removeItem(CHECKOUT.session.key_nocard);
    }
    const isSpRxRemainder = localStorage.getItem('isSpecialityRefillRemainder') === 'true';

    if (isSpRxRemainder) {
      this.backUrl = sessionStorage.getItem(AppContext.CONST.spRRUrl);
    } else if (this._checkout.isCombo) {
      this.backUrl = ROUTES.checkout_combined.children.specialty.absoluteRoute;
    } else {
      this.backUrl = ROUTES.checkout_sp.absoluteRoute;
    }
  }

  ngOnInit() {
    this._gaService.sendGoogleAnalytics(<GaData>{
      type: TwoFAEnum.SP_CHECKOUT_CREDIT_CARD
    });
    this.payments.fetchCardData(this.pid);
  }

  prefillAddressComponents(data) {
    this.newCardForm.patchValue({
      city: data.city,
      state: data.state,
      zip: data.zipCode
    });
  }

  initNewCardForm() {
    this.newCardForm = this._formBuilder.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s+[a-zA-Z]+)*$/)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(\s+[a-zA-Z]+)*$/)]
      ],
      cardNumber: ['', Validators.required],
      expDate: ['', [Validators.required, Validators.maxLength(5)]],
      sameAsShipping: [false],
      street1: ['', [Validators.required, this._util.onlyWhitespaceValidator]],
      street2: [''],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern(/^[a-zA-Z]+(\s+[a-zA-Z]+)*$/)
        ]
      ],
      state: ['', Validators.required],
      zip: [
        '',
        [
          Validators.required,
          Validators.maxLength(5),
          Validators.pattern(/^[0-9]{5}$/)
        ]
      ],
      saveAsPrefered: [false]
    });
  }

  setBillingAddress(evt) {
    if (evt && evt.target && evt.target.checked) {
      const shippingInfo = this.payments.cardData.srxDeliveryAddr.find(
        item => item.preferred
      );
      this.newCardForm.patchValue({
        street1: shippingInfo.street1,
        city: shippingInfo.city,
        state: shippingInfo.state,
        zip: shippingInfo.zip
      });
    } else {
      this.newCardForm.patchValue({
        street1: '',
        street2: '',
        city: '',
        state: this.STATE_US[0].short_name,
        zip: ''
      });
    }
  }

  prepareSubmitPayload() {
    const ccNumber = this.newCardForm.value.cardNumber.split(' ').join('');
    const ecr_result = this._util.encryptCCNumber(ccNumber);
    this.ccPayload = {
      smId: this.pid,
      creditCard: [
        {
          firstName: this.newCardForm.value.firstName,
          middleName: '',
          lastName: this.newCardForm.value.lastName,
          ccTokenNumber: ecr_result.number,
          subfid9B: ecr_result.subfid9B,
          expiryMonth: this.newCardForm.value.expDate.split('/')[0],
          expiryYear: '20' + this.newCardForm.value.expDate.split('/')[1],
          creditCardType: this.ccType,
          default: this.newCardForm.value.saveAsPrefered,
          active: true,
          rxType: 'SPECIALTY',
          paymentMethodId: '',
          deliveryInfo: {
            zip: this.newCardForm.value.zip,
            city: this.newCardForm.value.city,
            street1: this.newCardForm.value.street1,
            street2: this.newCardForm.value.street2,
            state: this.newCardForm.value.state
          }
        }
      ],
      updateRequest: false
    };
  }

  updateSubmitPayload() {
    delete this.ccPayload.creditCard[0]['rxType'];
    delete this.ccPayload.creditCard[0]['ccTokenNumber'];
    delete this.ccPayload.creditCard[0]['subfid9B'];
    delete this.ccPayload.creditCard[0]['expiryMonth'];
    delete this.ccPayload.creditCard[0]['expiryYear'];
    delete this.ccPayload.creditCard[0]['creditCardType'];
    delete this.ccPayload.creditCard[0].deliveryInfo['street2'];
  }

  saveCardInfo() {
    if (this.newCardForm.valid) {
      this.prepareSubmitPayload();
      this._checkout.loader = true;
      this._checkout.loaderOverlay = true;
      this._userService.getCCToken(this.ccPayload).subscribe(
        res => {
          this._checkout.loader = false;
          this._checkout.loaderOverlay = false;
          const token = res.tokenDetails;
          if (token && token.length > 0) {
            if (token[0].transactionId) {
              this.ccPayload.creditCard[0].transactionId =
                token[0].transactionId;
              this.updateSubmitPayload();
              this.payments.saveCardInfo(this.ccPayload, false, this.backUrl);
            } else if (token[0].messages) {
              this._messageService.addMessage(
                new Message(
                  token[0].messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            } else {
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          } else {
            this._messageService.addMessage(
              new Message(
                res.messageList[0].textMessage,
                res.messageList[0].type
              )
            );
          }
        },
        err => {
          this._checkout.loader = false;
          this._checkout.loaderOverlay = false;
          this._messageService.addMessage(
            new Message(
              ARX_MESSAGES.ERROR.wps_cto,
              ARX_MESSAGES.MESSAGE_TYPE.ERROR
            )
          );
        }
      );
    } else {
      this._util.validateForm(this.newCardForm);
    }
  }

  updateCCType(event) {
    this.ccType = event.type;
  }
}
