import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  AfterViewInit
} from '@angular/core';
import { CoreConstants, ROUTES, STATE_US } from '@app/config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefillBaseService } from '@app/core/services/refill-base.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { PaymentService } from '@app/pages/checkout/specialty-checkout/payment.service';
import { ActivatedRoute } from '@angular/router';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-speciality-update-payment',
  templateUrl: './update-payment.component.html',
  styleUrls: ['./update-payment.component.scss']
})
export class UpdatePaymentComponent implements OnInit, AfterViewInit {
  cardId: string;
  newCardForm: FormGroup;
  ccPayload;
  creditCard;

  pid: string;

  shippingInfo;

  ROUTES = ROUTES;

  backUrl: string;

  isShippingAdd = false;

  isPreferredAdd = false;

  STATE_US = STATE_US;

  constructor(
    private _formBuilder: FormBuilder,
    private _refillService: RefillBaseService,
    private _util: CommonUtil,
    private _route: ActivatedRoute,
    public payments: PaymentService,
    private _checkout: CheckoutService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(false);
    }
    this._route.queryParams.subscribe(params => {
      this.cardId = params.id;
      this.pid = params.pid;
    });
    this.initNewCardForm();

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
    if (this._checkout.data_deliveryOptions) {
      this.payments.cardData = this.payments.getCardData(
        this._checkout.data_deliveryOptions,
        this.pid
      );
      this.selectCard();
    }
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
      expDate: ['', [Validators.maxLength(5)]],
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

  selectCard() {
    for (const card of this.payments.cardData.creditCard) {
      if (card.paymentMethodId === this.cardId) {
        this.creditCard = card;
        this.populateFields();
        if (card.selected) {
          this.isPreferredAdd = true;
        }
        return;
      }
    }
  }

  ngAfterViewInit() {
    this.newCardForm.controls['saveAsPrefered'].setValue(
      this.creditCard.selected
    );
  }

  populateFields() {
    this.newCardForm.patchValue(this.creditCard.billingInfo);
    const billingInfo = this.creditCard.billingInfo;

    this.shippingInfo = this.payments.cardData.srxDeliveryAddr.find(item => {
      return item.preferred;
    });

    if (
      billingInfo.zip === this.shippingInfo.zip &&
      billingInfo.city === this.shippingInfo.city &&
      billingInfo.street1 === this.shippingInfo.street1 &&
      billingInfo.state === this.shippingInfo.state
    ) {
      this.isShippingAdd = true;
    }

    this.newCardForm.patchValue({
      expDate: this.creditCard.expDate,
      saveAsPrefered: this.creditCard.isDefault === 'Y'
    });
  }

  setBillingAddress(evt) {
    if (evt.target.checked) {
      this.newCardForm.patchValue({ ...this.shippingInfo });
    } else {
      this.newCardForm.patchValue({
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
      });
    }
  }

  prepareSubmitPayload() {
    this.ccPayload = {
      smId: this.pid,
      creditCard: [
        {
          paymentMethodId: this.creditCard.paymentMethodId,
          firstName: this.creditCard.firstName,
          middleName: this.creditCard.middleName
            ? this.creditCard.middleName
            : '',
          lastName: this.creditCard.lastName,
          cardNumber: this.creditCard.creditCardNumber.replace(/X/g, '*'),
          lastFourDigit: this.creditCard.creditCardNumber.replace(/X/g, ''),
          ccExpiryMonth: this.newCardForm.value.expDate
            ? this.newCardForm.value.expDate.split('/')[0]
            : this.creditCard.expiryMonth,
          ccExpiryYear: this.newCardForm.value.expDate
            ? '20' + this.newCardForm.value.expDate.split('/')[1]
            : this.creditCard.expiryYear,
          creditCardType: this.creditCard.cardType,
          default: this.newCardForm.value.saveAsPrefered,
          active: true,
          transactionId: '',
          deliveryInfo: {
            city: this.newCardForm.value.city,
            state: this.newCardForm.value.state,
            street1: this.newCardForm.value.street1,
            street2: this.newCardForm.value.street2,
            zip: this.newCardForm.value.zip
          }
        }
      ],
      updateRequest: true
    };
  }

  transformCreditCardNumber(number, length) {
    return number.substring(number.length - length, number.length);
  }

  updateSubmitPayload() {
    delete this.ccPayload.creditCard[0].deliveryInfo['street2'];
  }

  saveCardInfo() {
    if (this.newCardForm.valid) {
      this.prepareSubmitPayload();
      this.updateSubmitPayload();
      this.payments.saveCardInfo(this.ccPayload, true, this.backUrl);
    } else {
      this._util.validateForm(this.newCardForm);
    }
  }

  get cardSelected() {
    return !this.creditCard.selected;
  }
}
