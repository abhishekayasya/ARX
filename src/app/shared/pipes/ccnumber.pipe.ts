import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ccnumber'
})
export class CcnumberPipe implements PipeTransform {

  transform(value: any, length?: any): any {
    return value.substring(
      (value.length - (length ? length : 5)),
      value.length
    );
  }

}
