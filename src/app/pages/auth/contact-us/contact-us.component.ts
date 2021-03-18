import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { contactInfo } from '../contact-us.model';
import { CommonUtil } from '@app/core/services/common-util.service';
import { ROLES, iconRef } from '@app/config/contact.constants';

@Component({
  selector: 'arxrf-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent {
  contactInfo: contactInfo = {};
  roles = ROLES;
  constructor(private _commonUtil: CommonUtil) {}
  submitContact(frm: any) {
    if (!frm.valid) {
      return;
    }
    console.log(JSON.stringify(this.contactInfo, null, 3));
  }

  omitSpecialCharacter(event) {
    return this._commonUtil.omitSpecialCharacter(event);
  }

  redirectContact() {
    location.assign('/contactus'); // load jahia page
  }

  get iconRef() {
    return iconRef.iconArrowRight;
  }
  get iconAlert() {
    return iconRef.iconAlert;
  }
}
