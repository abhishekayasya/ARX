import {
  Directive,
  Input,
  Inject,
  ElementRef,
  Renderer2,
  OnInit
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import {
  NG_VALIDATORS,
  Validator,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { ValidateCardNumber } from '@app/shared/validators/card-number.validator';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'input[credit-card-number]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CreditCardNumberDirective,
      multi: true
    }
  ],
  host: {
    '(keydown)': 'masking($event)',
    '(keyup)': 'removeSpace($event)'
  }
})
export class CreditCardNumberDirective implements Validator, OnInit {
  @Input('credit-card-number') ccNumber;

  validator: ValidatorFn;
  validateCard;
  cardIcon;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
  ) {
    this.validateCard = new ValidateCardNumber();
    this.validator = this.validateCard.validate();
  }

  ngOnInit() {
    this.validateCard.getCardType().subscribe(data => {
      if (data.type) {
        this.showTypeIcon(data.type);
      } else {
        this.hideTypeIcon();
      }
    });
    this.addTypeIcon();
  }

  validate(c: FormControl) {
    return this.validator(c);
  }

  masking(evt) {
    if (!this.ccNumber) {
      return;
    }
    const code = evt.which || evt.keyCode;
    let enteredNum = this.ccNumber.value;

    const pairs = enteredNum.split(' ');
    const length = pairs[pairs.length - 1].length;

    if (length > 0 && length % 4 === 0 && code !== 8 && code !== 189) {
      enteredNum += ' ';
    }

    this.ccNumber.setValue(enteredNum);
  }

  removeSpace(evt) {
    const code = evt.which || evt.keyCode;
    let enteredNum = this.ccNumber.value;
    if (code === 32) {
      enteredNum = enteredNum.replace(/.$/, '');
      this.ccNumber.setValue(enteredNum);
    }
  }

  showTypeIcon(type) {
    this.cardIcon.classList.remove('hidden');
    this.cardIcon.dataset.type = type.name;
    this.cardIcon.src = type.icon;
  }

  hideTypeIcon() {
    this.cardIcon.src = '';
    this.cardIcon.classList.add('hidden');
    this.cardIcon.dataset.type = '';
  }

  addTypeIcon() {
    this.cardIcon = document.createElement('img');
    this.cardIcon.src = '';
    this.cardIcon.dataset.type = '';
    this.cardIcon.classList.add('cc-icon-inside-input');
    this.cardIcon.classList.add('hidden');
    this.renderer.appendChild(
      this._el.nativeElement.closest('.input__contain'),
      this.cardIcon
    );
  }
}
