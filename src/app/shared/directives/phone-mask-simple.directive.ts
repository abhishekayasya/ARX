import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[arxrfPhoneMaskSimple]'
})


/*@Directive({
  selector: '[formControlName][appPhoneMask]',
})*/
export class PhoneMaskSimpleDirective {

  constructor(public ngControl: NgControl) { }

  @HostListener('ngModelChange', ['$event'])
  onModelChange(event) {
    this.onInputChange(event, false);
  }

  @HostListener('click', ['$event'])
  private onClick(event) {
    if (event.target.value === '') {
    }
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event) {
    this.onInputChange(event.target.value, true);
  }

  /*@HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
   console.log(event.keyCode);

  }*/

  onInputChange(event, backspace) {
    if (event === null) {
      return;
    }
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '$1');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '$1-$2-');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '$1-$2-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '$1-$2-$3');
    }
    this.ngControl.valueAccessor.writeValue(newVal);
  }
}