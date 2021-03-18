import { CommonUtil } from '@app/core/services/common-util.service';
import { Component } from '@angular/core';

@Component({
  selector: 'arxrf-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {
  constructor(private common: CommonUtil) {
    common.navigate('/404');
  }
}
