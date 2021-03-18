import { Component } from '@angular/core';
import {JahiaContentService} from '@app/core/services/jahia-content.service';
import {COMMON_MAP} from '@app/content-mapping/common-content-mapping';
import {CommonUtil} from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-online-privacy-policy',
  templateUrl: './online-privacy-policy.component.html',
  styleUrls: ['online-privacy-policy.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class OnlinePrivacyPolicy {
  isPrivacyPolicyModalVisible = false;

  terms_content: string;

  constructor(
    private _contentService: JahiaContentService,
    public common: CommonUtil
  ) {
    this._contentService.getContent(COMMON_MAP.online_privacy_policy.path)
      .subscribe(
        (response) => {
          if (response.text) {
            this.terms_content = response.text;
          }
        }
      );
  }

  openTermsModal() {
    this.isPrivacyPolicyModalVisible = true;
  }

  updateTermsModal(event: boolean) {
    if ( !event ) {
      this.isPrivacyPolicyModalVisible = false;
    }
  }
}
