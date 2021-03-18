import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'arxrf-assessment-review',
  templateUrl: './assessment-review.component.html',
  styleUrls: ['./assessment-review.component.scss']
})
export class AssessmentReviewComponent {
  showCheckout = false;
  currentName: boolean;
  constructor(private _route: ActivatedRoute) {
    this._route.queryParams.subscribe(val => {
      // istanbul ignore else
      if (val) {
        const data = val['pid'];
        // istanbul ignore next
        this.currentName = data ? data['name'] : '';
      }
    });
  }
}
