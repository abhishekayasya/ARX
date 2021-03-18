import { AfterViewInit, Component } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';
import { AppContext } from '@app/core/services/app-context.service';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { GaService } from '@app/core/services/ga-service';
import { GAEvent } from '@app/models/ga/ga-event';
import { GA } from '@app/config/ga-constants';
import { CheckoutService } from '@app/core/services/checkout.service';

@Component({
  selector: 'arxrf-homedelivery-address-select',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss']
})
export class SelectAddressComponent implements AfterViewInit {
  CHECKOUT = CHECKOUT;
  routes = ROUTES;

  constructor(
    private _message: MessageService,
    private _gaService: GaService,
    private _checkout: CheckoutService
  ) {
    this._gaService.sendEvent(this.gaEvent());
  }

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

  gaEvent() {
    const event = <GAEvent>{};
    const { checkout_combo, checkout_mail } = GA.categories;
    event.category = this._checkout.isCombo ? checkout_combo : checkout_mail;
    event.action = this._checkout.isCombo
      ? GA.actions.checkout_combo.load_address_HD
      : GA.actions.checkout_mail.load_address;
    return event;
  }
}
