import { Component } from '@angular/core';
import {JahiaContentService} from '@app/core/services/jahia-content.service';
import {COMMON_MAP} from '@app/content-mapping/common-content-mapping';
import {CommonUtil} from '@app/core/services/common-util.service';

@Component({
  selector: 'arxrf-tcpa-comm-policy',
  templateUrl: './tcpa-communication-policy.component.html',
  styleUrls: ['tcpa-communication-policy.component.scss']
})
export class TcpaCommunicationComponent {
  isTcpaModalVisible = false;

  terms_content: string;

  constructor(
    private _contentService: JahiaContentService,
    public common: CommonUtil
  ) {
    // Fetching TCAP content from Jahia. 
    // Using default text if not able to fetch from Jahia.
    this._contentService.getContent(COMMON_MAP.tcpa_communication_policy.path)
      .subscribe(
        (response) => {
          if (response.text) {
            this.terms_content = response.text;
          }
        },
        (error) => {
          this.terms_content = COMMON_MAP.tcpa_communication_policy.text;
        }
      );
  }

  openTermsModal() {
    this.isTcpaModalVisible = true;
  }

  updateTermsModal(event: boolean) {
    if ( !event ) {
      this.isTcpaModalVisible = false;
    }
  }
}
