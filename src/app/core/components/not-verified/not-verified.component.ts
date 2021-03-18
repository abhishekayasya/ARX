import { JahiaContentService } from './../../services/jahia-content.service';
import { Component } from '@angular/core';
import { interval } from 'rxjs/observable/interval';
import { ROUTES } from '@app/config';
import { CommonUtil } from '@app/core/services/common-util.service';
import { REG_MAP } from '@app/content-mapping/register-content-mapping';

@Component({
  selector: 'arxrf-notverified',
  templateUrl: './not-verified.component.html',
  styleUrls: ['./not-verified.component.scss']
})
export class NotVerifiedComponent {

  currentStep: string;
  timer = interval(500);

  showFourDotProgressBar: boolean;
  // flag to enable/disable laoding screen.
  loading: boolean = true;

  // object to hold values for content sections, heading and description.
  pageContent: {
    heading: string,
    description: string
  }

  constructor(private _commonUtil: CommonUtil, private _contentService: JahiaContentService) {
    const consentPending_state = localStorage.getItem('reg2_consent_pending');
    const hippaPending_state = localStorage.getItem('reg2_HIPAA_pending');
    this.updateContent();

    if(consentPending_state || hippaPending_state){
      this.showFourDotProgressBar = false;
    } else {
      this.showFourDotProgressBar = true;
    }

    // Updating browser history to redirect on login page if back button is clicked.
    this._commonUtil.updateBrowserBack(ROUTES.login.absoluteRoute);
  }

  ngAfterViewInit(): void {
    this.timer.subscribe(() => {
      this.setRegState()
    })
  }

  setRegState(){
    this.currentStep = sessionStorage.getItem('u_reg_st');
  }

  updateContent():void {
    //updating page content sith default title and description available.
    this.pageContent = {
      heading : REG_MAP.additional_info_needed.default['jcr:title'],
      description : this._commonUtil.decodeHtml(
        REG_MAP.additional_info_needed.default.description
      )
    };

    //fetching content from Jahia
    this._contentService.getContent(REG_MAP.additional_info_needed.path).subscribe(
      response => {
        this.pageContent.heading = response['jcr:title'];
        this.pageContent.description = this._commonUtil.decodeHtml(response.description);
      },
      error => {},
      // removing loading screen and enabling content section with after content request is done.
      // this is a default action that will be performa once request is finished.
      () => {
        this.loading = false;
      }
    );
  }

}

