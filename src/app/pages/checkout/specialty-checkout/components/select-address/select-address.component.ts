import { AfterViewInit, Component } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { ActivatedRoute } from '@angular/router';
import { PARAM } from '@app/config/param.constant';

@Component({
  selector: 'arxrf-speciality-address-select',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements AfterViewInit {
  CHECKOUT = CHECKOUT;
  routes = ROUTES;

  pid: string;
  rid: string;
  subtype: string;
  profileID: string;

  addAddressUrl: string;

  constructor(
    private _message: MessageService,
    private _route: ActivatedRoute
  ) {
    this._route.queryParams.subscribe(params => {
      this.pid = params[PARAM.speciality_address_book.patient_id];
      this.rid = params[PARAM.speciality_address_book.referral_id];
      this.subtype = params[PARAM.speciality_address_book.subtype];
      this.profileID = params['profileId'];
    });
    // tslint:disable-next-line:max-line-length
    this.addAddressUrl = `${this.routes.checkout_sp.children.add_address.absoluteRoute}?pid=${this.pid}&profileID=${this.profileID}&subtype=${this.subtype}`;
    // istanbul ignore else
    if (this.rid) {
      this.addAddressUrl = `${this.addAddressUrl}&rid=${this.rid}`;
    }
  }

  ngAfterViewInit(): void {
    if (sessionStorage.getItem(AppContext.CONST.key_address_success) != null) {
      const json = JSON.parse(
        sessionStorage.getItem(AppContext.CONST.key_address_success)
      );
      this._message.addMessage(
        new Message(json.message, ARX_MESSAGES.MESSAGE_TYPE.SUCCESS)
      );
      sessionStorage.removeItem(AppContext.CONST.key_address_success);
    }
  }
}
