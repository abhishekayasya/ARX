import { Component } from '@angular/core';
import {JahiaContentService} from '@app/core/services/jahia-content.service';
import {COMMON_MAP} from '@app/content-mapping/common-content-mapping';
import {CommonUtil} from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-hipaa-policy',
  templateUrl: './hipaa-policy.component.html',
  styleUrls: ['hipaa-policy.component.scss']
})
export class HipaaCommunicationComponent {
  isHipaaModalVisible = false;

  terms_content: string;

  constructor(
    private _contentService: JahiaContentService,
    public common: CommonUtil
  ) {
    // this._contentService.getContent(COMMON_MAP.terms_of_use.path)
    //   .subscribe(
    //     (response) => {
    //       if (response.text) {
    //         this.terms_content = response.text;
    //       }
    //     }
    //   );
    this.terms_content = COMMON_MAP.hipaa_policy.text;
  }

  openHipaaModal() {
    this.isHipaaModalVisible = true;
  }

  updateHipaaModal(event: boolean) {
    if ( !event ) {
      this.isHipaaModalVisible = false;
    }
  }
}
