import { Component } from '@angular/core';
import { ComboService } from '../../combo.service';

@Component({
  selector: 'arxrf-combined-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class ComboConfirmation {
  constructor(combo: ComboService) {
    combo.hideHead = true;
  }
}
