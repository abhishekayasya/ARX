import { ValidateDate } from './date.validator';
import { DateConfigModel } from '@app/models/date-config.model';
import { AbstractControl } from '@angular/forms';
import { ComponentFixture } from '@angular/core/testing';

describe('ValidateDate', () => {
  const validator = ValidateDate(new DateConfigModel(), false);
  it('should create an instance', () => {
    expect(validator).toBeTruthy();
  });
  it('should excute', () => {
    const control = { value: 'test' };
    validator(control as AbstractControl);
   });
  it('should excute else1', () => {
    new DateConfigModel().isDob = true;
    const control = { value: '08/08/2020' };
    validator(control as AbstractControl);
   });
   it('should excute else2', () => {
    const control = { value: '1234-1111' };
    validator(control as AbstractControl);
   });
   it('should excute else', () => {
    const control = { value: '' };
    validator(control as AbstractControl);
   });
});
