import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, FormControl, ValidatorFn } from '@angular/forms';
import {DateConfigModel} from '@app/models/date-config.model';

import { ValidateDate } from '@app/shared/validators/date.validator';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[creditCardExpiry]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: CreditCardExpiryDirective,
      multi: true
    }
  ],
  host: {
    '(keyup)': 'masking($event)',
    '(input)': 'onInput()'
  }
})

export class CreditCardExpiryDirective implements Validator {

  @Input('creditCardExpiry') expDate;

  validator: ValidatorFn;
  inValidDate;
  constructor() {
    const dateConfig = new DateConfigModel();
    dateConfig.allowFuture = true;
    dateConfig.isCreditCardExpiryDate = true;
    this.inValidDate = new RegExp('[^0-9/]', 'g');

    this.validator = ValidateDate(dateConfig);
  }



  validate(c: FormControl) {
    return this.validator(c);
  }

  masking(evt) {
    const code = evt.which || evt.keyCode;
    const enteredDate = this.expDate.value;

    let newVal = enteredDate.replace(this.inValidDate, '');
    const dateLength = enteredDate.length;

    if (dateLength === 2 && code !== 8) {
      newVal += '/';
    } else if (dateLength === 3 && ((code >= 48 && code <= 57) || (code >= 96 && code <= 105))) {
      newVal = newVal.replace(/.$/, '/');
    }
    this.expDate.setValue(newVal);
  }

  onInput() {
    const enteredDate = this.expDate.value.replace(this.inValidDate, '');
    this.expDate.setValue(enteredDate);
  }
}
