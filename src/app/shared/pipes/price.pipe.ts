import {Pipe, PipeTransform} from '@angular/core';

// Angular pipe to change a price in to correct format.
@Pipe({ name: 'price', pure: false })
export class PricePipe implements PipeTransform {

  constructor() {}

  transform(value: any, ...args: any[]): any {
    if ( isNaN(value) ) {
      return value;
    }
    let price = value.toString();
    let finalValue = '';
    if ( price.indexOf( '$' ) > -1 ) {
      price = price.replace( '$', '' );
      finalValue = '$';
    }
    finalValue = finalValue + parseFloat(price).toFixed(2);
    return finalValue;
  }

}
