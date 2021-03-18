import { Microservice } from '@app/config/microservice.constant';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreConstants, ROUTES, STATE_US } from '@app/config';
import { Message } from '@app/models/message.model';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { ARX_MESSAGES } from '@app/config/messages.constant';
import { MessageService } from '@app/core/services/message.service';
import { AppContext } from '@app/core/services/app-context.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CHECKOUT } from '@app/config/checkout.constant';
import { GA } from '@app/config/ga-constants';
import { GAEvent } from '@app/models/ga/ga-event';
import { CheckoutService } from '@app/core/services/checkout.service';

@Component({
  selector: 'arxrf-usps',
  templateUrl: './usps-verification.components.html',
  styleUrls: ['./usps-verification.components.scss']
})
// tslint:disable-next-line: component-class-suffix
export class UspsVerificationComponents implements OnInit {
  addressToAdd: any;
  loaderState = false;
  suggestedAddress: Array<any>;
  isSuggestedAddressExist = false;
  STATE_US = STATE_US;
  private suggestedAddressToPick = 0;

  type: string;
  editAddressId;
  routes = ROUTES;

  addressBookPath: string;
  precReviewPath: string;

  constructor(
    private _http: HttpClientService,
    private _userService: UserService,
    private _messageService: MessageService,
    private _router: Router,
    private _common: CommonUtil,
    private _checkout: CheckoutService
  ) {
    this.addressToAdd = JSON.parse(
      sessionStorage.getItem(AppContext.CONST.key_address_confirm)
    );
    this.type = this.addressToAdd.type;
    this.editAddressId = this.addressToAdd.editAddressId;
    delete this.addressToAdd.type;
    delete this.addressToAdd.editAddressId;
    sessionStorage.removeItem(AppContext.CONST.key_address_confirm);
  }

