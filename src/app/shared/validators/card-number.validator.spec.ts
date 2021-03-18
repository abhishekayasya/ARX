import { ValidateCardNumber } from './card-number.validator';
import { Subject } from 'rxjs/Subject';
import { AbstractControl } from '@angular/forms';

describe('ValidateCardNumber', () => {
  const validator: ValidateCardNumber = new ValidateCardNumber();
  const range: Range  = new Range();
  it('should create an instance', () => {
    expect(validator).toBeTruthy();
  });
  it('should call  getCardType', () => {
    validator.getCardType();
  });
  it('should call  validate', () => {
    let control = { value: '' }
    validator.validate()(control as AbstractControl);
  });
  it('should call  validate1', () => {
    let control = { value: '1243-133' }
    validator.validate()(control as AbstractControl);
  });
  it('should call  validate else', () => {
    let control = { value: '2221-272016' }
    validator.validate()(control as AbstractControl);
  });
});