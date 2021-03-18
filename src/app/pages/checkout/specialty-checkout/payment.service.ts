import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClientService} from '@app/core/services/http.service';
import {MessageService} from '@app/core/services/message.service';
import {ARX_MESSAGES, ROUTES, Microservice} from '@app/config';
import {Message} from '@app/models';
import {SpecialityService} from '@app/pages/checkout/specialty-checkout/speciality.service';
import {CommonUtil} from '@app/core/services/common-util.service';
import {CheckoutService} from '@app/core/services/checkout.service';
import {CHECKOUT} from '@app/config/checkout.constant';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {GA} from '@app/config/ga-constants';
import {GAEvent} from '@app/models/ga/ga-event';
import {GaService} from '@app/core/services/ga-service';

@Injectable()
export class PaymentService {

  enableSave = false;
  ROUTES = ROUTES;
  loaderState = false;
  cardData;
  cardPayload;
  isUpdateAction;

  cardUpdateSubject = new BehaviorSubject<any>({});

  constructor(
    private _httpService: HttpClientService,
    private _messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private speciality: SpecialityService,
    private _util: CommonUtil,
    private _checkout: CheckoutService,
    private _gaService: GaService
  ) {
    this.isUpdateAction = this.route.snapshot.params['card'];
  }

  fetchCardData( pid: string ) {
    if ( this._checkout.data_deliveryOptions ) {
      this.cardData = this.getCardData( this._checkout.data_deliveryOptions, pid );
    } else {
      const url = '/svc/rxorders/deliveryoptions';
      this._checkout.loader = true;
      this._httpService.postData(url, { allianceOrder: true })
        .subscribe(
          (response) => {
            this._checkout.loader = false;
            if (response.rxorders) {
              this.cardData = this.getCardData( response, pid );
            } else if (response.messages) {
              this._messageService.addMessage(
                new Message(
                  response.messages[0].message,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          },
          (error) => {
            this._checkout.loader = false;
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.wps_cto,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          });
    }
  }

  getCardData( data, pid ) {
    return data.checkoutDetails.find( (item) => {
        return item.subType === CHECKOUT.type.SC && item.scriptMedId === pid;
      }
    ).boxDetails.shippingInfo;
  }

  saveCardInfo( cardPayload, isUpdate, baseUrl: string ) {
    this._checkout.loader = true;
    this._checkout.loaderOverlay = true;
    this._httpService.postData(Microservice.add_update_cc_sp, cardPayload).subscribe((res) => {
      this._checkout.loader = false;
      this._checkout.loaderOverlay = false;
      if (res.messageList[0].code === 'WAG_I_SRX_PAYMENTS_001' || res.messageList[0].code === 'WAG_I_SRX_PAYMENTS_002') {
        this._gaService.sendEvent(this.gaEvent(isUpdate));

        this._checkout.storeReviewRefresh('true');
        if ( baseUrl === undefined ) {
          this._util.navigate(this.ROUTES.checkout_sp.absoluteRoute);
        } else {
          this._util.navigate(baseUrl);
        }

      } else {
        this._messageService.addMessage(
          new Message(
            res.messageList[0].textMessage,
            res.messageList[0].type
          )
        );
      }
    }, (err) => {
      this._checkout.loader = false;
      this._checkout.loaderOverlay = false;
      this._messageService.addMessage(
        new Message(
          ARX_MESSAGES.ERROR.wps_cto,
          ARX_MESSAGES.MESSAGE_TYPE.ERROR
        )
      );
    });
  }

  gaEvent(isUpdate) {
    const event = <GAEvent>{};
    event.category = (this._checkout.isCombo) ? GA.categories.checkout_combo : GA.categories.checkout_speciality;
    event.action = (isUpdate) ?
      (this._checkout.isCombo) ? GA.actions.checkout_combo.update_payment_speciality : GA.actions.checkout_speciality.update_payment :
      (this._checkout.isCombo) ? GA.actions.checkout_combo.add_payment_speciality : GA.actions.checkout_speciality.add_payment;
    return event;
  }

}
