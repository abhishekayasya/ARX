import { AfterViewInit, Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'app/core/services/message.service';
import { HttpClientService } from 'app/core/services/http.service';
import { UserService } from 'app/core/services/user.service';
import { HomeDeliveryService } from 'app/pages/checkout/home_delivery/home-delivery.service';
import { ARX_MESSAGES } from 'app/config/index';
import { Message } from 'app/models/index';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CheckoutService } from 'app/core/services/checkout.service';
import { CHECKOUT } from 'app/config/checkout.constant';
import { Microservice } from '@app/config/microservice.constant';

@Component({
  selector: 'arxrf-homedelivery-address-select',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.scss']
})
export class EditAddressComponent implements AfterViewInit {
  private aid: string;

  addressToEdit: any;
  addressSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  editObservable: Observable<any> = this.addressSubject.asObservable();

  CHECKOUT = CHECKOUT;

  constructor(
    private _route: ActivatedRoute,
    private _message: MessageService,
    private _http: HttpClientService,
    private _userService: UserService,
    public homeDelivery: HomeDeliveryService,
    public checkout: CheckoutService,
    public cdr: ChangeDetectorRef
  ) {
    this._route.queryParams.subscribe(param => {
      // istanbul ignore else
      if (param.aid) {
        this.aid = param.aid;
      }
    });
  }

  ngAfterViewInit(): void {
    this.checkout.loader = true;
    // istanbul ignore else
    if (this.aid) {
      const request_body = {};
      request_body['profileId'] = localStorage.getItem('uid');
      this._http
        .postData(Microservice.mailservice_address_fetch, request_body)
        .subscribe(
          response => {
            this.checkout.loader = false;
            this.addressToEdit = response.addresses.find(address => {
              return address.id === this.aid;
            });
            this.addressSubject.next(this.addressToEdit);
          },

          error => {
            this.checkout.loader = false;
            this._message.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.service_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        );
    }
    this.cdr.detectChanges();
  }
}
