import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAddressComponent } from './select-address.component';
import { SharedModule } from '@app/shared/shared.module';
import { UserService } from '@app/core/services/user.service';
import { HttpClientService } from '@app/core/services/http.service';
import { RouterModule } from '@angular/router';
import { MessageService } from '@app/core/services/message.service';
import { CommonUtil } from '@app/core/services/common-util.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckoutService } from '@app/core/services/checkout.service';
import { GaService } from '@app/core/services/ga-service';
import { AppContext } from '@app/core/services/app-context.service';
import { DatePipe, APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AddressBookService } from '@app/core/services/address-book.service';
import { addressMockData } from '../../../../../../test/mocks/search-address.mock';

describe('SelectAddressComponent', () => {
  let component: SelectAddressComponent;
  let fixture: ComponentFixture<SelectAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectAddressComponent],
      imports: [
        SharedModule,
        RouterModule.forRoot([]),
        // tslint:disable-next-line: deprecation
        HttpModule,
        HttpClientModule
      ],
      providers: [
        DatePipe,
        { provide: APP_BASE_HREF, useValue: '/' },
        AppContext,
        UserService,
        HttpClientService,
        MessageService,
        CommonUtil,
        CookieService,
        CheckoutService,
        GaService,
        AddressBookService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAddressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngAfterViewInit', () => {
    sessionStorage.setItem(
      AppContext.CONST.key_address_success,
      addressMockData
    );
    component.ngAfterViewInit();
    expect(component).toBeTruthy();
  });
});
