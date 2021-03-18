import { Component } from '@angular/core';
import { ComboService } from '../../combo.service';

@Component({
  selector: 'arxrf-combo-speciality',
  templateUrl: './speciality.component.html',
  styleUrls: ['./speciality.component.scss']
})
export class SpecialityComponent {
  constructor(combo: ComboService) {
    combo.hideHead = false;
  }
}
