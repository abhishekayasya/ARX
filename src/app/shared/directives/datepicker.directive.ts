import { Directive, ElementRef, Input } from '@angular/core';
declare var $: any;
declare var dates: any;

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[date-picker]',
  // tslint:disable-next-line: use-host-property-decorator
  host: {
    '(input)': 'sanitizeDate($event)'
  }
})
export class DatepickerDirective {
  constructor(private elmRef: ElementRef) {
    this.prepareDatePicker();
  }

  prepareDatePicker() {
    this.elmRef.nativeElement.onkeyup = function(e) {
      const pattern = /[a-zA-Z!@#$%^&*()_+=\-\._\\]/g;
      if (pattern.test(e.target.value)) {
        e.target.value = e.target.value.replace(pattern, '');
      }
      return true;
    };

    $(document).ready(function() {
      if (typeof dates === 'function') {
        dates();
      }
    });

    // this.elmRef.nativeElement.onkeydown = function (e) {
    //   this.value = e.target.value;
    //   e.preventDefault();
    // }

    // var $input = $(this.elmRef.nativeElement);
    //
    // let config = {
    //   onSelect: function (dateText, obj) {
    //     $(this).trigger('focus');
    //     $(this).trigger('blur');
    //   }
    // }
    //
    // if ( this.elmRef.nativeElement.getAttribute("yearRange") !== undefined ) {
    //   config['yearRange'] = this.elmRef.nativeElement.getAttribute("yearRange")
    //   let year = config['yearRange'].substring(
    //     0,
    //     config['yearRange'].indexOf(":")
    //   );
    //
    //   config['defaultDate'] = `01/01/${year}`;
    // }
    //
    // config['changeYear'] = true;
    // $input.datepicker(config);
  }

  sanitizeDate(evt) {
    const val = evt.target.value;
    const len = val.length;
    if (val.substring(len - 1, len) === '/') {
      // tslint:disable-next-line: no-shadowed-variable
      const dates = val.split('/');
      if (dates[0].length < 2) {
        dates[0] = 0 + dates[0];
      }
      if (dates[1].length > 0 && dates[1].length < 2) {
        dates[1] = 0 + dates[1];
      }
      evt.target.value = dates.join('/');
    }
  }
}
