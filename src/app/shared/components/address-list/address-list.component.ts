import { Microservice } from '@app/config/microservice.constant';

import { AfterViewInit, Component, Input } from '@angular/core';
import { CHECKOUT } from '@app/config/checkout.constant';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '@app/core/services/message.service';
import { ARX_MESSAGES, ROUTES } from '@app/config';
import { Message } from '@app/models';
import { PARAM } from '@app/config/param.constant';
import { AddressBookService } from '@app/core/services/address-book.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { AppContext } from '@app/core/services/app-context.service';

@Component({
  selector: 'arxrf-address-selector',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements AfterViewInit {
  loader = true;
  loaderOverlay = false;

  @Input()
  type: string;

  @Input()
  addAddressUrl: string;

  @Input('patientId') scriptMedId: string;

  @Input()
  referralId: string;

  isSpeciality: boolean;
  isCleansed: boolean;

  CHECKOUT = CHECKOUT;
  routes = ROUTES;

  backUrl: string;
  editAddressLink;

  constructor(
    private _userService: UserService,
    private _http: HttpClientService,
    private _message: MessageService,
    public addressesService: AddressBookService,
    private _common: CommonUtil,
    private _checkout: CheckoutService
  ) {
    if ( window && window['ARX_Util'] ) {
      window['ARX_Util'].enableLeavePageConfirmation(false);
    }
  }

  ngAfterViewInit(): void {
    this.fetchAddressList();

    if (this.type === this.CHECKOUT.type.HD) {
      this.editAddressLink =
        ROUTES.checkout_hd.children.edit_address.absoluteRoute;
    } else if (this.type === this.CHECKOUT.type.HDR) {
      this.editAddressLink =
        ROUTES.home_delivery_refill_reminder.children.edit_address.absoluteRoute;
    }
    this.isSpeciality =
      this.type === this.CHECKOUT.type.SU ||
      this.type === this.CHECKOUT.type.SC;
    this.isCleansed = this.referralId !== undefined;

    const isSpRxRemainder = localStorage.getItem('isSpecialityRefillRemainder') === 'true';

    if (isSpRxRemainder) {
      this.backUrl = sessionStorage.getItem(AppContext.CONST.spRRUrl);
    } else if (this._checkout.isCombo) {
      this.backUrl =
        ROUTES.checkout_combined.children.home_delivery.absoluteRoute;
      if (this.type === this.CHECKOUT.type.SC) {
        this.backUrl =
          ROUTES.checkout_combined.children.specialty.absoluteRoute;
      } else if (this.type === this.CHECKOUT.type.SU) {
        this.backUrl =
          ROUTES.checkout_combined.children.specialty.absoluteRoute;
      }
    } else if (this.type === this.CHECKOUT.type.HD) {
      this.backUrl = ROUTES.checkout_hd.absoluteRoute;
    } else if (this.type === this.CHECKOUT.type.HDR) {
      this.backUrl = ROUTES.home_delivery_refill_reminder.absoluteRoute;
    } else if (this.type === this.CHECKOUT.type.NEWRX) {
      this.backUrl = ROUTES.hd_prescription.children.edit_address.absoluteRoute;
    } else {
      this.backUrl = ROUTES.checkout_sp.absoluteRoute;
    }
  }

  fetchAddressList() {
    const url = '';
    let observable: Observable<any>;

    const hdAddressRequest = () => {
      const request_body = {};
      request_body['profileId'] = this._userService.user.id;
      return this._http.postData(
        Microservice.mailservice_address_fetch,
        request_body
      );
    };

    switch (this.type) {
      case CHECKOUT.type.HD:
        observable = hdAddressRequest();
        break;

      case CHECKOUT.type.HDR:
        observable = hdAddressRequest();
        break;

      case CHECKOUT.type.SC:
      case CHECKOUT.type.SU:
        // tslint:disable-next-line: prefer-const
        // let addresses = JSON.parse(
        //     sessionStorage.getItem(CHECKOUT.session.key_speciality_addresses)
        //   );
        let current_patient_addresses;
        /* Empting the addresses array got from the sessionStorage
          as it is causes error in case of combined scenario
          (cleansed and non-cleansed) presription selection.
        */
        let addresses;
        addresses = [];
        // if (addresses && addresses.length > 0) {
        //   const addr =  addresses.find(item => {
        //     return item.scriptMedId === this.scriptMedId;
        //   });
        //   if (addr && addr['addresses']) {
        //     current_patient_addresses = addr.addresses;
        //   }

        // } else {
        if (this._checkout.data_deliveryOptions !== undefined) {
          const speciality = this._checkout.data_deliveryOptions.checkoutDetails.find(
            item => {
              return (
                item.referralId === this.referralId &&
                item.scriptMedId === this.scriptMedId
              );
            }
          );
          current_patient_addresses =
            speciality.boxDetails.shippingInfo.srxDeliveryAddr;
        }
        //}
        this.addressesService.saveAddressData(current_patient_addresses);
        this.updateAddressSelected();
        this.loader = false;
        return false;
    }

    observable.subscribe(
      json => {
        if (json.addresses === undefined && json.address === undefined) {
          if (this.type === CHECKOUT.type.SC) {
            this._common.replaceUrl(
              // tslint:disable-next-line: max-line-length
              `${this.routes.checkout_sp.children.add_address.absoluteRoute}?${PARAM.speciality_address_book.patient_id}=${this.scriptMedId}&${PARAM.speciality_address_book.referral_id}=${this.referralId}`
            );
          } else {
            this.loader = false;
          }
          this.addressesService.saveAddressData([]);
        } else {
          this.loader = false;
          this.addressesService.saveAddressData(json.addresses || json.address);
          // set default addrress
          this.updateAddressSelected();
        }
      },

      error => {
        this.loader = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.service_failed,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  updateAddressSelected() {
    if (
      this.addressesService.addresses &&
      this.addressesService.addresses.length
    ) {
      for (const idx in this.addressesService.addresses) {
        if (
          this.addressesService.addresses[idx].preferred ||
          this.addressesService.addresses[idx].isPreferred ||
          this.addressesService.addresses[idx].defaultAddress
        ) {
          // tslint:disable-next-line: radix
          this.selectAddress(parseInt(idx));
        }
      }
    }
  }

  deleteAddress(addressID): void {
    this.loader = true;
    this.loaderOverlay = true;
    const url = this._common.stringFormate(
      Microservice.mailservice_address_delete,
      [addressID]
    );

    const request_body = <{ profileId: string; source: string }>{};
    request_body.profileId = this._userService.user.id;
    request_body.source = 'ARX_ADDRESS_SECTION';

    this._http.deleteData(url, request_body).subscribe(
      res => {
        this.loader = false;
        this.loaderOverlay = false;
        if (res.messages[0].code === 'WAG_I_AB_1002') {
          this.addressesService.saveAddressData(res.addresses);
          this._message.addMessage(
            new Message(res.messages[0].message, res.messages[0].type)
          );
        } else {
          this.loader = false;
          this._message.addMessage(
            new Message(res.messages[0].message, res.messages[0].type)
          );
        }
      },
      err => {
        this.loaderOverlay = false;
        this.loader = false;
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  selectAddress(index: number): void {
    for (const idx in this.addressesService.addresses) {
      if (Number(idx) === index) {
        this.addressesService.addresses[index].preferred = true;
        this.addressesService.addresses[index].isPreferred = true;
      } else {
        this.addressesService.addresses[idx].preferred = false;
        this.addressesService.addresses[idx].isPreferred = false;
      }
    }
  }

  /**
   * Send request for address selection.
   */
  selectAddressForCheckout() {
    let addressToSelect;
    const url = this.isSpeciality
      ? Microservice.checkout_speciality_address_change
      : Microservice.home_delivery_address_update;

    const address = this.addressesService.addresses.filter(item => {
      return item.preferred || item.isPreferred;
    })[0];

    if (address.zipCode) {
      address['zip'] = address.zipCode;
      delete address.zipCode;
    }

    if (!this.isSpeciality) {
      address['addressId'] = address.id ? address.id : address.addressId;
    } else {
      if (this.isCleansed) {
        addressToSelect = {
          scriptMedId: this.scriptMedId,
          referralId: this.referralId,
          subType: 'CLEANSED',
          changeType: 'UPDATE',
          referralAddress: false,
          addressId: address.addressId ? address.addressId : address.id
        };
      } else {
        addressToSelect = {
          scriptMedId: this.scriptMedId,
          subType: 'UNSOLICITED',
          changeType: 'UPDATE',
          referralAddress: false,
          addressId: address.addressId ? address.addressId : address.id
        };
      }
    }
    // let body  = !this.isSpeciality? address : addressToSelect;
    let body = {};
    let request;
    if (this.isSpeciality) {
      body = addressToSelect;
      request = this._http.postData(url, body);
    } else {
      body = this.prepareHDaddress(address);
      request = this._http.postData(url, body);
    }
    request.subscribe(
      result => {
        if (result.messageList === undefined) {
          this._checkout.storeReviewRefresh('true');
          this._common.navigate(this.backUrl);
        } else if (
          result.messageList !== undefined &&
          result.messageList[0].code !== ARX_MESSAGES.MESSAGE_TYPE.ERROR
        ) {
          this._checkout.storeReviewRefresh('true');
          this._common.navigate(this.backUrl);
        } else {
          this._message.addMessage(
            new Message(
              result.messageList[0].message,
              result.messageList[0].type
            )
          );
        }
      },
      error => {
        this._message.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      }
    );
  }

  prepareHDaddress(address) {
    const body = {};
    body['type'] = 'HOMEDELIVERY';
    body['subType'] = 'HOMEDELIVERY';
    body['channel'] = 'DOTCOM';
    body['channelType'] = 'SIGNIN';
    body['street'] = address.street1;
    body['zip'] = address.zip;
    body['zipCode;'] = address.zipCode;
    body['addressId'] = address.addressId;
    body['isPreferred'] = address.preferred
      ? address.preferred
      : address.isPreferred;
    body['msRequest'] = address.msRequest;
    body['newlyAdded'] = address.newlyAdded;
    body['id'] = address.id;
    body['city'] = address.city;
    body['state'] = address.state;
    return body;
  }
}