  ngOnInit() {
    this.preparingAddressBookPath();
    this.preparePrescReviewPath();

    const url = Microservice.validateaddress;
    this._http
      .doPost(url, this.prepareData())
      .then(response => {
        this.loaderState = false;
        const _body = response.json();
        if (_body.suggestedAddr) {
          this.isSuggestedAddressExist = true;
          this.suggestedAddress = _body.suggestedAddr;
          this.setStateName();
        } else {
          // if (_body.messages[0].code != "WAG_E_ADDRESS_001") {
          if (_body.messages) {
            this._messageService.addMessage(
              new Message(
                _body.messages[0].message || ARX_MESSAGES.ERROR.service_failed,
                _body.messages[0].type || ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          } else {
            this._messageService.addMessage(
              new Message(
                ARX_MESSAGES.ERROR.service_failed,
                ARX_MESSAGES.MESSAGE_TYPE.ERROR
              )
            );
          }
        }
      })
      .catch(error => {
        this.onsubmitHomeDeliveryAddressError();
      });
  }

  setStateName() {
    this.suggestedAddress.forEach(
      (address, index) =>
        (address['stateName'] = this.STATE_US.filter(
          state => state.short_name === address['state']
        )[0].name)
    );
  }

  saveAddressChanges(isUserAddress: boolean) {
    const addressData = isUserAddress
      ? JSON.parse(JSON.stringify(this.addressToAdd))
      : this.prepareSuggestedAddressData();

    addressData['street1'] = addressData['street'];
    addressData['type'] = 'HOMEDELIVERY';
    addressData['subType'] = 'HOMEDELIVERY';
    addressData['channel'] = 'DOTCOM';
    addressData['channelType'] = 'SIGNIN';
    addressData['source'] = 'ECOMM_ADDRESS_SECTION';
    addressData['zip'] = addressData.zipCode;

    if (this.editAddressId) {
      this.submitHomeDeliveryEditAddress(addressData);
    } else {
      this.submitHomeDeliveryAddress(addressData);
    }
  }

  submitHomeDeliveryEditAddress(addressData: any) {
    const url = this._common.stringFormate(
      Microservice.mailservice_address_update,
      [this.editAddressId]
    );
    this._http
      .doPut(url, addressData)
      .then(response => {
        const _body = response.json();
        if (_body.messages[0].code === 'WAG_I_AB_1001') {
          if (addressData.isPreferred) {
            // after successfully address updation select the address for submit order page.
            const urlToSelectAddress =
              Microservice.home_delivery_address_update;
            addressData['addressId'] = this.editAddressId;

            this._http.postData(urlToSelectAddress, addressData).subscribe(
              result => {
                if (
                  result.messages === undefined ||
                  result.messages[0].code === 'WAG_I_AB_1001'
                ) {
                  if (this.type === CHECKOUT.type.HDR) {
                    this._common.navigate(
                      ROUTES.home_delivery_refill_reminder.absoluteRoute
                    );
                  } else {
                    this._checkout.storeReviewRefresh('true');
                    this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
                  }
                } else {
                  this._messageService.addMessage(
                    new Message(
                      result.messages[0].message,
                      result.messages[0].type
                    )
                  );
                }
              },
              error => {
                this._messageService.addMessage(
                  new Message(
                    ARX_MESSAGES.ERROR.wps_cto,
                    ARX_MESSAGES.MESSAGE_TYPE.ERROR
                  )
                );
              }
            );
          } else {
            const data = {
              success: 'true',
              message: _body.messages[0].message
            };
            sessionStorage.setItem(
              AppContext.CONST.key_address_success,
              JSON.stringify(data)
            );

            if (this.type === CHECKOUT.type.HDR) {
              this._common.navigate(
                ROUTES.home_delivery_refill_reminder.children.address_book
                  .absoluteRoute
              );
            } else {
              this._common.navigate(
                ROUTES.checkout_hd.children.address_book.absoluteRoute
              );
            }
          }
          // this._common.navigate( ROUTES.checkout_hd.absoluteRoute );
        } else {
          this._messageService.addMessage(
            new Message(_body.messages[0].message, _body.messages[0].type)
          );
        }
      })
      .catch(error => {
        this._messageService.addMessage(
          new Message(
            ARX_MESSAGES.ERROR.wps_cto,
            ARX_MESSAGES.MESSAGE_TYPE.ERROR
          )
        );
      });
  }

  submitHomeDeliveryAddress(addressData: any) {
    addressData.newlyAdded = 'true';
    const url = Microservice.mailservice_address_add;
    this._http.putData(url, addressData).subscribe(
      response => {
        this.loaderState = false;
        if (response.messages[0].code === 'WAG_I_AB_1000') {
          // select the entered or suggested address and redirect to 'home del submit order page'.
          // tslint:disable-next-line: no-shadowed-variable
          const url = Microservice.home_delivery_address_update;
          const selectAddress = addressData;
          this._http.postData(url, selectAddress).subscribe(
            result => {
              if (result.messages === undefined) {
                if (this.type === CHECKOUT.type.HDR) {
                  this._common.navigate(
                    ROUTES.home_delivery_refill_reminder.absoluteRoute
                  );
                } else {
                  this._checkout.storeReviewRefresh('true');
                  this._common.navigate(ROUTES.checkout_hd.absoluteRoute);
                }
              } else {
                this._messageService.addMessage(
                  new Message(
                    result.messages[0].message,
                    result.messages[0].type
                  )
                );
              }
            },
            error => {
              this._messageService.addMessage(
                new Message(
                  ARX_MESSAGES.ERROR.wps_cto,
                  ARX_MESSAGES.MESSAGE_TYPE.ERROR
                )
              );
            }
          );

          // this._common.navigate( ROUTES.checkout_hd.children.address_book.absoluteRoute );
        } else {
          this._messageService.addMessage(
            new Message(response.messages[0].message, response.messages[0].type)
          );
        }
      },

      error => {
        this.onsubmitHomeDeliveryAddressError();
      }
    );
  }

  prepareData() {
    return {
      deliveryAddr: {
        zipcode: this.addressToAdd['zipCode'],
        city: this.addressToAdd['city'],
        street: this.addressToAdd['street'],
        state: this.addressToAdd['state'],
        zipext: this.addressToAdd['addOnZipCode']
      },
      isPreferred: this.addressToAdd['isPreferred']
    };
  }

  prepareSuggestedAddressData() {
    return {
      firstName: this.addressToAdd['firstName'],
      lastName: this.addressToAdd['lastName'],
      zipCode:
        this.suggestedAddress.length === 1
          ? this.suggestedAddress[0]['zip']
          : this.suggestedAddress[this.suggestedAddressToPick]['zip'],
      addOnZipCode:
        this.suggestedAddress.length === 1
          ? this.suggestedAddress[0]['zipext']
          : this.suggestedAddress[this.suggestedAddressToPick]['zipext'],
      city:
        this.suggestedAddress.length === 1
          ? this.suggestedAddress[0]['city']
          : this.suggestedAddress[this.suggestedAddressToPick]['city'],
      street:
        this.suggestedAddress.length === 1
          ? this.suggestedAddress[0]['street']
          : this.suggestedAddress[this.suggestedAddressToPick]['street'],
      state:
        this.suggestedAddress.length === 1
          ? this.suggestedAddress[0]['state']
          : this.suggestedAddress[this.suggestedAddressToPick]['state'],
      isPreferred: this.addressToAdd['isPreferred']
    };
  }

  suggestedAddressToSelect(i) {
    this.suggestedAddressToPick = i;
  }

  preparingAddressBookPath() {
    switch (this.type) {
      case CHECKOUT.type.HD:
        this.addressBookPath = this.routes.checkout_hd.children.address_book.absoluteRoute;
        break;
      case CHECKOUT.type.HDR:
        this.addressBookPath = this.routes.home_delivery_refill_reminder.children.address_book.absoluteRoute;
    }
  }

  preparePrescReviewPath() {
    if (this._checkout.isCombo) {
      if (this.type === CHECKOUT.type.HD) {
        this.precReviewPath =
          ROUTES.checkout_combined.children.home_delivery.absoluteRoute;
      } else {
        this.precReviewPath =
          ROUTES.checkout_combined.children.specialty.absoluteRoute;
      }
    } else if (this.type === CHECKOUT.type.HD) {
      this.precReviewPath = ROUTES.checkout_hd.absoluteRoute;
    } else if (this.type === CHECKOUT.type.HDR) {
      this.precReviewPath = ROUTES.home_delivery_refill_reminder.absoluteRoute;
    } else {
      this.precReviewPath = ROUTES.checkout_sp.absoluteRoute;
    }
  }
  onsubmitHomeDeliveryAddressError() {
    this.loaderState = false;
    this._messageService.addMessage(
      new Message(ARX_MESSAGES.ERROR.wps_cto, ARX_MESSAGES.MESSAGE_TYPE.ERROR)
    );
  }
}
