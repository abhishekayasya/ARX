import { Component } from '@angular/core';
import { CommonUtil } from '../../../../core/services/common-util.service';
import { FmService } from '@app/core/services/fm.service';

@Component({
  selector: 'arxrf-fm-base',
  templateUrl: './fm-base.component.html',
  styleUrls: ['./fm-base.component.scss']
})
export class FmBaseComponent {
  constructor(private _common: CommonUtil, public manager: FmService) {
    // removing background from content area
    this._common.removeNaturalBGColor();
  }
}
