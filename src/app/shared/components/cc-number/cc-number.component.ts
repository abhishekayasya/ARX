import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors,
  Validator
} from '@angular/forms';
import {
  Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChildren, AfterViewInit
} from '@angular/core';
import {CARD_TYPES} from '@app/config/cards.constant';

declare var $;

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcNumberComponent),
      multi : true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CcNumberComponent),
      multi : true

    }
  ],
  selector: 'arxrf-input-ccnumber',
  templateUrl: './cc-number.component.html',
  styleUrls: ['./cc-number.component.scss']
})
export class CcNumberComponent implements ControlValueAccessor, Validator, AfterViewInit {

  @Input()
  isFocus = true;

  @Input()
  name = 'creditCardNumber';

  @Input()
  label = 'Credit Card Number';

  @Input()
  showErrorState = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onCCChange = new EventEmitter<any>();

  // trigger when CC value is changed on key press to hide the CC expired message
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onCCInputEvent = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onCCBlurEvent = new EventEmitter<any>();

  @ViewChildren('focusOnCCInput') focusOnCCInp;

  card_types: Array<any> = [];

  card_type: any;

  isBlurred: boolean;

    // input value
    private _value: string;

  private _onChange = (_: string) => {};

  // tslint:disable-next-line: member-ordering
  private _onTouched;

  ngAfterViewInit() {
    if (this.isFocus) {
        this.focusOnCCInp.first.nativeElement.focus();
    }

    if (this.value) {
      this.focusOnCCInp.first.nativeElement.value = this.value;
      this._onChange(this.value);
    }
}

  constructor(
    private _elRef: ElementRef
  ) {}

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this._onChange(value);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if ( this.card_types.length === 0 ) {
      // tslint:disable-next-line: forin
      for (const index in CARD_TYPES) {
        this.card_types.push(CARD_TYPES[index]['validator_key']);
      }
    }

    if ( $(`#${this.name}`).attr('id') !== undefined ) {
      const response = $(`#${this.name}`).validateCreditCard({ accept: this.card_types });
      const invalid_response = {
        validcc : {
          valid : true
        }
      };

      if ( response.card_type && response.card_type.name ) {
        this.card_type = CARD_TYPES.find(
          (item) => {
            return item.validator_key === response.card_type.name;
          }
        );
      } else {
        this.card_type = undefined;
      }

      return ( response.valid ) ? null : invalid_response;
    }
    return null;

  }

  writeValue(obj: string): void {
    this.value = obj;
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  onBlur(event){
    this.isBlurred = true;
    this.onChange(event)
  }

  onChange(event) {
    this.onCCBlurEvent.emit(event);
    this._onChange(event.target.value);
    this.onCCChange.emit({
      type: (this.card_type === undefined) ? '' : this.card_type.type
    });
  }

}
