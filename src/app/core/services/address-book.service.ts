import { Injectable } from '@angular/core';

@Injectable()
export class AddressBookService {
  addresses: Array<any>;
  homeAddress = {};

  constructor() {}

  saveAddressData(addressData, homeAddress?) {
    this.addresses = addressData;
    this.homeAddress = homeAddress;
  }
}
