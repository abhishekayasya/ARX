import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  Output,
  ViewChild
} from '@angular/core';
import {} from 'googlemaps';

@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GooglePlacesComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GooglePlacesComponent),
      multi: true
    }
  ],

  selector: 'arxrf-google-places',
  templateUrl: './google-places.component.html',
  styleUrls: ['./google-places.component.scss']
})
export class GooglePlacesComponent
  implements ControlValueAccessor, Validator, AfterViewInit {
  @Input()
  name = 'street';

  @Input()
  label = 'Address';

  @Input()
  hideLabel = false;
  
  //flag to mark field as disabled.
  @Input()
  disable = false;

  @Input()
  // Pattern is removed from Address1, Address2 and APT/Suite/others
  // pattern: string = "^[a-zA-Z 0-9. , / -]+(s+[a-zA-Z 0-9. ,]+)*$";
  pattern = '.*';

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onSelection = new EventEmitter<{}>();

  @ViewChild('placesList')
  placesList: ElementRef;

  @ViewChild('placeInput')
  placeInput: ElementRef;

  private _onChange = (_: string) => {};

  // tslint:disable-next-line: member-ordering
  private _onTouched;

  constructor(private _elRef: ElementRef, private _ngZone: NgZone) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initGoogleAutoSelect();
    }, 1000);
  }

  // input value
  // tslint:disable-next-line: member-ordering
  private _value: string;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    this._onChange(value);
  }

  validate(c: AbstractControl): ValidationErrors | null {
    const regex = new RegExp(this.pattern);
    if (c.value) {
      return regex.test(c.value.toString())
        ? null
        : {
            pattern: {
              valid: true
            }
          };
    }
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

  onChange(event) {
    this._onChange(event.target.value);
  }

  /**
   * Init function to bind google auto selection to address field.
   */
  initGoogleAutoSelect() {
    const autoComplete = new google.maps.places.Autocomplete(
      this.placeInput.nativeElement,
      {
        types: ['address'],
        componentRestrictions: { country: ['us'] }
      }
    );

    // on selection updating address field and passing other address components data.
    google.maps.event.addListener(autoComplete, 'place_changed', () => {
      this._ngZone.run(() => {
        const place: google.maps.places.PlaceResult = autoComplete.getPlace();
        this.value = place.name;

        const data = {};
        const zipData = place.address_components.filter((item, index) => {
          if (item.types[0] === 'postal_code') {
            return true;
          }
        });

        if (zipData !== undefined && zipData.length > 0) {
          data['zipCode'] = zipData[0].long_name;
        }

        const cityData = place.address_components.filter((item, index) => {
          if (item.types[0] === 'locality') {
            return true;
          }
        });
        if (cityData !== undefined && cityData.length > 0) {
          data['city'] = cityData[0].long_name;
        }

        const stateData = place.address_components.filter((item, index) => {
          if (item.types[0] === 'administrative_area_level_1') {
            return true;
          }
        });
        if (stateData !== undefined && stateData.length > 0) {
          data['state'] = stateData[0].short_name;
        }

        this.onSelection.emit(data);
      });
    });
  }
}
