import { AfterViewInit, Component } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';

@Component({
  selector: 'arxrf-homedelivery-address-select',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements AfterViewInit {
  CHECKOUT = CHECKOUT;
  routes = ROUTES;

  constructor(private _message: MessageService) {}

  ngAfterViewInit(): void {
    // istanbul ignore else
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
