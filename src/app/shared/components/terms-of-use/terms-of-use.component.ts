import { Component } from '@angular/core';
import {JahiaContentService} from '@app/core/services/jahia-content.service';
import {COMMON_MAP} from '@app/content-mapping/common-content-mapping';
import {CommonUtil} from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-terms-of-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['terms-of-use.component.scss']
})
export class TermsOfUseComponent {
  isTermsModalVisible = false;

  terms_content: string;

  constructor(
    private _contentService: JahiaContentService,
    public common: CommonUtil
  ) {
    this._contentService.getContent(COMMON_MAP.terms_of_use.path)
      .subscribe(
        (response) => {
          if (response.text) {
            this.terms_content = response.text;
          }
        }
      );
  }

  openTermsModal() {
    this.isTermsModalVisible = true;
  }

  updateTermsModal(event: boolean) {
    if ( !event ) {
      this.isTermsModalVisible = false;
    }
  }
}
