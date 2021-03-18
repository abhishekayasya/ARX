import { Component } from '@angular/core';
import { ComboService } from '../../combo.service';

@Component({
  selector: 'arxrf-combo-hd',
  templateUrl: './hd.component.html',
  styleUrls: ['./hd.component.scss']
})
export class HdComponent {
  constructor(combo: ComboService) {
    combo.hideHead = true;
  }
}
