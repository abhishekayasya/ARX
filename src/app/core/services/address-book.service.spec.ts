import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { AppTestingModule } from '../../../../tests/app.testing.module';
import { AddressBookService } from './address-book.service';
import { CommonUtil } from './common-util.service';
import { UserService } from './user.service';

describe('AppContextService', () => {
  let addressBookService: AddressBookService;
  let _userService: UserService;
  let _common: CommonUtil;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .then(() => {
        addressBookService = TestBed.get(AddressBookService);
        _userService = TestBed.get(UserService);
        _common = TestBed.get(CommonUtil);
      });
  }));
  it('addressBookService Instance is available', () => {
    expect(addressBookService).toBeTruthy();
  });

  it('addressBookService - saveAddressData', () => {
    addressBookService.saveAddressData('testAddress', 'testHomeAddress');
    expect(addressBookService).toBeTruthy();
  });
});
