import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[specified-input]',
  host: {
    '(input)': 'onInput($event)'
  }
})
export class SpecifiedInputDirective implements OnInit {
  @Input('specified-input') fieldControl;
  @Input('invalidExp') exp;

  invalidExp: RegExp;

  constructor(private _el: ElementRef) {}

  ngOnInit() {
    this.invalidExp = new RegExp(this.exp, 'g');
  }

  onInput() {
    if (this.fieldControl) {
      const newVal = this.fieldControl.value.replace(this.invalidExp, '');
      this.fieldControl.setValue(newVal);
    } else {
      const newVal = this._el.nativeElement.value.replace(this.invalidExp, '');
      this._el.nativeElement.value = newVal;
    }
  }
}
