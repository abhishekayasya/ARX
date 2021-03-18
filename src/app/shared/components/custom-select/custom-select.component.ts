import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
declare const $: any;
@Component({
  selector: 'arxrf-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})

export class CustomSelectComponent implements OnChanges {
  // DATA MUST BE IN [{key: __key__, value: __value__}, ...] format
  @Input('items') dataList: Array<any> = [];
  @Input('controlName') controlName: string = "CUSTOM_SELECT_INPUT";
  @Input('label') label?: string = "";
  @Input('placeholder') placeholder?: string = "";
  @Input('value') value?: string | number;
  @Input('required') required?: boolean = false;
  @Input('disabled') disabled?: boolean = false;
  @Input('open_dropdown') open_dropdown?: boolean = false;
  @Input('isBlurred') current_error_status?= false;

  @Input('showTooltip') showTooltip?: boolean = false;
  @Input('tooltipText') tooltipText?: string = "";
  @Input('requiredMessage') requiredMessage?: string = "Please select any option.";

  @Output('selectedItem') selectedValue = new EventEmitter<any>();

  @ViewChild('selectelementref') selectelementref: ElementRef;
  innerBlurred = false;
  placeholderbackup = "";
  current_value: any = null;
  formgroup: FormGroup;
  randomNumber: number = Math.floor(Math.random() * Math.random() * 100000000);
  noOptionFoundText = "No option found";

  constructor() {
  }

  ngOnInit() {
    this.formgroup = new FormGroup(
      { [this.controlName]: new FormControl(this.value, Validators.required) }
    );
    this.placeholderbackup = this.placeholder;
    if(!!this.value) {
      this.placeholder = null;
    }
    if (!this.required) {
      this.formgroup.controls[this.controlName].clearValidators();
    }
    this.formgroup.valueChanges.subscribe((value: any) => {
      if (value && value[this.controlName]) {
        this.placeholder = '';
        this.current_value = value;
        this.selectedValue.emit(value[this.controlName]);
        this.innerBlurred = false;
      } else {
        this.placeholder = this.placeholderbackup;
        this.current_value = null;
        this.selectedValue.emit(-1);
        this.innerBlurred = true;
      }
    });
  }

  ngAfterViewInit() {
      const $ngInput = $(this.selectelementref.nativeElement).find('.ng-input input');
      $ngInput.on('input', event => {
        if(event.target.value) {
          this.placeholder = "";
        } else {
          this.placeholder = this.placeholderbackup;
        }
      });
  }

  ngOnChanges() { }
  
  handleblurred() {
    if (!this.current_value) {
      this.innerBlurred = true;
    }
  }
}
