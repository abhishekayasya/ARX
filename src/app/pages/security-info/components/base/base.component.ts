import { Component, OnInit } from '@angular/core';
import { CommonUtil } from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {
  private steps = {
    base: {
      name: 'base',
      next: 'identity'
    },
    identity: {
      name: 'identity',
      next: ''
    },
    userPassword: {
      name: 'userPassword',
      next: 'base'
    },
    securityQues: {
      name: 'securityQues',
      next: 'base'
    }
  };

  private currentStep;
  private eventType = 'init';

  constructor(private _common: CommonUtil) {
    this.currentStep = this.steps.base.name;
    this._common.removeNaturalBGColor();
  }

  ngOnInit() {}

  moveToNext(type?: any) {
    if (type && this.currentStep === this.steps.base.name) {
      this.steps.identity.next = type;
    }
    this.currentStep = this.steps[this.currentStep].next;
  }

  showSuccess(event) {
    this.eventType = event;
  }
}
